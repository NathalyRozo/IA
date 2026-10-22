import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Mediatrix - Observatorio de Medios"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = "supersecretkey-mediatrix-change-in-production"

    # Base de Datos
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/mediatrix.db"

    # Ingesta
    SCRAPING_INTERVAL_HOURS: int = 2
    MAX_ARTICLES_PER_FEED: int = 25
    USER_AGENT: str = "MediatrixBot/1.0 (+http://observatorio-medios.org/bot; academic-research)"

    # NLP & Embeddings
    LLM_PROVIDER: str = "gemini"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    EMBEDDING_MODEL_NAME: str = "paraphrase-multilingual-MiniLM-L12-v2"
    SIMILARITY_EVENT_THRESHOLD: float = 0.72

    # Categorías canónicas de noticias
    CANONICAL_TOPICS: List[str] = [
        "Política",
        "Economía",
        "Sociedad",
        "Conflicto y Paz",
        "Salud",
        "Medio Ambiente",
        "Internacional",
        "Tecnología",
        "Deportes",
        "Cultura",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
