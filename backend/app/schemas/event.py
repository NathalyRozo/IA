from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.schemas.news import ArticleResponse


class EventClusterBase(BaseModel):
    canonical_title: str
    summary: Optional[str] = None
    topic: str


class EventClusterResponse(EventClusterBase):
    id: int
    first_seen_at: datetime
    last_updated_at: datetime
    article_count: int
    narrative_synthesis: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


class EventDetailResponse(EventClusterResponse):
    articles: List[ArticleResponse] = []


class SideBySideContrastItem(BaseModel):
    media_name: str
    media_scope: str
    headline: str
    published_at: datetime
    url: str
    narrative_angle: Optional[str] = None
    tone: Optional[str] = None
    highlighted_aspects: List[str] = []
    omitted_aspects: List[str] = []


class EventContrastResponse(BaseModel):
    event_id: int
    canonical_title: str
    topic: str
    total_coverage_count: int
    comparison_items: List[SideBySideContrastItem]
    ai_comparative_synthesis: Dict[str, Any]
    methodological_disclaimer: str = (
        "Este análisis compara encuadres narrativos y aspectos destacados por cada medio. "
        "No constituye una verificación fáctica sobre la veracidad de los hechos reportados."
    )
