from datetime import datetime, timedelta
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.news import Article
from app.core.config import settings
from app.schemas.metrics import TrendsResponse, TrendItem

router = APIRouter(prefix="/trends", tags=["Detección de Tendencias"])


@router.get("", response_model=TrendsResponse)
async def get_trends(
    window_days: int = Query(7, ge=3, le=30, description="Tamaño de la ventana de análisis en días"),
    db: AsyncSession = Depends(get_db)
):
    """
    Muestra cómo cambia la frecuencia de publicación de temas a lo largo del tiempo.
    Compara el periodo actual con el periodo inmediatamente anterior para calcular velocidad y estado de tendencia.
    """
    now = datetime.utcnow()
    current_start = now - timedelta(days=window_days)
    previous_start = current_start - timedelta(days=window_days)

    # 1. Conteo periodo actual
    cur_query = (
        select(Article.topic, func.count(Article.id))
        .where(Article.published_at >= current_start)
        .group_by(Article.topic)
    )
    cur_counts = dict((await db.execute(cur_query)).all())

    # 2. Conteo periodo anterior
    prev_query = (
        select(Article.topic, func.count(Article.id))
        .where(Article.published_at >= previous_start, Article.published_at < current_start)
        .group_by(Article.topic)
    )
    prev_counts = dict((await db.execute(prev_query)).all())

    # 3. Calcular métricas de tendencia
    all_topics = set(list(cur_counts.keys()) + list(prev_counts.keys()) + settings.CANONICAL_TOPICS)
    trends: List[TrendItem] = []

    for topic in all_topics:
        c_cur = cur_counts.get(topic, 0)
        c_prev = prev_counts.get(topic, 0)

        # Cálculo de cambio porcentual
        if c_prev == 0:
            pct_change = 100.0 if c_cur > 0 else 0.0
        else:
            pct_change = round(((c_cur - c_prev) / c_prev) * 100, 1)

        # Estado de la tendencia
        if pct_change >= 20.0 and c_cur >= 3:
            status = "en_auge"
        elif pct_change <= -20.0:
            status = "en_declive"
        else:
            status = "estable"

        velocity = round((c_cur - c_prev) / float(window_days), 2)

        # Muestra de titulares recientes de este tema
        sample_q = (
            select(Article.title)
            .where(Article.topic == topic)
            .order_by(Article.published_at.desc())
            .limit(2)
        )
        sample_headlines = [row[0] for row in (await db.execute(sample_q)).all()]

        trends.append(
            TrendItem(
                topic=topic,
                current_count=c_cur,
                previous_count=c_prev,
                percentage_change=pct_change,
                trend_status=status,
                velocity_score=velocity,
                sample_headlines=sample_headlines
            )
        )

    # Ordenar ranking por publicaciones actuales descendente
    trends.sort(key=lambda x: (x.current_count, x.velocity_score), reverse=True)

    # 4. Construir serie temporal de los últimos N días
    time_series: List[Dict[str, Any]] = []
    for day_offset in range(window_days, -1, -1):
        day_date = (now - timedelta(days=day_offset)).date()
        day_start = datetime.combine(day_date, datetime.min.time())
        day_end = datetime.combine(day_date, datetime.max.time())

        day_q = (
            select(Article.topic, func.count(Article.id))
            .where(Article.published_at >= day_start, Article.published_at <= day_end)
            .group_by(Article.topic)
        )
        day_counts = dict((await db.execute(day_q)).all())

        point = {"date": day_date.strftime("%Y-%m-%d")}
        for t in ["Política", "Economía", "Conflicto y Paz", "Internacional", "Salud"]:
            point[t] = day_counts.get(t, 0)
        time_series.append(point)

    return TrendsResponse(
        period_analyzed=f"Últimos {window_days} días vs {window_days} días anteriores",
        trends=trends,
        time_series=time_series
    )
