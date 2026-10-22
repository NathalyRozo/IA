import logging
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.core.config import settings
from app.core.database import engine, Base, AsyncSessionLocal
from app.api.v1 import api_router
from app.scheduler.jobs import init_media_sources
from app.models.media_source import MediaSource
from app.models.news import Article, ArticleFraming
from app.models.event import EventCluster

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_initial_demo_data():
    """
    Inserta datos iniciales realistas para que el usuario pueda interactuar con
    los 5 módulos funcionales (cobertura, contraste, tendencias e informes) desde el minuto cero.
    """
    async with AsyncSessionLocal() as session:
        # Verificar si ya existen noticias
        res = await session.execute(select(Article))
        if res.scalars().first():
            return

        logger.info("Cargando datos demostrativos iniciales de los 10 medios...")
        # Obtener medios
        sources_res = await session.execute(select(MediaSource))
        sources_dict = {s.slug: s for s in sources_res.scalars().all()}

        if not sources_dict:
            return

        now = datetime.utcnow()

        # Acontecimiento 1: Reforma Laboral y Pensional
        cluster1 = EventCluster(
            canonical_title="Debate y votación del proyecto de reforma laboral en el Congreso",
            summary="Discusión legislativa sobre recargos nocturnos, indemnizaciones y tercerización laboral en Colombia.",
            topic="Política",
            first_seen_at=now - timedelta(days=2),
            last_updated_at=now,
            article_count=4,
            narrative_synthesis={
                "overview": "El Congreso de la República avanzó en la votación de los artículos más debatidos de la reforma laboral.",
                "outlet_frames": {
                    "El Tiempo": {
                        "angle": "Impacto fiscal y costo para pequeños empresarios",
                        "tone": "Crítico",
                        "highlighted": ["Preocupación gremial de Fenalco", "Sobrecosto en nómina nocturna"],
                        "omitted": ["Compromisos de convenios con la OIT"]
                    },
                    "El Espectador": {
                        "angle": "Equilibrio entre derechos laborales y concertación parlamentaria",
                        "tone": "Institucional",
                        "highlighted": ["Negociaciones entre bancadas independientes", "Recuperación de recargos"],
                        "omitted": ["Cifras de informalidad regional"]
                    },
                    "RTVC Noticias": {
                        "angle": "Reivindicación histórica de la clase trabajadora",
                        "tone": "Optimista",
                        "highlighted": ["Discurso gubernamental", "Beneficio a millones de empleados informales"],
                        "omitted": ["Reparos del sector productivo"]
                    },
                    "Reuters": {
                        "angle": "Efectos en la calificación crediticia e inversión extranjera",
                        "tone": "Neutro",
                        "highlighted": ["Monitoreo de agencias de riesgo", "Comportamiento del peso colombiano"],
                        "omitted": ["Dinámicas políticas locales"]
                    }
                },
                "divergencias": [
                    "El Tiempo y Reuters priorizan los costos empresariales y la estabilidad macroeconómica.",
                    "RTVC Noticias y El Espectador priorizan la restitución de derechos y el trámite democrático en el Capitolio."
                ]
            }
        )
        session.add(cluster1)
        await session.flush()

        # Artículos para Acontecimiento 1
        arts_data = [
            {
                "slug": "el-tiempo",
                "title": "Empresarios advierten freno a la contratación por nuevos costos de reforma laboral",
                "topic": "Economía",
                "url": "https://www.eltiempo.com/politica/reforma-laboral-costos-empresarios-demo",
                "offset_h": 4,
                "angle": "Costos de nómina y riesgo de empleo",
                "tone": "Crítico"
            },
            {
                "slug": "el-espectador",
                "title": "Congreso retoma debate de reforma laboral con acuerdos en recargo nocturno",
                "topic": "Política",
                "url": "https://www.elespectador.com/politica/congreso-retoma-reforma-laboral-demo",
                "offset_h": 5,
                "angle": "Trámite legislativo y pactos políticos",
                "tone": "Institucional"
            },
            {
                "slug": "rtvc-noticias",
                "title": "Trabajadores respaldan recuperación de la jornada nocturna desde las 7:00 p.m.",
                "topic": "Política",
                "url": "https://rtvcnoticias.com/nacional/reforma-laboral-trabajadores-recargos-demo",
                "offset_h": 6,
                "angle": "Beneficios sociales a empleados",
                "tone": "Optimista"
            },
            {
                "slug": "reuters",
                "title": "Colombia congress debates labor reform bill amid fiscal deficit scrutiny",
                "topic": "Economía",
                "url": "https://www.reuters.com/world/americas/colombia-labor-reform-fiscal-demo",
                "offset_h": 2,
                "angle": "Análisis de riesgo soberano",
                "tone": "Neutro"
            }
        ]

        for ad in arts_data:
            s = sources_dict.get(ad["slug"])
            if s:
                art = Article(
                    source_id=s.id,
                    event_id=cluster1.id,
                    title=ad["title"],
                    url=ad["url"],
                    published_at=now - timedelta(hours=ad["offset_h"]),
                    topic=ad["topic"],
                    raw_text=ad["title"] * 3,
                    excerpt=ad["title"]
                )
                session.add(art)
                await session.flush()
                framing = ArticleFraming(
                    article_id=art.id,
                    narrative_angle=ad["angle"],
                    tone=ad["tone"],
                    highlighted_aspects=[ad["title"]],
                    omitted_aspects=["Contexto adicional"]
                )
                session.add(framing)

        # Más artículos para enriquecer estadísticas de cobertura y tendencias
        extra_articles = [
            ("el-colombiano", "Conflicto en Antioquia: Defensoría alerta por confinamiento de comunidades", "Conflicto y Paz", 10),
            ("el-heraldo", "Tarifas de energía en el Caribe: alcaldes insisten en intervención tarifaria", "Economía", 14),
            ("bbc-news", "COP biodiversidad: Los retos de América Latina frente a la transición verde", "Medio Ambiente", 18),
            ("associated-press", "Global inflation pressures ease as central banks signal rate cuts", "Economía", 22),
            ("new-york-times", "Latin America's diplomatic shifts in high-stakes regional summit", "Internacional", 30),
            ("afp", "Avances científicos en terapias génicas abren nueva era en la medicina", "Salud", 36),
            ("el-tiempo", "Ecopetrol reporta resultados de producción y avances en exploración offshore", "Economía", 40),
            ("el-espectador", "Corte Constitucional delimita competencias en consultas populares", "Política", 48),
        ]

        for slug, title, topic, offset_h in extra_articles:
            s = sources_dict.get(slug)
            if s:
                art = Article(
                    source_id=s.id,
                    title=title,
                    url=f"https://{s.slug}.com/demo/{offset_h}",
                    published_at=now - timedelta(hours=offset_h),
                    topic=topic,
                    raw_text=title * 2,
                    excerpt=title
                )
                session.add(art)

        await session.commit()
        logger.info("Datos demostrativos cargados exitosamente.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicialización de esquema de BD
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Inicializar medios y datos demo
    await init_media_sources()
    await seed_initial_demo_data()

    yield

    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    ## Plataforma de Análisis de Cobertura y Agenda Mediática (Mediatrix)
    
    Herramienta analítica para contrastar la cobertura de 10 medios nacionales e internacionales:
    - **Nacionales:** El Espectador, RTVC Noticias, El Tiempo, El Heraldo, El Colombiano.
    - **Internacionales:** Reuters, BBC News, Associated Press, AFP, The New York Times.
    
    ### Principios Deontológicos y Límites de Alcance:
    - **No determina veracidad:** Analiza contenidos y encuadres, no es un verificador de hechos.
    - **No mide opinión pública:** Cuantifica la agenda mediática editorial, no el pensamiento ciudadano.
    - **Asistente heurístico:** No reemplaza el juicio crítico ni la labor del investigador/periodista.
    """,
    lifespan=lifespan
)

# CORS Middleware para integración con frontend Next.js / React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar endpoints de la API v1
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Estado"])
async def root():
    return {
        "sistema": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR,
        "medios_monitoreados": 10,
        "aviso_metodologico": "Herramienta analítica de agenda mediática. No califica veracidad."
    }
