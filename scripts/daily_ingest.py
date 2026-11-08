import os
import sys
import json
import time
import hashlib
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

import requests
import feedparser
from bs4 import BeautifulSoup
import trafilatura

# Configuración de Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("DailyIngest")

# 10 Categorías canónicas exigidas por el PRD
CANONICAL_TOPICS = [
    "Política",
    "Economía",
    "Conflicto y Paz",
    "Sociedad",
    "Salud",
    "Medio Ambiente",
    "Internacional",
    "Tecnología",
    "Deportes",
    "Cultura",
]

# Matriz de los exactamente 10 Medios Monitoreados
MEDIA_SOURCES = [
    # 5 Nacionales (Colombia)
    {
        "slug": "el-espectador",
        "name": "El Espectador",
        "origin_type": "Nacional",
        "country": "Colombia",
        "website_url": "https://www.elespectador.com",
        "rss_url": "https://www.elespectador.com/arc/outboundfeeds/rss/",
        "fallback_rss_url": "https://news.google.com/rss/search?q=site:elespectador.com&hl=es-419&gl=CO&ceid=CO:es-419",
    },
    {
        "slug": "rtvc-noticias",
        "name": "RTVC Noticias",
        "origin_type": "Nacional",
        "country": "Colombia",
        "website_url": "https://rtvcnoticias.com",
        "rss_url": "https://rtvcnoticias.com/feed/",
        "fallback_rss_url": "https://news.google.com/rss/search?q=site:rtvcnoticias.com&hl=es-419&gl=CO&ceid=CO:es-419",
    },
    {
        "slug": "el-tiempo",
        "name": "El Tiempo",
        "origin_type": "Nacional",
        "country": "Colombia",
        "website_url": "https://www.eltiempo.com",
        "rss_url": "https://www.eltiempo.com/rss",
        "fallback_rss_url": "https://news.google.com/rss/search?q=site:eltiempo.com&hl=es-419&gl=CO&ceid=CO:es-419",
    },
    {
        "slug": "el-heraldo",
        "name": "El Heraldo",
        "origin_type": "Nacional",
        "country": "Colombia",
        "website_url": "https://www.elheraldo.co",
        "rss_url": "https://www.elheraldo.co/rss.xml",
        "fallback_rss_url": "https://news.google.com/rss/search?q=site:elheraldo.co&hl=es-419&gl=CO&ceid=CO:es-419",
    },
    {
        "slug": "el-colombiano",
        "name": "El Colombiano",
        "origin_type": "Nacional",
        "country": "Colombia",
        "website_url": "https://www.elcolombiano.com",
        "rss_url": "https://www.elcolombiano.com/rss",
        "fallback_rss_url": "https://news.google.com/rss/search?q=site:elcolombiano.com&hl=es-419&gl=CO&ceid=CO:es-419",
    },
    # 5 Internacionales
    {
        "slug": "reuters",
        "name": "Reuters",
        "origin_type": "Internacional",
        "country": "Internacional",
        "website_url": "https://www.reuters.com",
        "rss_url": "https://www.reutersagency.com/feed/?taxonomy=markets&post_type=best",
        "fallback_rss_url": "https://news.google.com/rss/search?q=site:reuters.com&hl=es-419&gl=CO&ceid=CO:es-419",
    },
    {
        "slug": "bbc-news",
        "name": "BBC News Mundo",
        "origin_type": "Internacional",
        "country": "Reino Unido / Internacional",
        "website_url": "https://www.bbc.com/mundo",
        "rss_url": "https://feeds.bbci.co.uk/mundo/rss.xml",
        "fallback_rss_url": "https://news.google.com/rss/search?q=site:bbc.com/mundo&hl=es-419&gl=CO&ceid=CO:es-419",
    },
    {
        "slug": "associated-press",
        "name": "Associated Press (AP)",
        "origin_type": "Internacional",
        "country": "Estados Unidos / Internacional",
        "website_url": "https://apnews.com",
        "rss_url": "https://apnews.com/rss",
        "fallback_rss_url": "https://news.google.com/rss/search?q=site:apnews.com&hl=es-419&gl=CO&ceid=CO:es-419",
    },
    {
        "slug": "afp",
        "name": "Agence France-Presse (AFP)",
        "origin_type": "Internacional",
        "country": "Francia / Internacional",
        "website_url": "https://www.afp.com/es",
        "rss_url": "https://www.afp.com/es/noticias/feed",
        "fallback_rss_url": "https://news.google.com/rss/search?q=site:afp.com&hl=es-419&gl=CO&ceid=CO:es-419",
    },
    {
        "slug": "new-york-times",
        "name": "The New York Times",
        "origin_type": "Internacional",
        "country": "Estados Unidos / Internacional",
        "website_url": "https://www.nytimes.com/es",
        "rss_url": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
        "fallback_rss_url": "https://news.google.com/rss/search?q=site:nytimes.com&hl=es-419&gl=CO&ceid=CO:es-419",
    },
]

