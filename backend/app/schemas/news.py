from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.schemas.media_source import MediaSourceResponse


class ArticleFramingSchema(BaseModel):
    narrative_angle: Optional[str] = None
    tone: Optional[str] = None
    highlighted_aspects: Optional[List[str]] = None
    omitted_aspects: Optional[List[str]] = None
    key_quotes: Optional[List[str]] = None

    model_config = ConfigDict(from_attributes=True)


class ArticleBase(BaseModel):
    title: str
    url: str
    published_at: datetime
    author: Optional[str] = None
    excerpt: Optional[str] = None
    topic: str = "General"
    entities: Optional[Dict[str, List[str]]] = None


class ArticleCreate(ArticleBase):
    source_id: int
    raw_text: Optional[str] = None


class ArticleResponse(ArticleBase):
    id: int
    source_id: int
    event_id: Optional[int] = None
    created_at: datetime
    source: Optional[MediaSourceResponse] = None
    framing: Optional[ArticleFramingSchema] = None

    model_config = ConfigDict(from_attributes=True)


class ArticleFilterParams(BaseModel):
    source_slug: Optional[str] = None
    topic: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    event_id: Optional[int] = None
    limit: int = 50
    offset: int = 0
