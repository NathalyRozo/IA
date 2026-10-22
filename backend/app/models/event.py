from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class EventCluster(Base):
    __tablename__ = "event_clusters"

    id = Column(Integer, primary_key=True, index=True)
    canonical_title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    topic = Column(String(50), index=True, nullable=False)
    
    first_seen_at = Column(DateTime, default=datetime.utcnow, index=True)
    last_updated_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    article_count = Column(Integer, default=1)
    
    # Análisis comparativo sintetizado por IA (enfoques narrativos y diferencias)
    narrative_synthesis = Column(JSON, nullable=True)
    # Formato:
    # {
    #   "overview": "...",
    #   "outlet_frames": {
    #       "El Tiempo": {"angle": "...", "highlighted": "...", "omitted": "..."},
    #       "The New York Times": {"angle": "...", "highlighted": "...", "omitted": "..."}
    #   },
    #   "divergences": ["..."]
    # }

    # Relaciones
    articles = relationship("Article", back_populates="event", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<EventCluster {self.canonical_title[:30]} ({self.topic})>"
