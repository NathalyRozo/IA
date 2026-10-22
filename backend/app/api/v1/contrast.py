from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.event import EventCluster
from app.models.news import Article
from app.schemas.event import EventClusterResponse, EventContrastResponse, SideBySideContrastItem
from app.services.nlp.framing_analyzer import framing_analyzer_service

router = APIRouter(prefix="/contrast", tags=["Contraste de Información"])


@router.get("/events", response_model=List[EventClusterResponse])
async def list_events_for_contrast(
    topic: Optional[str] = Query(None, description="Filtrar acontecimientos por tema"),
    min_articles: int = Query(2, description="Mínimo de artículos agrupados para contrastar"),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """
    Lista acontecimientos que han sido cubiertos por múltiples medios, aptos para contraste.
    """
    query = (
        select(EventCluster)
        .where(EventCluster.article_count >= min_articles)
        .order_by(desc(EventCluster.last_updated_at))
    )
    if topic:
        query = query.where(EventCluster.topic == topic)

    result = await db.execute(query.limit(limit))
    return result.scalars().all()


@router.get("/events/{event_id}", response_model=EventContrastResponse)
async def get_event_side_by_side_contrast(
    event_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Permite seleccionar un acontecimiento y visualizar los titulares de diferentes medios
    uno al lado del otro para comparar cómo lo presentan, identificando enfoques narrativos.
    """
    query = (
        select(EventCluster)
        .options(
            selectinload(EventCluster.articles).selectinload(Article.source),
            selectinload(EventCluster.articles).selectinload(Article.framing)
        )
        .where(EventCluster.id == event_id)
    )
    result = await db.execute(query)
    event = result.scalar_one_or_none()

    if not event:
        raise HTTPException(status_code=404, detail="Acontecimiento no encontrado.")

    articles_for_analysis = []
    comparison_items = []

    for art in event.articles:
        source_name = art.source.name if art.source else "Medio"
        source_scope = art.source.scope if art.source else "nacional"

        framing = art.framing
        angle = framing.narrative_angle if framing else "Enfoque informativo"
        tone = framing.tone if framing else "Neutro"
        highlighted = framing.highlighted_aspects if framing and framing.highlighted_aspects else [art.title]
        omitted = framing.omitted_aspects if framing and framing.omitted_aspects else []

        comparison_items.append(
            SideBySideContrastItem(
                media_name=source_name,
                media_scope=source_scope,
                headline=art.title,
                published_at=art.published_at,
                url=art.url,
                narrative_angle=angle,
                tone=tone,
                highlighted_aspects=highlighted,
                omitted_aspects=omitted
            )
        )

        articles_for_analysis.append({
            "source_name": source_name,
            "title": art.title,
            "excerpt": art.excerpt or "",
        })

    # Si aún no tiene síntesis comparativa o se solicita actualización, se genera
    if not event.narrative_synthesis or len(event.narrative_synthesis) == 0:
        synthesis = await framing_analyzer_service.analyze_event_contrast(
            canonical_title=event.canonical_title,
            articles_data=articles_for_analysis
        )
        event.narrative_synthesis = synthesis
        await db.commit()
    else:
        synthesis = event.narrative_synthesis

    return EventContrastResponse(
        event_id=event.id,
        canonical_title=event.canonical_title,
        topic=event.topic,
        total_coverage_count=len(event.articles),
        comparison_items=comparison_items,
        ai_comparative_synthesis=synthesis
    )
