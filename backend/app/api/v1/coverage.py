from datetime import datetime, timedelta
from typing import Dict, List, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.news import Article
from app.models.media_source import MediaSource
from app.models.event import EventCluster
from app.schemas.metrics import CoverageOverviewResponse, MediaCoverageBreakdown, MediaTopicCoverage

router = APIRouter(prefix="/coverage", tags=["Medición de Cobertura"])


@router.get("/overview", response_model=CoverageOverviewResponse)
async def get_coverage_overview(
    days: int = Query(7, ge=1, le=90, description="Días hacia atrás a analizar"),
    db: AsyncSession = Depends(get_db)
):
    """
    Calcula y retorna la cantidad de publicaciones que recibe cada tema en los medios seleccionados.
    Permite identificar qué asuntos concentran mayor atención mediática y cuáles menor presencia.
    """
    date_to = datetime.utcnow()
    date_from = date_to - timedelta(days=days)

    # 1. Total artículos en el periodo
    total_query = select(func.count(Article.id)).where(Article.published_at >= date_from)
    total_articles = (await db.execute(total_query)).scalar() or 0

    # 2. Total acontecimientos en el periodo
    total_events_query = select(func.count(EventCluster.id)).where(EventCluster.last_updated_at >= date_from)
    total_events = (await db.execute(total_events_query)).scalar() or 0

    # 3. Cobertura por tema
    topic_query = (
        select(Article.topic, func.count(Article.id))
        .where(Article.published_at >= date_from)
        .group_by(Article.topic)
        .order_by(func.count(Article.id).desc())
    )
    topic_results = (await db.execute(topic_query)).all()
    coverage_by_topic = {topic: count for topic, count in topic_results}

    # 4. Cobertura por alcance (Nacional vs Internacional)
    scope_query = (
        select(MediaSource.scope, func.count(Article.id))
        .join(Article, Article.source_id == MediaSource.id)
        .where(Article.published_at >= date_from)
        .group_by(MediaSource.scope)
    )
    scope_results = (await db.execute(scope_query)).all()
    coverage_by_scope = {scope: count for scope, count in scope_results}

    # 5. Desglose detallado por medio
    media_query = select(MediaSource).options(selectinload(MediaSource.articles))
    all_media = (await db.execute(media_query)).scalars().all()

    media_breakdown = []
    for media in all_media:
        # Contar noticias de este medio en el periodo
        media_arts = [a for a in media.articles if a.published_at and a.published_at >= date_from]
        media_total = len(media_arts)

        # Temas de este medio
        topics_count: Dict[str, int] = {}
        for a in media_arts:
            topics_count[a.topic] = topics_count.get(a.topic, 0) + 1

        top_topics = [
            MediaTopicCoverage(
                topic=t,
                count=c,
                share_percentage=round((c / media_total * 100), 2) if media_total > 0 else 0.0
            )
            for t, c in sorted(topics_count.items(), key=lambda x: x[1], reverse=True)
        ]

        media_breakdown.append(
            MediaCoverageBreakdown(
                source_name=media.name,
                source_slug=media.slug,
                scope=media.scope,
                total_articles=media_total,
                top_topics=top_topics
            )
        )

    return CoverageOverviewResponse(
        date_from=date_from,
        date_to=date_to,
        total_articles=total_articles,
        total_events=total_events,
        coverage_by_topic=coverage_by_topic,
        coverage_by_scope=coverage_by_scope,
        media_breakdown=media_breakdown
    )
