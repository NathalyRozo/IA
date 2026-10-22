# Arquitectura del Sistema - Mediatrix (Observatorio de Medios)

## 1. Visión General del Sistema
**Mediatrix** es una plataforma de análisis comparativo de la agenda mediática y encuadres narrativos (*framing analysis*). Su objetivo es recopilar noticias de 10 medios predefinidos (5 colombianos y 5 internacionales), clasificarlas temática y cronológicamente mediante Procesamiento del Lenguaje Natural (PLN), medir el volumen de cobertura y permitir el contraste visual de enfoques entre salas de redacción.

```
       +-----------------------------------------------------------+
       |                  FUENTES DE NOTICIAS (10)                 |
       |  Nacionales: El Espectador, El Tiempo, RTVC, El Heraldo,  |
       |              El Colombiano                                |
       |  Internacionales: Reuters, BBC, AP, AFP, NY Times         |
       +-----------------------------+-----------------------------+
                                     |
                                     v
       +-----------------------------------------------------------+
       |               PIPELINE DE INGESTA (Scrapers/RSS)          |
       |  - feedparser (Lectura y normalización de feeds RSS)      |
       |  - trafilatura (Extracción de texto limpio y metadatos)   |
       |  - Respeto a robots.txt y límites de tasa de peticiones   |
       +-----------------------------+-----------------------------+
                                     |
                                     v
       +-----------------------------------------------------------+
       |                   PIPELINE DE PLN / IA                    |
       |  1. Clasificación Temática (Zero-shot / Categorías)       |
       |  2. Embeddings Densos & Agrupamiento de Acontecimientos   |
       |  3. Análisis de Encuadre (*Framing*) y Tono Editorial     |
       |  4. Extracción de Entidades Clave (NER)                   |
       +-----------------------------+-----------------------------+
                                     |
                                     v
       +-----------------------------------------------------------+
       |              ALMACENAMIENTO Y PERSISTENCIA                |
       |  - PostgreSQL + pgvector (o SQLite local para dev)        |
       |  - Vectores de noticias, clústeres de eventos y métricas  |
       +-----------------------------+-----------------------------+
                                     |
                                     v
       +-----------------------------------------------------------+
       |                   CAPA DE API (FastAPI)                   |
       |  - Endpoints REST v1: Cobertura, Contraste, Tendencias,   |
       |    Informes Académicos                                    |
       +-----------------------------+-----------------------------+
                                     |
                                     v
       +-----------------------------------------------------------+
       |                  INTERFAZ DE USUARIO                      |
       |  - Next.js 14 / React + Tailwind CSS                      |
       |  - Cuadros de mando interactivos, comparador side-by-side |
       |  - Generador de informes estructurados en PDF / Markdown  |
       +-----------------------------------------------------------+
```

## 2. Componentes del Backend

### A. Ingestion Engine (`app/services/scraper/`)
- Mapeo de fuentes: URLs de feeds RSS verificadas de los 10 medios.
- Extractor de contenido: `trafilatura` para extraer cuerpo, autor, fecha y resumen sin código basura HTML.
- Normalizador: Homologa fechas en formato UTC y campos estandarizados.

### B. NLP Pipeline (`app/services/nlp/`)
- **Clasificador Temático**: Asigna noticias a categorías predefinidas: *Política, Economía, Sociedad, Salud, Medio Ambiente, Deportes, Cultura, Tecnología, Conflicto y Paz, Internacional*.
- **Agrupador de Acontecimientos (*Event Clusterer*)**:
  - Transforma titulares y síntesis en embeddings multilingües (`paraphrase-multilingual-MiniLM-L12-v2`).
  - Aplica cálculo de similitud de cosenos restringido a una ventana temporal (e.g. 72 horas).
  - Si un artículo supera el umbral de similitud con un clúster activo, se asocia al mismo acontecimiento; de lo contrario, inaugura un nuevo clúster de evento.
- **Analizador de Encuadres (*Framing & Sentiment Analyzer*)**:
  - Utiliza modelos estructurados para extraer: ángulo principal (e.g., coste fiscal vs. beneficio social), actores destacados, actores omitidos y tono general (neutro, crítico, institucional, de alarma).

### C. Coverage & Trends Engine (`app/services/`)
- **Métricas de Cobertura**:
  - Volumen absoluto de publicaciones por medio y tema.
  - *Share of Voice* (% relativo respecto al total de noticias del medio en la ventana).
  - Brecha de cobertura entre medios nacionales e internacionales.
- **Detección de Tendencias**:
  - Algoritmo de velocidad y aceleración de temas (tasa de cambio temporal $\Delta f / \Delta t$).
  - Clasificación en: *Emergente / En auge*, *Estable* o *En declive*.

### D. Report Generator (`app/services/reporter/`)
- Compilador de reportes en Markdown estructurado y PDF.
- Cumple rigurosamente el principio de separación:
  - **Sección A: Evidencia Empírica** (Tabla de fuentes, conteo exacto de artículos, titulares textuales y enlaces directos a medios).
  - **Sección B: Síntesis Analítica Asistida por IA** (Patrones de encuadre detectados, divergencias editoriales, advertencias metodológicas).

## 3. Modelo de Datos Relacional

```
[MediaSource] (1) <---> (N) [Article] (N) <---> (1) [EventCluster]
                                |
                                v (1)
                           [ArticleFraming] (1)
```

- **MediaSource**: `id`, `name`, `country` (Colombia / Internacional), `url`, `rss_feeds`, `bias_indicators`, `is_active`.
- **Article**: `id`, `source_id`, `title`, `url`, `published_at`, `raw_text`, `summary`, `category`, `embedding`, `cluster_id`.
- **EventCluster**: `id`, `canonical_title`, `first_seen_at`, `last_updated_at`, `topic`, `article_count`.
- **ArticleFraming**: `article_id`, `highlighted_aspects`, `tone`, `narrative_angle`, `detected_entities`.
- **Report**: `id`, `title`, `date_range`, `filters_applied`, `empirical_data_json`, `ai_synthesis_markdown`, `created_at`.
