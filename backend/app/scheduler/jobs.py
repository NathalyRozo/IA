import logging
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.models.media_source import MediaSource
from app.models.news import Article, ArticleFraming
from app.models.event import EventCluster
from app.services.scraper.sources_config import DEFAULT_MEDIA_SOURCES
from app.services.scraper.collector import collector_service
from app.services.nlp.classifier import classifier_service
from app.services.nlp.clusterer import clusterer_service

logger = logging.getLogger(__name__)


async def init_media_sources():
    """Inicializa en base de datos los 10 medios de comunicación si no existen."""
    async with AsyncSessionLocal() as session:
        for src_data in DEFAULT_MEDIA_SOURCES:
            result = await session.execute(
                select(MediaSource).where(MediaSource.slug == src_data["slug"])
            )
            existing = result.scalar_one_or_none()
            if not existing:
                source = MediaSource(**src_data)
                session.add(source)
        await session.commit()
    logger.info("Fuentes de medios verificadas/inicializadas correctamente.")


async def run_ingestion_and_clustering_job():
    """
    Tarea periódica:
    1. Recorre los 10 medios y descarga noticias recientes.
    2. Clasifica cada noticia temáticamente.
    3. Agrupa noticias concurrentes en acontecimientos (EventClusters).
    """
    logger.info("Iniciando tarea de ingesta de noticias...")
    async with AsyncSessionLocal() as session:
        # Obtener medios activos
        result = await session.execute(select(MediaSource).where(MediaSource.is_active == True))
        sources = result.scalars().all()
        sources_by_slug = {s.slug: s for s in sources}

        for source in sources:
            articles_data = await collector_service.collect_from_source({
                "slug": source.slug,
                "rss_url": source.rss_url,
                "name": source.name
            })

            for art_dict in articles_data:
                # Comprobar si ya existe por URL
                exists = await session.execute(
                    select(Article).where(Article.url == art_dict["url"])
                )
                if exists.scalar_one_or_none():
                    continue

                # 1. Clasificación temática
                topic = classifier_service.classify_text(art_dict["title"], art_dict["raw_text"])

                # 2. Embedding semántico
                text_to_embed = f"{art_dict['title']}. {art_dict['excerpt']}"
                embedding = clusterer_service.compute_embedding(text_to_embed)

                # 3. Buscar cluster de acontecimiento activo
                clusters_result = await session.execute(select(EventCluster))
                all_clusters = clusters_result.scalars().all()

                active_cluster_vectors = [
                    (c.id, clusterer_service.compute_embedding(c.canonical_title))
                    for c in all_clusters
                ]

                matched_cluster_id, sim = clusterer_service.find_best_matching_cluster(
                    embedding, active_cluster_vectors
                )

                if matched_cluster_id:
                    event_id = matched_cluster_id
                    # Incrementar contador del cluster
                    cl = await session.get(EventCluster, matched_cluster_id)
                    if cl:
                        cl.article_count += 1
                        cl.last_updated_at = datetime.utcnow()
                else:
                    # Crear nuevo cluster de acontecimiento
                    new_cluster = EventCluster(
                        canonical_title=art_dict["title"],
                        summary=art_dict["excerpt"],
                        topic=topic,
                        article_count=1
                    )
                    session.add(new_cluster)
                    await session.flush()
                    event_id = new_cluster.id

                # Guardar artículo
                article = Article(
                    source_id=source.id,
                    event_id=event_id,
                    title=art_dict["title"],
                    url=art_dict["url"],
                    published_at=art_dict["published_at"],
                    author=art_dict["author"],
                    raw_text=art_dict["raw_text"],
                    excerpt=art_dict["excerpt"],
                    topic=topic,
                    embedding_vector=embedding
                )
                session.add(article)

            await session.commit()

    logger.info("Ciclo de ingesta y agrupación completado con éxito.")
