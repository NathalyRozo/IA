import logging
from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy import select

from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models.media_source import MediaSource
from app.services.scraper.sources_config import DEFAULT_MEDIA_SOURCES

logger = logging.getLogger(__name__)

# Instancia global del planificador asíncrono
scheduler = AsyncIOScheduler()


async def init_media_sources():
    """Inicializa en base de datos los 10 medios de comunicación si no existen."""
    async with AsyncSessionLocal() as session:
        for src_data in DEFAULT_MEDIA_SOURCES:
            result = await session.execute(
                select(MediaSource).where(MediaSource.slug == src_data["slug"])
            )
            existing = result.scalar_one_or_none()
            if not existing:
                source = MediaSource(
                    slug=src_data["slug"],
                    name=src_data["name"],
                    scope=src_data["scope"],
                    country=src_data["country"],
                    website_url=src_data["website_url"],
                    rss_url=src_data["rss_url"],
                    is_active=True
                )
                session.add(source)
        await session.commit()
    logger.info("10 fuentes de medios verificadas/inicializadas correctamente.")


async def run_daily_update_job():
    """
    Rutina periódica diaria programada con APScheduler:
    1. Recopila noticias de los 10 medios.
    2. Procesa y clasifica con Gemini SDK.
    3. Analiza encuadres y contrastes editoriales.
    4. Actualiza métricas y caché JSON estructurada para el frontend.
    """
    logger.info("[CRON] Ejecutando tarea programada de actualización diaria de noticias...")
    try:
        from app.services.daily_updater import daily_updater_service
        result = await daily_updater_service.run_daily_update(force_refresh=True)
        logger.info(f"[CRON] Tarea diaria completada exitosamente. Total noticias: {result.get('metadata', {}).get('total_articles')}")
    except Exception as e:
        logger.error(f"[CRON] Error en la ejecución de la tarea diaria: {e}")


# Alias para compatibilidad con endpoints existentes
run_ingestion_and_clustering_job = run_daily_update_job


def start_scheduler():
    """Inicia el planificador de tareas APScheduler."""
    if not settings.ENABLE_SCHEDULER:
        logger.info("Planificador desactivado por configuración (ENABLE_SCHEDULER=False).")
        return

    # Programar actualización diaria a la hora configurada (por defecto 06:00 AM)
    trigger = CronTrigger(
        hour=settings.DAILY_CRON_HOUR,
        minute=settings.DAILY_CRON_MINUTE
    )
    scheduler.add_job(
        run_daily_update_job,
        trigger=trigger,
        id="daily_news_update_job",
        name="Actualización Diaria de Noticias y Encuadres (Gemini)",
        replace_existing=True,
    )
    
    if not scheduler.running:
        scheduler.start()
        logger.info(f"APScheduler iniciado. Rutina diaria programada a las {settings.DAILY_CRON_HOUR:02d}:{settings.DAILY_CRON_MINUTE:02d} UTC.")


def shutdown_scheduler():
    """Detiene el planificador APScheduler."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("APScheduler detenido correctamente.")
