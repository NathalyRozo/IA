# Mediatrix - Observatorio de Cobertura y Agenda Mediática

Plataforma full-stack para el análisis comparativo de la agenda informativa y contraste de encuadres narrativos (*framing analysis*) en medios de comunicación nacionales e internacionales.

---

## 1. Medios Monitoreados (10)

| Alcance | Medio | Cobertura / Sede | Formato Ingesta |
| :--- | :--- | :--- | :--- |
| **Nacional** | **El Espectador** | Colombia | RSS / Web Scraping |
| **Nacional** | **RTVC Noticias** | Colombia | RSS / Web Scraping |
| **Nacional** | **El Tiempo** | Colombia | RSS / Web Scraping |
| **Nacional** | **El Heraldo** | Colombia | RSS / Web Scraping |
| **Nacional** | **El Colombiano** | Colombia | RSS / Web Scraping |
| **Internacional** | **Reuters** | Internacional | RSS / Wire Feed |
| **Internacional** | **BBC News (Mundo)** | Reino Unido / Global | RSS / Extracción |
| **Internacional** | **Associated Press (AP)** | EE.UU. / Global | RSS / Wire Feed |
| **Internacional** | **Agence France-Presse (AFP)** | Francia / Global | RSS / Wire Feed |
| **Internacional** | **The New York Times** | EE.UU. / Global | RSS / Extracción |

---

## 2. Funcionalidades Principales

1. **Recopilación y Clasificación Automática:** Ingesta periódica de los 10 medios con extracción de texto limpio (`trafilatura` y `feedparser`) y clasificación temática mediante PLN en 10 categorías (Política, Economía, Conflicto y Paz, Sociedad, Salud, Medio Ambiente, Internacional, Tecnología, Deportes, Cultura).
2. **Medición de la Cobertura Mediática:** Cálculo de métricas cuantitativas: volumen de publicaciones, cuota de cobertura (*Share of Voice*) y distribución relativa de la atención mediática por medio y tema.
3. **Contraste de Información entre Medios:** Agrupamiento de noticias sobre un mismo acontecimiento en *Event Clusters* mediante embeddings semánticos densos y comparación paralela (*side-by-side*) de titulares, enfoques narrativos, aspectos destacados y omisiones editoriales.
4. **Detección de Tendencias:** Detección de velocidad y aceleración de temas en el tiempo con clasificación de estado (*En auge*, *Estable*, *En declive*) y series temporales comparativas.
5. **Generación de Informes de Análisis:** Exportación de reportes académicos y periodísticos en Markdown (.md) y PDF con estricta separación metodológica:
   - **Bloque A:** Evidencia empírica verificable (tablas, frecuencias, enlaces directos a medios originales).
   - **Bloque B:** Interpretación y síntesis de patrones asistida por IA.

---

## 3. Límites de Alcance y Principios Éticos ("Qué NO hace y por qué")

- ❌ **No determina si una noticia es verdadera o falsa:** Analiza contenidos y encuadres, no es un verificador de hechos forense.
- ❌ **No mide directamente la opinión pública:** La frecuencia de publicación refleja la agenda editorial (*media agenda*), no el sentir ciudadano.
- ❌ **No abarca la totalidad de internet:** Se acota rigurosamente a los 10 medios seleccionados y contenidos accesibles legalmente.
- ❌ **No sustituye el juicio periodístico:** Funciona como un asistente analítico complementario al criterio humano (*Human-in-the-loop*).
- ❌ **No redacta ni reescribe noticias para publicación:** No genera noticias sintéticas; únicamente produce análisis comparativo de metadatos y encuadres.

---

## 4. Stack Tecnológico

- **Backend:** Python 3.11+, FastAPI (asíncrono), Pydantic v2, SQLAlchemy 2.0 (async).
- **Procesamiento de Lenguaje Natural (PLN):** Sentence-Transformers (`paraphrase-multilingual-MiniLM-L12-v2`), Trafilatura, Google Gemini API (para análisis profundo de encuadres).
- **Base de Datos:** SQLite local con `aiosqlite` para desarrollo inmediato, compatible con PostgreSQL 16 + `pgvector`.
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Orquestación y Despliegue:** Docker y Docker Compose.

---

## 5. Estructura del Proyecto

```
ia/
├── docker-compose.yml              # Orquestación de contenedores (Frontend, Backend, Postgres)
├── .env.example                    # Plantilla de variables de entorno
├── docs/                           # Documentación técnica y ética
│   ├── ARCHITECTURE.md             # Diagramas y especificación de arquitectura
│   └── ETHICS_AND_SCOPE.md         # Fundamento deontológico y límites
├── backend/                        # API REST FastAPI & Pipeline PLN
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py                 # Punto de entrada de la aplicación
│       ├── core/                   # Configuración y conexión a base de datos
│       ├── models/                 # Modelos SQLAlchemy (MediaSource, Article, Event, Report)
│       ├── schemas/                # Schemas Pydantic de entrada/salida
│       ├── services/
│       │   ├── scraper/            # Ingesta de los 10 medios (feedparser + trafilatura)
│       │   ├── nlp/                # Clasificación de temas, embeddings y encuadres
│       │   └── reporter/           # Generador de informes empíricos vs IA
│       ├── scheduler/              # Tareas periódicas de recolección en segundo plano
│       └── api/v1/                 # Endpoints REST (news, coverage, contrast, trends, reports)
└── frontend/                       # Interfaz de Usuario Next.js 14
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── app/                    # Rutas (Inicio, Cobertura, Contraste, Tendencias, Informes)
        ├── components/             # Componentes visuales y aviso ético modal
        └── lib/                    # Cliente HTTP y tipos TypeScript
```

---

## 6. Instrucciones de Puesta en Marcha

### Opción A: Ejecución Rápida con Docker (Recomendada)
```bash
# 1. Copiar archivo de entorno
cp .env.example .env

# 2. Levantar la aplicación completa
docker compose up --build
```
- Frontend accesible en: `http://localhost:3000`
- API Backend y Swagger Docs en: `http://localhost:8000/docs`

---

### Opción B: Ejecución Local en Entorno de Desarrollo

#### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# En Windows:
.\venv\Scripts\activate
# En Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Acceder a `http://localhost:3000`.
