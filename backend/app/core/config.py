import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "FOQUÉ - Observatorio de Cobertura y Agenda Mediática"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = "supersecretkey-foque-change-in-production"

    # Base de Datos
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/mediatrix.db"

    # Ingesta
    SCRAPING_INTERVAL_HOURS: int = 2
    MAX_ARTICLES_PER_FEED: int = 20
    USER_AGENT: str = "FOQUE-ObservatorioBot/1.0 (+https://github.com/NathalyRozo/IA; academic-research)"

    # Gemini & LLM (SDK oficial google-genai)
    LLM_PROVIDER: str = "gemini"
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"
    GEMINI_FALLBACK_MODEL: str = "gemini-3-flash-preview"

    # Planificador / Scheduler
    DAILY_CRON_HOUR: int = 6
    DAILY_CRON_MINUTE: int = 0
    ENABLE_SCHEDULER: bool = True

    # Caché estructurada para vistas frontend
    DAILY_CACHE_FILE: str = "data/daily_cache.json"

    # Similitud de eventos
    SIMILARITY_EVENT_THRESHOLD: float = 0.65

    # 10 Categorías canónicas de noticias (PRD)
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
        env_file=(".env", "../.env", "../../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
