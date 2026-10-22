from datetime import datetime, date
from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class MediaTopicCoverage(BaseModel):
    topic: str
    count: int
    share_percentage: float


class MediaCoverageBreakdown(BaseModel):
    source_name: str
    source_slug: str
    scope: str
    total_articles: int
    top_topics: List[MediaTopicCoverage]


class CoverageOverviewResponse(BaseModel):
    date_from: datetime
    date_to: datetime
    total_articles: int
    total_events: int
    coverage_by_topic: Dict[str, int]
    coverage_by_scope: Dict[str, int]  # {"nacional": X, "internacional": Y}
    media_breakdown: List[MediaCoverageBreakdown]


class TrendItem(BaseModel):
    topic: str
    current_count: int
    previous_count: int
    percentage_change: float
    trend_status: str  # "en_auge", "estable", "en_declive"
    velocity_score: float
    sample_headlines: List[str] = []


class TrendsResponse(BaseModel):
    period_analyzed: str
    trends: List[TrendItem]
    time_series: List[Dict[str, Any]]  # [{"date": "2026-10-15", "Politica": 20, "Economia": 15, ...}]
    methodological_disclaimer: str = (
        "La frecuencia mediática refleja las prioridades editoriales de los 10 medios analizados, "
        "no el sentir o la opinión de la ciudadanía."
    )
