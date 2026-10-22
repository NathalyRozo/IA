from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from app.core.database import Base


class Report(Base):
    """
    Modelo para los informes de investigación periodística y académica.
    Garantiza la estricta distinción entre evidencia empírica e interpretación de IA.
    """
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Parámetros de la investigación
    date_from = Column(DateTime, nullable=False)
    date_to = Column(DateTime, nullable=False)
    sources_included = Column(JSON, nullable=False)  # Lista de slugs de medios
    topics_included = Column(JSON, nullable=False)   # Lista de categorías
    
    # Bloque 1: Evidencia Empírica Verificable (Datos brutos, métricas, enlaces)
    empirical_data = Column(JSON, nullable=False)
    # Formato:
    # {
    #   "total_articles": 154,
    #   "coverage_by_media": {"el-tiempo": 34, "bbc-news": 12, ...},
    #   "coverage_by_topic": {"Política": 80, ...},
    #   "source_articles": [
    #       {"id": 1, "title": "...", "media": "El Espectador", "url": "...", "published_at": "..."}
    #   ]
    # }

    # Bloque 2: Interpretación y Síntesis Generada por IA
    ai_interpretation_markdown = Column(Text, nullable=False)
    
    # Metadatos del informe
    author_notes = Column(Text, nullable=True)
    methodology_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Report {self.title} ({self.created_at})>"