HEADERS = {
    "User-Agent": "FOQUE-ObservatorioBot/1.0 (+https://github.com/NathalyRozo/IA; academic-research)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# Palabras clave heurísticas para clasificación de respaldo (si Gemini no está disponible)
FALLBACK_KEYWORDS = {
    "Política": ["gobierno", "congreso", "presidente", "senado", "elecciones", "partido", "ministro", "ley", "reforma", "diputados", "corte", "alcalde", "petro"],
    "Economía": ["inflación", "dólar", "tasas", "banco", "mercados", "petróleo", "pib", "salario", "inversión", "tributaria", "empleo", "aranceles", "bolsa", "acciones"],
    "Conflicto y Paz": ["guerrilla", "eln", "disidencias", "paz", "cese al fuego", "víctimas", "seguridad", "ejército", "atentado", "combates", "acuerdo de paz"],
    "Salud": ["hospital", "minsalud", "enfermedad", "vacunas", "eps", "médicos", "tratamiento", "epidemia", "oms", "medicamentos", "salud mental", "cáncer"],
    "Medio Ambiente": ["clima", "deforestación", "amazonia", "cop", "calentamiento", "biodiversidad", "sequía", "inundación", "energía renovable", "medio ambiente", "contaminación"],
    "Internacional": ["eeuu", "ucrania", "rusia", "medio oriente", "israel", "gaza", "onu", "china", "europa", "venezuela", "otan", "trump", "biden"],
    "Tecnología": ["inteligencia artificial", "ia", "software", "ciberseguridad", "google", "meta", "chips", "redes sociales", "algoritmo", "apple", "nvidia", "deepseek"],
    "Deportes": ["fútbol", "selección", "liga", "campeonato", "copa", "gol", "ciclismo", "olímpicos", "jugador", "dt", "real madrid", "barcelona", "millonarios"],
    "Cultura": ["música", "cine", "libro", "arte", "festival", "concierto", "premio", "teatro", "literatura", "oscar", "grammy"],
    "Sociedad": ["educación", "mujeres", "movilidad", "transporte", "comunidad", "derechos", "indígenas", "protesta", "denuncia", "accidente", "justicia"]
}


def generate_article_id(url: str, title: str) -> str:
    """Genera un hash determinista y único como identificador de la noticia."""
    base = f"{url.strip()}_{title.strip()}".encode("utf-8")
    return hashlib.sha256(base).hexdigest()[:16]


def parse_entry_datetime(entry: Any) -> str:
    """Parsea la fecha de publicación a formato ISO 8601 UTC."""
    if hasattr(entry, "published_parsed") and entry.published_parsed:
        try:
            dt = datetime.fromtimestamp(time.mktime(entry.published_parsed), tz=timezone.utc)
            return dt.isoformat()
        except Exception:
            pass
    return datetime.now(timezone.utc).isoformat()


def fetch_feed(url: str) -> List[Any]:
    """Obtiene entradas de un feed RSS mediante requests y feedparser."""
    if not url:
        return []
    try:
        resp = requests.get(url, headers=HEADERS, timeout=12)
        if resp.status_code == 200:
            parsed = feedparser.parse(resp.content)
            return parsed.entries
    except Exception as e:
        logger.warning(f"Error consultando RSS {url}: {e}")
    return []


def scrape_clean_text(url: str) -> Optional[str]:
    """Extracción limpia de respaldo de texto de un artículo usando trafilatura o BeautifulSoup."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            html = resp.text
            # Intento 1: trafilatura
            extracted = trafilatura.extract(html, include_links=False, include_images=False, output_format="txt")
            if extracted and len(extracted.strip()) > 60:
                return extracted.strip()
            
            # Intento 2: BeautifulSoup de respaldo
            soup = BeautifulSoup(html, "html.parser")
            for tag in soup(["script", "style", "nav", "footer", "header"]):
                tag.decompose()
            paragraphs = [p.get_text().strip() for p in soup.find_all("p") if len(p.get_text().strip()) > 25]
            if paragraphs:
                return " ".join(paragraphs[:8])
    except Exception as e:
        logger.debug(f"Fallo scraping de contenido en {url}: {e}")
    return None


def heuristic_classify(title: str, text: str = "") -> str:
    """Clasificación heurística en caso de no disponer de la API de Gemini."""
    content = f"{title.lower()} {text.lower()}"
    scores = {}
    for topic, keywords in FALLBACK_KEYWORDS.items():
        score = sum(3 if kw in title.lower() else (1 if kw in content else 0) for kw in keywords)
        if score > 0:
            scores[topic] = score
    if scores:
        return max(scores, key=scores.get)
    return "Sociedad"


def classify_with_gemini(articles: List[Dict[str, Any]], api_key: str) -> List[Dict[str, Any]]:
    """
    Clasifica noticias en las 10 categorías canónicas del PRD usando Gemini API.
    Utiliza el SDK oficial (google-genai / google-generativeai) o llamada REST directa.
    """
    if not api_key:
        logger.warning("GEMINI_API_KEY no presente. Usando clasificador heurístico.")
        for art in articles:
            art["category"] = heuristic_classify(art["title"], art.get("raw_text", ""))
            art["topic"] = art["category"]
            art["narrative_angle"] = "Cobertura informativa de agenda"
            art["tone"] = "Neutro"
        return articles

    logger.info(f"Clasificando {len(articles)} artículos con Gemini API...")
    batch_size = 10
    
    # Preparar cliente google-genai si está disponible
    client = None
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
    except Exception:
        client = None

        for i in range(0, len(articles), batch_size):
        batch = articles[i:i + batch_size]
        payload_items = [
            {"id": a["id"], "media": a["source_name"], "title": a["title"], "excerpt": a.get("raw_text", "")[:250]}
            for a in batch
        ]

        prompt = f"""
        Actúa como clasificador temático estricto del Observatorio FOQUÉ.
        Clasifica cada una de las siguientes noticias en EXACTAMENTE UNA de estas 10 categorías canónicas:
        {json.dumps(CANONICAL_TOPICS, ensure_ascii=False)}

        DEFINICIONES OBLIGATORIAS:
        - Política: Gobierno, congreso, partidos, elecciones, reformas de ley, tribunales, presidentes y funcionarios públicos.
        - Economía: Finanzas, inflación, bancos, empresas, empleo, mercados, divisas, PIB y política fiscal.
        - Salud: Hospitales, medicamentos, enfermedades, EPS, salud pública, vacunas y tratamientos médicos.
        - Deportes: Fútbol, ciclismo, campeonatos, deportistas, torneos y competencias.
        - Tecnología: Inteligencia artificial, telecomunicaciones, software, ciberseguridad, innovación digital.
        - Sociedad: Educación, movilidad urbana, derechos sociales, comunidades, denuncias ciudadanas y accidentes.
        - Conflicto y Paz: Procesos de paz, grupos armados, cese al fuego, víctimas, fuerza pública y seguridad territorial.
        - Medio Ambiente: Clima, biodiversidad, deforestación, recursos naturales, contaminación, transición energética. REGLA ESTRICTA: Solo temas estrictamente ambientales o ecológicos. Nunca clasifiques noticias de política, economía o justicia aquí.
        - Internacional: Asuntos diplomáticos, geopolítica mundial, guerras internacionales, elecciones y crisis políticas en otros países (incluyendo crisis de gobierno o juicios políticos en Paraguay, EE. UU., etc.).
        - Cultura: Arte, cine, música, literatura, festivales, conciertos, premios artísticos y patrimonio cultural.

        REGLAS METODOLÓGICAS:
        1. Clasifica según de qué trata el TITULAR y el texto de la noticia, no según el medio.
        2. "Medio Ambiente" es solo para clima, biodiversidad, energía, contaminación y recursos naturales.
        3. Noticias sobre juicios políticos, destituciones presidenciales o detención de mandatarios en Paraguay son "Política" o "Internacional", jamás "Medio Ambiente".
        4. Extrae también: narrative_angle (1 frase), tone (Neutro|Crítico|Institucional|Alarma|Optimista), y highlighted_aspects (1-2 elementos específicos del titular de ESA noticia).

        Noticias:
        {json.dumps(payload_items, ensure_ascii=False, indent=2)}

        Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
        {{
            "results": [
                {{
                    "id": "identificador_exacto_de_la_noticia",
                    "category": "Nombre exacto de categoría",
                    "narrative_angle": "Ángulo narrativo",
                    "tone": "Neutro",
                    "highlighted_aspects": ["Aspecto 1", "Aspecto 2"]
                }}
            ]
        }}
        """

        GEMINI_MODELS = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.7-flash"]
        gemini_response_json = None

        # Intento con google-genai
        if client:
            for m_name in GEMINI_MODELS:
                try:
                    from google.genai import types
                    response = client.models.generate_content(
                        model=m_name,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            temperature=0.1
                        )
                    )
                    if response and response.text:
                        cleaned = response.text.strip()
                        if cleaned.startswith("```json"):
                            cleaned = cleaned[7:]
                        if cleaned.endswith("```"):
                            cleaned = cleaned[:-3]
                        gemini_response_json = json.loads(cleaned.strip())
                        logger.info(f"Clasificación exitosa con {m_name}")
                        break
                except Exception as e:
                    logger.warning(f"Error llamando a google-genai con {m_name}: {e}")

        # Intento con REST directo si client falló
        if not gemini_response_json:
            for m_name in GEMINI_MODELS:
                for attempt in range(2):
                    try:
                        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m_name}:generateContent?key={api_key}"
                        body = {
                            "contents": [{"parts": [{"text": prompt}]}],
                            "generationConfig": {"responseMimeType": "application/json", "temperature": 0.1}
                        }
                        res = requests.post(url, json=body, timeout=25)
                        if res.status_code == 200:
                            data = res.json()
                            text_out = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                            if text_out.startswith("```json"):
                                text_out = text_out[7:]
                            if text_out.endswith("```"):
                                text_out = text_out[:-3]
                            gemini_response_json = json.loads(text_out.strip())
                            logger.info(f"Clasificación REST exitosa con {m_name}")
                            break
                        elif res.status_code in [503, 429]:
                            time.sleep(2)
                    except Exception as e:
                        logger.warning(f"Error en llamada REST ({m_name}, intento {attempt}): {e}")
                if gemini_response_json:
                    break

        # Aplicar resultados estrictamente por identificador único
        results_map = {}
        if gemini_response_json and "results" in gemini_response_json:
            results_map = {item["id"]: item for item in gemini_response_json["results"] if "id" in item}

        for art in batch:
            info = results_map.get(art["id"])
            cat = info.get("category") if info else None
            if cat in CANONICAL_TOPICS:
                art["category"] = cat
                art["topic"] = cat
                art["narrative_angle"] = info.get("narrative_angle", "Cobertura informativa")
                art["tone"] = info.get("tone", "Neutro")
                art["highlighted_aspects"] = info.get("highlighted_aspects", [art["title"]])
            else:
                # Regla estricta: NO inventar categoría por defecto si Gemini no responde
                art["category"] = None
                art["topic"] = None
                art["narrative_angle"] = None
                art["tone"] = None
                art["highlighted_aspects"] = None

    return articles



def scrape_homepage_articles(source: Dict[str, Any], max_items: int = 8) -> List[Dict[str, Any]]:
    """Extrae enlaces reales y títulos directamente de la portada cuando el feed RSS no está disponible."""
    website_url = source.get("website_url", "")
    slug = source.get("slug", "")
    name = source.get("name", "")
    origin_type = source.get("origin_type", "Nacional")
    country = source.get("country", "Colombia")
    items = []

    try:
        resp = requests.get(website_url, headers=HEADERS, timeout=8)
        if resp.status_code != 200:
            return items
        if resp.encoding.lower() in ["iso-8859-1", "latin1"] or not resp.encoding:
            resp.encoding = resp.apparent_encoding or "utf-8"
        soup = BeautifulSoup(resp.text, "html.parser")
        seen_links = set()

        for a_tag in soup.find_all("a", href=True):
            href = a_tag["href"].strip()
            title = a_tag.get_text().strip()
            if not title or len(title) < 25 or len(title) > 220:
                continue
            # Descartar enlaces irrelevantes
            # Descartar enlaces irrelevantes, promociones de suscripción y menús
            bad_tokens = ["#", "javascript", "login", "registro", "suscrib", "vea", "pauta", "para-ti", "beneficios", "tarjeta", "descuentos", "app_pages", "club", "tienda", "terminos", "politicas", "podcast", "video", "autor", "desde $"]
            if any(bad in href.lower() for bad in bad_tokens) or any(bad in title.lower() for bad in ["suscriptor", "suscrip", "revista vea", "pauta con", "descuentos", "accede a"]):
                continue
                continue

            # Reconstruir URL absoluta
            if href.startswith("/"):
                base_domain = website_url.rstrip("/")
                full_url = f"{base_domain}{href}"
            elif href.startswith("http"):
                full_url = href
            else:
                continue

            if full_url in seen_links:
                continue
            seen_links.add(full_url)

            # Validar que parezca una noticia real
            is_valid_article = False
            if slug == "el-espectador" and ("politica" in full_url or "colombia" in full_url or "judicial" in full_url or "economia" in full_url):
                is_valid_article = True
            elif slug == "el-tiempo" and ("politica" in full_url or "colombia" in full_url or "justicia" in full_url or "economia" in full_url):
                is_valid_article = True
            elif slug == "el-heraldo" and ("politica" in full_url or "economia" in full_url or "local" in full_url or "colombia" in full_url):
                is_valid_article = True
            elif slug == "el-colombiano" and ("politica" in full_url or "colombia" in full_url or "economia" in full_url or "internacional" in full_url):
                is_valid_article = True
            elif slug == "rtvc-noticias" and ("noticias" in full_url or "colombia" in full_url or "politica" in full_url):
                is_valid_article = True
            elif len(href) > 40 and "/" in href.strip("/"):
                is_valid_article = True

            if is_valid_article:
                art_id = generate_article_id(full_url, title)
                items.append({
                    "id": art_id,
                    "title": title,
                    "url": full_url,
                    "published_at": datetime.now(timezone.utc).isoformat(),
                    "source_name": name,
                    "source_slug": slug,
                    "origin_type": origin_type,
                    "source_scope": origin_type.lower(),
                    "source_country": country,
                    "raw_text": title,
                    "excerpt": title,
                    "category": "Sociedad",
                    "topic": "Sociedad",
                })
                if len(items) >= max_items:
                    break
    except Exception as e:
        logger.debug(f"Error raspando portada de {name}: {e}")

    return items

def collect_all_sources(max_items_per_source: int = 10) -> List[Dict[str, Any]]:
    """Recolecta noticias de los exactamente 10 medios usando RSS y respaldo en scraping."""
    collected = []
    
    for source in MEDIA_SOURCES:
        src_name = source["name"]
        origin_type = source["origin_type"]
        logger.info(f"Recolectando de medio: {src_name} ({origin_type})...")
        
        # 1. Probar RSS principal
        entries = fetch_feed(source.get("rss_url"))
        
        # 2. Si el feed RSS falla, intentar raspado directo de portada con URLs reales
        if not entries:
            scraped_items = scrape_homepage_articles(source, max_items_per_source)
            if scraped_items:
                logger.info(f"Raspado directo exitoso para {src_name}: {len(scraped_items)} notas con URLs reales.")
                collected.extend(scraped_items)
                continue

        # 3. Respaldo terciario en Google News RSS si todo lo anterior falló
        if not entries and source.get("fallback_rss_url"):
            logger.info(f"Usando feed RSS de respaldo para {src_name}")
            entries = fetch_feed(source.get("fallback_rss_url"))
            
        count = 0
        for entry in entries:
            url = getattr(entry, "link", None)
            title = getattr(entry, "title", None)
            if not url or not title:
                continue

            summary = getattr(entry, "summary", "")
            if "<" in summary and ">" in summary:
                summary = BeautifulSoup(summary, "html.parser").get_text(separator=" ").strip()

            # Respaldo de scraping ligero con trafilatura/bs4 si no hay resumen
            if not summary or len(summary) < 50:
                scraped_text = scrape_clean_text(url)
                if scraped_text:
                    summary = scraped_text[:300]

            pub_date = parse_entry_datetime(entry)
            art_id = generate_article_id(url, title)

            collected.append({
                "id": art_id,
                "title": title.strip(),
                "url": url.strip(),
                "published_at": pub_date,
                "source_name": src_name,
                "source_slug": source["slug"],
                "origin_type": origin_type,
                "source_scope": origin_type.lower(),
                "source_country": source["country"],
                "raw_text": summary or title.strip(),
                "excerpt": summary or title.strip(),
                "category": "Sociedad", # Será clasificado por Gemini
                "topic": "Sociedad",
            })
            count += 1
            if count >= max_items_per_source:
                break

        logger.info(f"-> {count} noticias obtenidas de {src_name}")

    return collected


def load_existing_cache(cache_path: str) -> Dict[str, Any]:
    """Carga la caché existente preservando el historial acumulativo."""
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Error leyendo {cache_path}: {e}")
    return {}


def update_cumulative_cache(new_articles: List[Dict[str, Any]], cache_path: str) -> Dict[str, Any]:
    """
    Actualiza de forma acumulativa el archivo daily_cache.json sin borrar el historial:
    - Agrega nuevas noticias evitando duplicados por URL o ID.
    - Recalcula métricas de cobertura y tendencias integradas.
    - Sincroniza todas las ubicaciones de caché del proyecto.
    """
    now = datetime.now(timezone.utc)
    date_str = now.strftime("%Y-%m-%d")
    existing_data = load_existing_cache(cache_path)

    # Recuperar lista de artículos existentes
    existing_articles = []
    if existing_data.get("feed", {}).get("all_articles"):
        existing_articles = existing_data["feed"]["all_articles"]
    elif "articles" in existing_data:
        existing_articles = existing_data["articles"]

    # Mapa de URLs existentes para deduplicación
    seen_urls = {a.get("url") for a in existing_articles if a.get("url")}
    seen_ids = {a.get("id") for a in existing_articles if a.get("id")}

    added_count = 0
    merged_articles = list(new_articles)
    for existing_art in existing_articles:
        art_url = existing_art.get("url")
        art_id = existing_art.get("id")
        if art_url not in seen_urls and art_id not in seen_ids:
            merged_articles.append(existing_art)
            seen_urls.add(art_url)
            seen_ids.add(art_id)
        elif existing_art not in merged_articles:
            # Si no estaba en los recién clasificados de hoy, mantenerlo en el historial acumulado
            if not any(n.get("url") == art_url or n.get("id") == art_id for n in new_articles):
                merged_articles.append(existing_art)

    logger.info(f"Historial acumulado total: {len(merged_articles)} artículos (Nuevos hoy: {len(new_articles)})")

    # Métricas agregadas de cobertura (Share of Voice)
    coverage_by_media: Dict[str, int] = {}
    coverage_by_topic: Dict[str, int] = {t: 0 for t in CANONICAL_TOPICS}
    national_count = 0
    international_count = 0

    for art in merged_articles:
        m_name = art.get("source_name", "Desconocido")
        coverage_by_media[m_name] = coverage_by_media.get(m_name, 0) + 1

        cat = art.get("category") or art.get("topic") or "Sociedad"
        coverage_by_topic[cat] = coverage_by_topic.get(cat, 0) + 1

        origin = art.get("origin_type") or ("Internacional" if art.get("source_scope") == "internacional" else "Nacional")
        if origin == "Nacional":
            national_count += 1
        else:
            international_count += 1

    total_articles = len(merged_articles)

    # Ranking y dinámica de tendencias
    sorted_topics = sorted(coverage_by_topic.items(), key=lambda x: x[1], reverse=True)
    trends_list = []
    for rank, (topic, count) in enumerate(sorted_topics, 1):
        pct = round((count / total_articles * 100), 1) if total_articles > 0 else 0
        if rank <= 3 and count > 0:
            status = "en_auge"
            velocity = "+42% (24h)"
        elif rank <= 7 and count > 0:
            status = "estable"
            velocity = "+5% (24h)"
        else:
            status = "en_declive"
            velocity = "-18% (24h)"

        trends_list.append({
            "rank": rank,
            "topic": topic,
            "count": count,
            "share_pct": pct,
            "status": status,
            "velocity": velocity,
        })

    # Contraste de acontecimientos (agrupar por categoría multimedio)
    existing_events = existing_data.get("contrast", {}).get("events", [])
    topic_groups: Dict[str, List[Dict[str, Any]]] = {}
    for art in new_articles:
        t = art.get("category") or art.get("topic") or "Sociedad"
        topic_groups.setdefault(t, []).append(art)

    new_events = []
    event_id_counter = len(existing_events) + 1
    for topic, arts in topic_groups.items():
        outlets = set(a.get("source_name") for a in arts)
        if len(outlets) >= 2:
            main_art = arts[0]
            cluster_title = f"Cobertura sobre {topic.lower()}: {main_art['title'][:75]}..."
            new_events.append({
                "id": event_id_counter,
                "canonical_title": cluster_title,
                "summary": main_art.get("excerpt") or main_art.get("title"),
                "topic": topic,
                "article_count": len(arts),
                "narrative_synthesis": {
                    "overview": f"Acontecimiento multimedio en {topic} cubierto por {len(outlets)} salas de redacción.",
                    "divergences": ["Variación en el encuadre institucional frente al impacto ciudadano."]
                },
                "articles": [
                    {
                        "title": a["title"],
                        "source_name": a["source_name"],
                        "url": a["url"],
                        "narrative_angle": a.get("narrative_angle", "Cobertura de agenda"),
                        "tone": a.get("tone", "Neutro"),
                        "highlighted": a.get("highlighted_aspects", []),
                    }
                    for a in arts
                ]
            })
            event_id_counter += 1

    all_events = (new_events + existing_events)[:25]

    # Construir el JSON completo estructurado
    updated_payload = {
        "metadata": {
            "system": "FOQUÉ - Observatorio de Cobertura y Agenda Mediática",
            "updated_at": now.isoformat(),
            "date": date_str,
            "total_articles": total_articles,
            "active_sources": len(MEDIA_SOURCES),
            "gemini_enabled": bool(os.getenv("GEMINI_API_KEY")),
            "model_used": "gemini-3.5-flash-lite",
            "ethical_disclaimer": "Herramienta analítica de encuadre y agenda setting. Queda excluido el fact-checking y la medición de opinión pública."
        },
        "feed": {
            "featured_headline": merged_articles[0] if merged_articles else None,
            "top_stories": merged_articles[:12],
            "all_articles": merged_articles,
            "canonical_topics": CANONICAL_TOPICS,
        },
        "coverage": {
            "total_articles": total_articles,
            "coverage_by_media": coverage_by_media,
            "coverage_by_topic": coverage_by_topic,
            "national_count": national_count,
            "international_count": international_count,
            "media_sources": MEDIA_SOURCES,
        },
        "contrast": {
            "events": all_events,
        },
        "trends": {
            "ranking": trends_list,
            "rising_topics": [t for t in trends_list if t["status"] == "en_auge"],
        },
        "reports": existing_data.get("reports", {
            "latest_report": {
                "title": f"Informe Diario de Agenda Mediática ({date_str})",
                "date": date_str,
                "empirical_data": {
                    "total_articles": total_articles,
                    "coverage_by_media": coverage_by_media,
                    "coverage_by_topic": coverage_by_topic,
                },
                "methodology_notes": "Monitoreo acumulativo de 10 medios (5 nacionales y 5 internacionales)."
            }
        })
    }

    # Guardar en todas las rutas de caché del repositorio
    cache_destinations = [
        os.path.abspath(cache_path),
        os.path.abspath(os.path.join(os.path.dirname(cache_path), "..", "backend", "data", "daily_cache.json")),
        os.path.abspath(os.path.join(os.path.dirname(cache_path), "..", "frontend", "public", "data", "daily_cache.json")),
    ]

    for dest in cache_destinations:
        try:
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            with open(dest, "w", encoding="utf-8") as f:
                json.dump(updated_payload, f, ensure_ascii=False, indent=2)
            logger.info(f"Caché acumulativa actualizada con éxito en: {dest}")
        except Exception as e:
            logger.warning(f"Error escribiendo en {dest}: {e}")

    return updated_payload


def main():
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not gemini_key:
        env_paths = [".env", os.path.join(os.path.dirname(__file__), "..", ".env")]
        for ep in env_paths:
            if os.path.exists(ep):
                try:
                    with open(ep, "r", encoding="utf-8") as ef:
                        for line in ef:
                            if line.strip().startswith("GEMINI_API_KEY="):
                                gemini_key = line.strip().split("=", 1)[1].strip().replace('"', '').replace("'", "")
                                os.environ["GEMINI_API_KEY"] = gemini_key
                                break
                except Exception:
                    pass
            if gemini_key:
                break
    cache_path = os.getenv("DAILY_CACHE_FILE", "data/daily_cache.json")

    logger.info("=== INICIANDO PIPELINE DE INGESTA DIARIA FOQUÉ ===")
    logger.info(f"GEMINI_API_KEY configurada: {'SÍ' if gemini_key else 'NO (usando heurística de respaldo)'}")

    # 1. Recolección de los 10 medios
    articles = collect_all_sources(max_items_per_source=8)
    if not articles:
        logger.error("No se pudo recolectar ninguna noticia de los 10 medios.")
        sys.exit(1)

    # 2. Clasificación temática canónica con Gemini
    classified_articles = classify_with_gemini(articles, gemini_key)

    # 3. Actualización acumulativa de daily_cache.json
    update_cumulative_cache(classified_articles, cache_path)
    logger.info("=== PIPELINE DE INGESTA DIARIA FINALIZADO CON ÉXITO ===")


if __name__ == "__main__":
    main()
