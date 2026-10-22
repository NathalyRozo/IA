from typing import List, Dict, Any

# Configuración exhaustiva de los 10 medios de comunicación requeridos:
# 5 Nacionales (Colombia) y 5 Internacionales
DEFAULT_MEDIA_SOURCES: List[Dict[str, Any]] = [
    # --- MEDIOS NACIONALES (COLOMBIA) ---
    {
        "slug": "el-espectador",
        "name": "El Espectador",
        "scope": "nacional",
        "country": "Colombia",
        "website_url": "https://www.elespectador.com",
        "rss_url": "https://www.elespectador.com/arc/outboundfeeds/rss/",
        "is_active": True,
    },
    {
        "slug": "rtvc-noticias",
        "name": "RTVC Noticias",
        "scope": "nacional",
        "country": "Colombia",
        "website_url": "https://rtvcnoticias.com",
        "rss_url": "https://rtvcnoticias.com/feed",
        "is_active": True,
    },
    {
        "slug": "el-tiempo",
        "name": "El Tiempo",
        "scope": "nacional",
        "country": "Colombia",
        "website_url": "https://www.eltiempo.com",
        "rss_url": "https://www.eltiempo.com/rss",
        "is_active": True,
    },
    {
        "slug": "el-heraldo",
        "name": "El Heraldo",
        "scope": "nacional",
        "country": "Colombia",
        "website_url": "https://www.elheraldo.co",
        "rss_url": "https://www.elheraldo.co/rss.xml",
        "is_active": True,
    },
    {
        "slug": "el-colombiano",
        "name": "El Colombiano",
        "scope": "nacional",
        "country": "Colombia",
        "website_url": "https://www.elcolombiano.com",
        "rss_url": "https://www.elcolombiano.com/rss",
        "is_active": True,
    },

    # --- MEDIOS INTERNACIONALES ---
    {
        "slug": "reuters",
        "name": "Reuters",
        "scope": "internacional",
        "country": "Internacional",
        "website_url": "https://www.reuters.com",
        "rss_url": "https://www.reutersagency.com/feed/?taxonomy=markets&post_type=best",
        "is_active": True,
    },
    {
        "slug": "bbc-news",
        "name": "BBC News (Mundo)",
        "scope": "internacional",
        "country": "Reino Unido / Internacional",
        "website_url": "https://www.bbc.com/mundo",
        "rss_url": "https://feeds.bbci.co.uk/mundo/rss.xml",
        "is_active": True,
    },
    {
        "slug": "associated-press",
        "name": "Associated Press (AP)",
        "scope": "internacional",
        "country": "Estados Unidos / Internacional",
        "website_url": "https://apnews.com",
        "rss_url": "https://apnews.com/rss",
        "is_active": True,
    },
    {
        "slug": "afp",
        "name": "Agence France-Presse (AFP)",
        "scope": "internacional",
        "country": "Francia / Internacional",
        "website_url": "https://www.afp.com/es",
        "rss_url": "https://www.afp.com/es/noticias/feed",
        "is_active": True,
    },
    {
        "slug": "new-york-times",
        "name": "The New York Times (Español / World)",
        "scope": "internacional",
        "country": "Estados Unidos / Internacional",
        "website_url": "https://www.nytimes.com/es",
        "rss_url": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
        "is_active": True,
    },
]
