import asyncio
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import feedparser
import httpx
import trafilatura

from app.core.config import settings

logger = logging.getLogger(__name__)


class NewsCollector:
    """
    Servicio de recopilación ética de noticias vía RSS y extracción limpia de texto.
    Cumple con el límite ético del PRD: consulta exclusivamente los 10 medios predefinidos.
    """

    def __init__(self):
        self.headers = {
            "User-Agent": settings.USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }

    async def fetch_feed_entries(self, rss_url: str) -> List[Dict[str, Any]]:
        """Descarga e interpreta un feed RSS."""
        if not rss_url:
            return []
        try:
            async with httpx.AsyncClient(timeout=10.0, headers=self.headers, follow_redirects=True) as client:
                response = await client.get(rss_url)
                if response.status_code != 200:
                    logger.warning(f"Respuesta HTTP {response.status_code} al consultar feed: {rss_url}")
                    return []
                feed = feedparser.parse(response.text)
                return feed.entries[: settings.MAX_ARTICLES_PER_FEED]
        except Exception as e:
            logger.warning(f"Error consultando feed {rss_url}: {e}")
            return []

    async def extract_article_content(self, url: str) -> Optional[Dict[str, Any]]:
        """Extrae el contenido limpio de una noticia usando trafilatura."""
        try:
            async with httpx.AsyncClient(timeout=8.0, headers=self.headers, follow_redirects=True) as client:
                response = await client.get(url)
                if response.status_code != 200:
                    return None

                downloaded = response.text
                extracted_text = trafilatura.extract(
                    downloaded,
                    include_links=False,
                    include_images=False,
                    output_format="txt"
                )
                metadata = trafilatura.extract_metadata(downloaded)

                return {
                    "text": extracted_text or "",
                    "author": metadata.author if metadata else None,
                    "excerpt": metadata.description if metadata else None,
                }
        except Exception as e:
            logger.debug(f"No se pudo extraer contenido completo de {url}: {e}")
            return None

    def parse_entry_date(self, entry: Any) -> datetime:
        """Parsea la fecha de publicación del feed a datetime UTC."""
        if hasattr(entry, "published_parsed") and entry.published_parsed:
            try:
                import time
                return datetime.fromtimestamp(time.mktime(entry.published_parsed), tz=timezone.utc).replace(tzinfo=None)
            except Exception:
                pass
        return datetime.utcnow()

    async def collect_from_source(self, source_info: Dict[str, Any], max_items: int = 15) -> List[Dict[str, Any]]:
        """
        Procesa un medio individual y recopila sus noticias más recientes.
        Si la URL primaria de RSS no arroja resultados, utiliza automáticamente la URL de respaldo.
        """
        rss_url = source_info.get("rss_url")
        fallback_url = source_info.get("fallback_rss_url")

        entries = await self.fetch_feed_entries(rss_url)
        if not entries and fallback_url:
            logger.info(f"Usando feed de respaldo para {source_info.get('name')}: {fallback_url}")
            entries = await self.fetch_feed_entries(fallback_url)

        collected_articles = []
        for entry in entries[:max_items]:
            url = getattr(entry, "link", None)
            title = getattr(entry, "title", None)
            if not url or not title:
                continue

            summary = getattr(entry, "summary", "")
            # Limpiar etiquetas HTML básicas del summary
            if "<" in summary and ">" in summary:
                from bs4 import BeautifulSoup
                summary = BeautifulSoup(summary, "html.parser").get_text(separator=" ").strip()

            pub_date = self.parse_entry_date(entry)
            author = getattr(entry, "author", None)

            collected_articles.append({
                "title": title.strip(),
                "url": url.strip(),
                "published_at": pub_date,
                "raw_text": summary,
                "excerpt": summary or title.strip(),
                "author": author,
                "source_slug": source_info.get("slug"),
                "source_name": source_info.get("name"),
                "source_scope": source_info.get("scope", "nacional"),
                "source_country": source_info.get("country", "Colombia"),
            })

        logger.info(f"Recolectados {len(collected_articles)} artículos de {source_info.get('name')}")
        return collected_articles


collector_service = NewsCollector()
