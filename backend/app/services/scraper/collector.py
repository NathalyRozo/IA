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
    """

    def __init__(self):
        self.headers = {
            "User-Agent": settings.USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }

    async def fetch_feed_entries(self, rss_url: str) -> List[Dict[str, Any]]:
        """Descarga e interpreta un feed RSS."""
        try:
            async with httpx.AsyncClient(timeout=15.0, headers=self.headers, follow_redirects=True) as client:
                response = await client.get(rss_url)
                if response.status_code != 200:
                    logger.warning(f"Error HTTP {response.status_code} al consultar feed: {rss_url}")
                    return []
                feed = feedparser.parse(response.text)
                return feed.entries[: settings.MAX_ARTICLES_PER_FEED]
        except Exception as e:
            logger.error(f"Fallo al leer feed {rss_url}: {str(e)}")
            return []

    async def extract_article_content(self, url: str) -> Optional[Dict[str, Any]]:
        """Extrae el contenido limpio de una noticia usando trafilatura."""
        try:
            async with httpx.AsyncClient(timeout=12.0, headers=self.headers, follow_redirects=True) as client:
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
            logger.debug(f"No se pudo extraer contenido completo de {url}: {str(e)}")
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

    async def collect_from_source(self, source_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Procesa un medio individual y recopila sus noticias más recientes."""
        rss_url = source_info.get("rss_url")
        if not rss_url:
            return []

        entries = await self.fetch_feed_entries(rss_url)
        collected_articles = []

        for entry in entries:
            url = getattr(entry, "link", None)
            title = getattr(entry, "title", None)
            if not url or not title:
                continue

            summary = getattr(entry, "summary", "")
            pub_date = self.parse_entry_date(entry)

            # Intentar extracción completa (en segundo plano / sin bloquear)
            content_data = await self.extract_article_content(url)
            raw_text = content_data.get("text") if content_data else summary
            author = content_data.get("author") if content_data else getattr(entry, "author", None)
            excerpt = content_data.get("excerpt") if content_data else summary

            collected_articles.append({
                "title": title.strip(),
                "url": url.strip(),
                "published_at": pub_date,
                "author": author,
                "raw_text": raw_text or title,
                "excerpt": (excerpt or "")[:400],
                "source_slug": source_info["slug"],
            })

            # Cortesía entre peticiones
            await asyncio.sleep(0.2)

        return collected_articles


collector_service = NewsCollector()
