from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class MediaSourceBase(BaseModel):
    slug: str
    name: str
    scope: str
    country: str = "Colombia"
    website_url: str
    rss_url: Optional[str] = None
    is_active: bool = True


class MediaSourceCreate(MediaSourceBase):
    pass


class MediaSourceResponse(MediaSourceBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
