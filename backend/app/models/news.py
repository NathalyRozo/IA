from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("media_sources.id", ondelete="CASCADE"), nullable=False, index=True)
    event_id = Column(Integer, ForeignKey("event_clusters.id", ondelete="SET NULL"), nullable=True, index=True)

    title = Column(String(500), nullable=False)
    url = Column(String(1000), unique=True, index=True, nullable=False)
    published_at = Column(DateTime, index=True, nullable=False)
    author = Column(String(150), nullable=True)
    
    # Contenido
    raw_text = Column(Text, nullable=True)
    excerpt = Column(Text, nullable=True)
    
    # Clasificación PLN
    topic = Column(String(50), index=True, nullable=False, default="General")
    entities = Column(JSON, nullable=True)  # {"personas": [], "organizaciones": [], "lugares": []}
    
    # Vector semántico almacenado en JSON o pgvector (almacenado como JSON array para compatibilidad universal)
    embedding_vector = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    source = relationship("MediaSource", back_populates="articles")
    event = relationship("EventCluster", back_populates="articles")
    framing = relationship("ArticleFraming", back_populates="article", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Article {self.title[:30]} - {self.published_at}>"


class ArticleFraming(Base):
    """
    Análisis individual de encuadre para un artículo concreto.
    """
    __tablename__ = "article_framings"

    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("articles.id", ondelete="CASCADE"), unique=True, nullable=False)

    narrative_angle = Column(String(150), nullable=True)  # e.g., "Enfoque fiscal y de impacto en el bolsillo"
    tone = Column(String(50), nullable=True)  # e.g., "Alarma", "Institucional", "Crítico", "Neutro", "Optimista"
    highlighted_aspects = Column(JSON, nullable=True)  # Puntos principales resaltados
    omitted_aspects = Column(JSON, nullable=True)      # Puntos de contexto habituales omitidos
    key_quotes = Column(JSON, nullable=True)           # Citas textuales destacadas

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    article = relationship("Article", back_populates="framing")
