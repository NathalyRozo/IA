from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query, BackgroundTasks
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.news import Article
from app.models.media_source import MediaSource
from app.schemas.news import ArticleResponse
from app.scheduler.jobs import run_ingestion_and_clustering_job

router = APIRouter(prefix="/news", tags=["Noticias"])


@router.get("", response_model=List[ArticleResponse])
async def list_articles(
    topic: Optional[str] = Query(None, description="Filtrar por tema/categoría"),
    source_slug: Optional[str] = Query(None, description="Filtrar por slug del medio"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Retorna la lista de noticias recopiladas con paginación y filtros."""
    query = select(Article).options(selectinload(Article.source)).order_by(desc(Article.published_at))

    if topic:
        query = query.where(Article.topic == topic)
    if source_slug:
        query = query.join(Article.source).where(MediaSource.slug == source_slug)

    query = query.offset(offset).limit(limit)
    result = await db.execute(query)
    articles = result.scalars().all()
    return articles


@router.post("/trigger-ingestion", status_code=202)
async def trigger_ingestion(background_tasks: BackgroundTasks):
    """Dispara un ciclo de recopilación y agrupamiento asíncrono en segundo plano."""
    background_tasks.add_task(run_ingestion_and_clustering_job)
    return {"status": "accepted", "message": "Tarea de recolección de noticias iniciada en segundo plano."}
