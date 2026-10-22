from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


class MediaSource(Base):
    __tablename__ = "media_sources"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    scope = Column(String(20), nullable=False)  # "nacional" o "internacional"
    country = Column(String(50), default="Colombia")
    website_url = Column(String(255), nullable=False)
    rss_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    articles = relationship("Article", back_populates="source", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<MediaSource {self.name} ({self.scope})>"
