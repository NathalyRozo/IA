from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict


class ReportCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    date_from: datetime
    date_to: datetime
    sources_included: Optional[List[str]] = None  # Slugs; if None, all 10
    topics_included: Optional[List[str]] = None   # Topics; if None, all
    author_notes: Optional[str] = None


class ReportResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    date_from: datetime
    date_to: datetime
    sources_included: List[str]
    topics_included: List[str]
    
    # Bloque 1: Datos empíricos
    empirical_data: Dict[str, Any]
    
    # Bloque 2: Síntesis de IA
    ai_interpretation_markdown: str
    
    author_notes: Optional[str] = None
    methodology_notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
