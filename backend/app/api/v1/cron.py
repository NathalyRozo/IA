import logging
from typing import Optional, Dict, Any
from fastapi import APIRouter, BackgroundTasks, Query, HTTPException

from app.services.daily_updater import daily_updater_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/cron", tags=["Automatización Diaria"])


@router.post("/daily-update")
async def trigger_daily_update(
    background_tasks: BackgroundTasks,
    sync: bool = Query(False, description="Si es True, espera a que finalice el procesamiento con Gemini y retorna el resultado.")
):
    """
    Dispara la rutina diaria de actualización automatizada de noticias:
    - Recolecta artículos de los 10 medios (5 nacionales y 5 internacionales).
    - Clasifica temáticamente en 10 categorías canónicas usando Gemini.
    - Analiza encuadres narrativos, sesgos de atención y contrastes editoriales.
    - Genera el informe diario y actualiza la caché JSON para las 5 vistas de la interfaz.
    """
    if sync:
        try:
            logger.info("Ejecutando actualización diaria sincrónica solicitada por API...")
            result = await daily_updater_service.run_daily_update(force_refresh=True)
            return {
                "status": "success",
                "message": "Actualización diaria completada con éxito.",
                "metadata": result.get("metadata", {}),
                "summary": {
                    "total_articles": result.get("coverage", {}).get("total_articles", 0),
                    "events_detected": len(result.get("contrast", {}).get("events", [])),
                    "date": result.get("metadata", {}).get("date")
                }
            }
        except Exception as e:
            logger.error(f"Error en actualización diaria sincrónica: {e}")
            raise HTTPException(status_code=500, detail=f"Fallo durante la actualización con Gemini: {str(e)}")
    else:
        background_tasks.add_task(daily_updater_service.run_daily_update, True)
        return {
            "status": "accepted",
            "message": "Rutina diaria de actualización iniciada en segundo plano con Gemini (google-genai).",
            "consultar_estado": "/api/v1/cron/daily-update/status"
        }


@router.get("/daily-update/status")
async def get_daily_update_status() -> Dict[str, Any]:
    """Retorna el estado de la última ejecución de la rutina diaria."""
    return daily_updater_service.get_status()


@router.get("/daily-cache")
async def get_daily_cache() -> Dict[str, Any]:
    """
    Retorna los datos completos estructurados en caché generados por la rutina diaria.
    Alimenta de forma instantánea las 5 vistas de la interfaz:
    - / (Radar de noticias)
    - /coverage (Share of Voice)
    - /contrast (Contraste de encuadres)
    - /trends (Tendencias y velocidad)
    - /reports (Informes con separación empírica y análisis IA)
    """
    data = await daily_updater_service.get_or_create_daily_data()
    return data
