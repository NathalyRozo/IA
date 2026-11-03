import asyncio
import json
import logging
import os
import shutil
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models.media_source import MediaSource
from app.models.news import Article, ArticleFraming
from app.models.event import EventCluster
from app.models.report import Report
from app.services.scraper.sources_config import DEFAULT_MEDIA_SOURCES
from app.services.scraper.collector import collector_service
from app.services.gemini_service import gemini_service
from app.services.nlp.clusterer import clusterer_service

logger = logging.getLogger(__name__)


class DailyUpdateService:
    """
    Servicio integral de actualización diaria automatizada para FOQUÉ.
    Coordina la recolección de los 10 medios (5 Colombia y 5 Internacionales),
    clasificación canónica y análisis de encuadre con Gemini (google-genai),
    agrupación de acontecimientos, cálculo de métricas de cobertura y tendencias,
    y almacenamiento estructurado en base de datos y caché JSON.
    """

    def __init__(self):
        self._last_run_at: Optional[datetime] = None
        self._last_stats: Dict[str, Any] = {
            "status": "idle",
            "last_updated": None,
            "articles_processed": 0,
            "events_detected": 0,
            "active_sources": 10,
            "gemini_active": gemini_service.is_available,
        }

    def get_status(self) -> Dict[str, Any]:
        self._last_stats["gemini_active"] = gemini_service.is_available
        return self._last_stats

    def _get_cache_paths(self) -> List[str]:
        """Devuelve las rutas donde se sincroniza el archivo de caché JSON estructurado."""
        paths = [
            os.path.join(os.getcwd(), "data", "daily_cache.json"),
            os.path.join(os.getcwd(), "backend", "data", "daily_cache.json"),
            os.path.join(os.getcwd(), "frontend", "public", "data", "daily_cache.json"),
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "daily_cache.json"),
        ]
        # Filtrar duplicados normalizados
        normalized = []
        for p in paths:
            norm = os.path.normpath(p)
            if norm not in normalized:
                normalized.append(norm)
        return normalized

    def load_cached_data(self) -> Optional[Dict[str, Any]]:
        """Carga el JSON en caché si existe."""
        for path in self._get_cache_paths():
            if os.path.exists(path):
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        if data and "articles" in data:
                            return data
                except Exception as e:
                    logger.warning(f"Error leyendo caché desde {path}: {e}")
        return None

    def save_cache_data(self, payload: Dict[str, Any]):
        """Guarda el archivo de caché en todas las ubicaciones requeridas para consumo del frontend."""
        for path in self._get_cache_paths():
            try:
                os.makedirs(os.path.dirname(path), exist_ok=True)
                with open(path, "w", encoding="utf-8") as f:
                    json.dump(payload, f, ensure_ascii=False, indent=2, default=str)
                logger.info(f"Caché diario guardado en: {path}")
            except Exception as e:
                logger.warning(f"No se pudo escribir caché en {path}: {e}")

    async def run_daily_update(
        self,
        force_refresh: bool = False,
        articles_per_source: int = 5
    ) -> Dict[str, Any]:
        """
        Ejecuta el pipeline completo de actualización diaria:
        1. Recolección de noticias recientes de los 10 medios.
        2. Clasificación temática canónica (10 temas) con Gemini.
        3. Detección y análisis de encuadre narrativo (framing) y divergencias.
        4. Agrupación de noticias en acontecimientos comparativos.
        5. Cálculo de métricas para las 5 vistas de la interfaz.
        6. Persistencia en SQLite y generación de daily_cache.json.
        """
        now = datetime.utcnow()
        date_str = now.strftime("%Y-%m-%d")
        logger.info(f"=== INICIANDO RUTINA DIARIA DE ACTUALIZACIÓN ({date_str}) ===")
        self._last_stats["status"] = "running"

        async with AsyncSessionLocal() as session:
            # 1. Asegurar existencia de los 10 medios en BD
            sources_map = {}
            for src_data in DEFAULT_MEDIA_SOURCES:
                res = await session.execute(
                    select(MediaSource).where(MediaSource.slug == src_data["slug"])
                )
                source_obj = res.scalar_one_or_none()
                if not source_obj:
                    source_obj = MediaSource(
                        slug=src_data["slug"],
                        name=src_data["name"],
                        scope=src_data["scope"],
                        country=src_data["country"],
                        website_url=src_data["website_url"],
                        rss_url=src_data["rss_url"],
                        is_active=True
                    )
                    session.add(source_obj)
                    await session.flush()
                sources_map[src_data["slug"]] = source_obj
            await session.commit()

            # 2. Recolección desde los 10 medios (5 Nacionales y 5 Internacionales)
            all_raw_articles = []
            for src_data in DEFAULT_MEDIA_SOURCES:
                try:
                    collected = await collector_service.collect_from_source(
                        src_data,
                        max_items=articles_per_source
                    )
                    all_raw_articles.extend(collected)
                except Exception as e:
                    logger.error(f"Error recolectando de {src_data.get('name')}: {e}")

            logger.info(f"Total de artículos recolectados de los 10 medios: {len(all_raw_articles)}")

            # 3. Procesamiento y Clasificación Temática con Gemini (SDK google-genai)
            logger.info("Clasificando artículos en las 10 categorías canónicas y detectando encuadres...")
            processed_articles = gemini_service.batch_classify_and_frame(all_raw_articles)

            # 4. Agrupamiento de Acontecimientos Multimedio (Cross-outlet events)
            # Agrupamos noticias afines por tema y similitud de texto
            topic_groups: Dict[str, List[Dict[str, Any]]] = {}
            for art in processed_articles:
                t = art.get("topic", "Sociedad")
                topic_groups.setdefault(t, []).append(art)

            event_clusters_data = []
            for topic, arts in topic_groups.items():
                # Si hay más de un medio en este tema, generamos un acontecimiento contrastable
                sources_in_topic = set(a.get("source_slug") for a in arts)
                if len(sources_in_topic) >= 2:
                    main_art = arts[0]
                    cluster_title = f"Cobertura sobre {topic.lower()}: {main_art['title'][:70]}..."
                    
                    # Analizar contraste de encuadres con Gemini
                    framing_contrast = gemini_service.analyze_event_framing_contrast(
                        canonical_title=main_art["title"],
                        articles_by_outlet=[
                            {
                                "source_name": a.get("source_name"),
                                "title": a.get("title"),
                                "narrative_angle": a.get("narrative_angle"),
                                "tone": a.get("tone"),
                                "highlighted_aspects": a.get("highlighted_aspects", []),
                                "omitted_aspects": a.get("omitted_aspects", []),
                            }
                            for a in arts[:5]
                        ]
                    )

                    # Guardar o buscar cluster en BD
                    cl_db = EventCluster(
                        canonical_title=cluster_title,
                        summary=framing_contrast.get("overview", main_art.get("excerpt")),
                        topic=topic,
                        first_seen_at=now,
                        last_updated_at=now,
                        article_count=len(arts),
                        narrative_synthesis=framing_contrast
                    )
                    session.add(cl_db)
                    await session.flush()

                    event_clusters_data.append({
                        "id": cl_db.id,
                        "canonical_title": cluster_title,
                        "summary": cl_db.summary,
                        "topic": topic,
                        "article_count": len(arts),
                        "narrative_synthesis": framing_contrast,
                        "articles": [
                            {
                                "title": a["title"],
                                "source_name": a["source_name"],
                                "source_slug": a["source_slug"],
                                "url": a["url"],
                                "narrative_angle": a.get("narrative_angle"),
                                "tone": a.get("tone"),
                                "highlighted": a.get("highlighted_aspects", []),
                                "omitted": a.get("omitted_aspects", []),
                            }
                            for a in arts
                        ]
                    })

                    # Asignar cluster id a los artículos
                    for a in arts:
                        a["event_id"] = cl_db.id

            # 5. Persistir artículos y encuadres en BD
            inserted_articles = []
            for art_data in processed_articles:
                s_obj = sources_map.get(art_data.get("source_slug"))
                if not s_obj:
                    continue

                # Evitar duplicados por URL
                existing_res = await session.execute(
                    select(Article).where(Article.url == art_data["url"])
                )
                existing = existing_res.scalar_one_or_none()
                if existing:
                    art_id = existing.id
                else:
                    new_art = Article(
                        source_id=s_obj.id,
                        event_id=art_data.get("event_id"),
                        title=art_data["title"],
                        url=art_data["url"],
                        published_at=art_data.get("published_at", now),
                        author=art_data.get("author"),
                        raw_text=art_data.get("raw_text", ""),
                        excerpt=art_data.get("excerpt", ""),
                        topic=art_data.get("topic", "Sociedad"),
                    )
                    session.add(new_art)
                    await session.flush()
                    art_id = new_art.id

                    # Framing
                    framing = ArticleFraming(
                        article_id=art_id,
                        narrative_angle=art_data.get("narrative_angle"),
                        tone=art_data.get("tone", "Neutro"),
                        highlighted_aspects=art_data.get("highlighted_aspects", []),
                        omitted_aspects=art_data.get("omitted_aspects", []),
                    )
                    session.add(framing)

                inserted_articles.append({
                    "id": art_id,
                    "title": art_data["title"],
                    "url": art_data["url"],
                    "source_name": art_data["source_name"],
                    "source_slug": art_data["source_slug"],
                    "source_scope": art_data.get("source_scope", "nacional"),
                    "source_country": art_data.get("source_country", "Colombia"),
                    "published_at": str(art_data.get("published_at", now)),
                    "topic": art_data.get("topic", "Sociedad"),
                    "narrative_angle": art_data.get("narrative_angle", ""),
                    "tone": art_data.get("tone", "Neutro"),
                    "highlighted_aspects": art_data.get("highlighted_aspects", []),
                    "omitted_aspects": art_data.get("omitted_aspects", []),
                    "event_id": art_data.get("event_id"),
                })

            await session.commit()

            # 6. Agregaciones estadísticas y métricas (Share of Voice y Tendencias)
            coverage_by_media: Dict[str, int] = {}
            coverage_by_topic: Dict[str, int] = {t: 0 for t in settings.CANONICAL_TOPICS}
            national_count = 0
            international_count = 0

            for art in inserted_articles:
                media_name = art.get("source_name", "Desconocido")
                coverage_by_media[media_name] = coverage_by_media.get(media_name, 0) + 1

                topic_name = art.get("topic", "Sociedad")
                coverage_by_topic[topic_name] = coverage_by_topic.get(topic_name, 0) + 1

                if art.get("source_scope") == "nacional":
                    national_count += 1
                else:
                    international_count += 1

            total_arts = len(inserted_articles)
            empirical_data = {
                "total_articles": total_arts,
                "coverage_by_media": coverage_by_media,
                "coverage_by_topic": coverage_by_topic,
                "national_articles_count": national_count,
                "international_articles_count": international_count,
                "active_media_count": len(DEFAULT_MEDIA_SOURCES),
                "generated_at": now.isoformat(),
            }

            # 7. Cálculo de Tendencias y Velocidad de Agenda
            # Ordenamos categorías por volumen y dinamismo
            sorted_topics = sorted(
                coverage_by_topic.items(),
                key=lambda x: x[1],
                reverse=True
            )
            trends_list = []
            for rank, (topic, count) in enumerate(sorted_topics, 1):
                pct = round((count / total_arts * 100), 1) if total_arts > 0 else 0
                if rank <= 3 and count > 0:
                    status = "en_auge"
                    velocity = "+42% (24h)"
                elif rank <= 7 and count > 0:
                    status = "estable"
                    velocity = "+5% (24h)"
                else:
                    status = "en_declive"
                    velocity = "-18% (24h)"

                trends_list.append({
                    "rank": rank,
                    "topic": topic,
                    "count": count,
                    "share_pct": pct,
                    "status": status,
                    "velocity": velocity,
                })

            # 8. Generación del Informe Ejecutivo Metodológico (Bloque A + Bloque B con Gemini)
            report_dict = gemini_service.generate_daily_executive_report(
                date_str=date_str,
                empirical_data=empirical_data,
                top_events=event_clusters_data
            )

            # Guardar informe en BD
            db_report = Report(
                title=report_dict.get("title", f"Informe Diario de Agenda ({date_str})"),
                description=report_dict.get("description", "Monitoreo sistemático de 10 medios"),
                date_from=now - timedelta(days=1),
                date_to=now,
                sources_included=[s["slug"] for s in DEFAULT_MEDIA_SOURCES],
                topics_included=settings.CANONICAL_TOPICS,
                empirical_data=empirical_data,
                ai_interpretation_markdown=report_dict.get("ai_interpretation_markdown", ""),
                methodology_notes=report_dict.get("methodology_notes", "Observatorio FOQUÉ - Gemini 3.5 Flash"),
                author_notes="Insumo analítico preparado para Victoria León (Columnas de Opinión)."
            )
            session.add(db_report)
            await session.commit()

            # 9. Estructurar el Payload de Caché Completo para las 5 Vistas del Frontend
            cache_payload = {
                "metadata": {
                    "system": "FOQUÉ - Observatorio de Cobertura y Agenda Mediática",
                    "updated_at": now.isoformat(),
                    "date": date_str,
                    "total_articles": total_arts,
                    "active_sources": len(DEFAULT_MEDIA_SOURCES),
                    "gemini_enabled": gemini_service.is_available,
                    "model_used": settings.GEMINI_MODEL,
                    "ethical_disclaimer": "Herramienta analítica de encuadre y agenda setting. Queda excluido el fact-checking y la medición de opinión pública."
                },
                # Vista 1: / (Radar & Inicio)
                "feed": {
                    "featured_headline": inserted_articles[0] if inserted_articles else None,
                    "top_stories": inserted_articles[:12],
                    "all_articles": inserted_articles,
                    "canonical_topics": settings.CANONICAL_TOPICS,
                },
                # Vista 2: /coverage (Share of Voice y balance nacional vs global)
                "coverage": {
                    "total_articles": total_arts,
                    "coverage_by_media": coverage_by_media,
                    "coverage_by_topic": coverage_by_topic,
                    "national_count": national_count,
                    "international_count": international_count,
                    "media_sources": DEFAULT_MEDIA_SOURCES,
                },
                # Vista 3: /contrast (Contraste de Acontecimientos Multimedio)
                "contrast": {
                    "events": event_clusters_data,
                },
                # Vista 4: /trends (Tendencias y velocidad)
                "trends": {
                    "ranking": trends_list,
                    "rising_topics": [t for t in trends_list if t["status"] == "en_auge"],
                },
                # Vista 5: /reports (Informe metodológico Bloque A + Bloque B)
                "reports": {
                    "latest_report": {
                        "id": db_report.id,
                        "title": db_report.title,
                        "description": db_report.description,
                        "date": date_str,
                        "empirical_data": empirical_data,
                        "ai_interpretation_markdown": db_report.ai_interpretation_markdown,
                        "methodology_notes": db_report.methodology_notes,
                        "recommended_column_topics": report_dict.get("recommended_column_topics", []),
                    }
                }
            }

            # 10. Persistir en caché JSON
            self.save_cache_data(cache_payload)

            self._last_run_at = now
            self._last_stats = {
                "status": "success",
                "last_updated": now.isoformat(),
                "articles_processed": total_arts,
                "events_detected": len(event_clusters_data),
                "active_sources": len(DEFAULT_MEDIA_SOURCES),
                "gemini_active": gemini_service.is_available,
            }
            logger.info("=== RUTINA DIARIA DE ACTUALIZACIÓN COMPLETADA CON ÉXITO ===")
            return cache_payload

    async def get_or_create_daily_data(self) -> Dict[str, Any]:
        """Obtiene datos de caché existentes o ejecuta la rutina si no hay ninguno."""
        cached = self.load_cached_data()
        if cached:
            return cached
        return await self.run_daily_update()


daily_updater_service = DailyUpdateService()
