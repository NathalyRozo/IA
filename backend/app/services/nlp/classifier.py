import logging
from typing import List, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

# Palabras clave orientativas para clasificación heurística rápida
TOPIC_KEYWORDS = {
    "Política": ["gobierno", "congreso", "presidente", "senado", "elecciones", "partido", "ministro", "ley", "reforma", "diputados", "corte", "alcalde"],
    "Economía": ["inflación", "dólar", "tasas", "banco", "mercados", "petróleo", "pib", "salario", "inversión", "tributaria", "empleo", "aranceles"],
    "Conflicto y Paz": ["guerrilla", "eln", "disidencias", "paz", "cese al fuego", "víctimas", "seguridad", "ejército", "atentado", "combates"],
    "Salud": ["hospital", "minsalud", "enfermedad", "vacunas", "eps", "médicos", "tratamiento", "epidemia", "oms", "medicamentos"],
    "Medio Ambiente": ["clima", "deforestación", "amazonia", "cop", "calentamiento", "biodiversidad", "sequía", "inundación", "energía renovable"],
    "Internacional": ["eeuu", "ucrania", "rusia", "medio oriente", "israel", "gaza", "onu", "china", "europa", "venezuela", "otan"],
    "Tecnología": ["inteligencia artificial", "ia", "software", "ciberseguridad", "google", "meta", "chips", "redes sociales", "algoritmo"],
    "Deportes": ["fútbol", "selección", "liga", "campeonato", "copa", "gol", "ciclismo", "olímpicos", "jugador", "dt"],
    "Cultura": ["música", "cine", "libro", "arte", "festival", "concierto", "premio", "teatro", "literatura"],
    "Sociedad": ["educación", "mujeres", "movilidad", "transporte", "comunidad", "derechos", "indígenas", "protesta", "denuncia"]
}


class TopicClassifier:
    """
    Clasificador híbrido de temas periodísticos.
    Combina coincidencia ponderada de palabras clave con análisis de lenguaje.
    """

    def classify_text(self, title: str, text: str = "") -> str:
        content = f"{title.lower()} {text.lower()}"
        scores = {}

        for topic, keywords in TOPIC_KEYWORDS.items():
            score = 0
            for kw in keywords:
                if kw in title.lower():
                    score += 3  # Mayor peso al titular
                elif kw in content:
                    score += 1
            if score > 0:
                scores[topic] = score

        if scores:
            best_topic = max(scores, key=scores.get)
            return best_topic

        return "Sociedad"


classifier_service = TopicClassifier()
