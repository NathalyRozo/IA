from fastapi import APIRouter
from app.api.v1.news import router as news_router
from app.api.v1.coverage import router as coverage_router
from app.api.v1.contrast import router as contrast_router
from app.api.v1.trends import router as trends_router
from app.api.v1.reports import router as reports_router

api_router = APIRouter()
api_router.include_router(news_router)
api_router.include_router(coverage_router)
api_router.include_router(contrast_router)
api_router.include_router(trends_router)
api_router.include_router(reports_router)

__all__ = ["api_router"]
