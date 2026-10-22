from app.schemas.media_source import MediaSourceBase, MediaSourceCreate, MediaSourceResponse
from app.schemas.news import (
    ArticleBase,
    ArticleCreate,
    ArticleResponse,
    ArticleFilterParams,
    ArticleFramingSchema,
)
from app.schemas.event import (
    EventClusterBase,
    EventClusterResponse,
    EventDetailResponse,
    SideBySideContrastItem,
    EventContrastResponse,
)
from app.schemas.metrics import (
    MediaTopicCoverage,
    MediaCoverageBreakdown,
    CoverageOverviewResponse,
    TrendItem,
    TrendsResponse,
)
from app.schemas.report import ReportCreateRequest, ReportResponse

__all__ = [
    "MediaSourceBase",
    "MediaSourceCreate",
    "MediaSourceResponse",
    "ArticleBase",
    "ArticleCreate",
    "ArticleResponse",
    "ArticleFilterParams",
    "ArticleFramingSchema",
    "EventClusterBase",
    "EventClusterResponse",
    "EventDetailResponse",
    "SideBySideContrastItem",
    "EventContrastResponse",
    "MediaTopicCoverage",
    "MediaCoverageBreakdown",
    "CoverageOverviewResponse",
    "TrendItem",
    "TrendsResponse",
    "ReportCreateRequest",
    "ReportResponse",
]
