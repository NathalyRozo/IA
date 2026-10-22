import json
import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class FramingAnalyzer:
    """
    Analizador de encuadres narrativos, tonos editoriales y contrastes de cobertura.
    Opera bajo estricta neutralidad axiológica: no evalúa la verdad, sino el ángulo discursivo.
    """

    async def analyze_event_contrast(
        self,
        canonical_title: str,
        articles_data: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Genera el contraste comparativo de coberturas entre los medios que publicaron sobre el acontecimiento.
        """
        # Si Gemini API Key está configurada, se invoca el LLM para síntesis profunda
        if settings.GEMINI_API_KEY:
            try:
                return await self._analyze_with_gemini(canonical_title, articles_data)
            except Exception as e:
                logger.error(f"Error invocando Gemini API para análisis de encuadre: {e}")

        # Fallback heurístico robusto para desarrollo local sin costo de API
        return self._analyze_heuristically(canonical_title, articles_data)

    async def _analyze_with_gemini(
        self,
        canonical_title: str,
        articles_data: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        from google import genai

        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        prompt = f"""
        Actúa como un analista experto en medios de comunicación y análisis del discurso periodístico.
        Analiza cómo diferentes medios han cubierto el siguiente acontecimiento:
        Acontecimiento: "{canonical_title}"

        Noticias recopiladas:
        {json.dumps(articles_data, indent=2, ensure_ascii=False)}

        Instrucciones estrictas:
        1. NO juzgues la veracidad ni declares si una noticia es falsa o verdadera.
        2. Identifica el ángulo de encuadre (económico, político, humano, legal, institucional).
        3. Identifica qué elementos destaca cada medio y qué aspectos contextuales deja de lado.
        4. Identifica el tono editorial (Neutro, Crítico, Alarma, Institucional, Optimista).
        5. Sintetiza las principales divergencias en el tratamiento informativo.

        Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
        {{
            "overview": "Resumen neutral del hecho común",
            "outlet_frames": {{
                "<NombreMedio>": {{
                    "angle": "Descripción corta del ángulo",
                    "tone": "Tono asignado",
                    "highlighted": ["punto 1", "punto 2"],
                    "omitted": ["punto 1"]
                }}
            }},
            "divergences": ["Diferencia clave 1 entre medios", "Diferencia clave 2"]
        }}
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)

    def _analyze_heuristically(
        self,
        canonical_title: str,
        articles_data: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Análisis analítico sintético para ejecución sin dependencias de API externa."""
        outlet_frames = {}
        headlines = []

        for item in articles_data:
            outlet = item.get("source_name", "Medio")
            headline = item.get("title", "")
            headlines.append(headline)

            # Detectar ángulo por vocabulario
            hl_lower = headline.lower()
            if any(w in hl_lower for w in ["millones", "dólar", "peso", "costo", "reforma", "precio", "pérdida"]):
                angle = "Enfoque económico y de costos fiscales"
                tone = "Crítico"
            elif any(w in hl_lower for w in ["gobierno", "presidente", "ministro", "congreso", "anuncia"]):
                angle = "Enfoque oficial e institucional"
                tone = "Institucional"
            elif any(w in hl_lower for w in ["víctimas", "comunidad", "afectados", "muerte", "tragedia", "crisis"]):
                angle = "Enfoque social y de impacto humano"
                tone = "Alarma"
            else:
                angle = "Enfoque informativo general"
                tone = "Neutro"

            outlet_frames[outlet] = {
                "angle": angle,
                "tone": tone,
                "highlighted": [f"Titular principal: '{headline}'"],
                "omitted": ["Detalles técnicos de fondo o perspectivas disidentes"]
            }

        return {
            "overview": f"Acontecimiento cubierto simultáneamente por {len(articles_data)} medios sobre '{canonical_title}'.",
            "outlet_frames": outlet_frames,
            "divergences": [
                "Disparidad en la jerarquización de los titulares de primera plana.",
                "Divergencia entre el enfoque institucional frente al impacto en la ciudadanía."
            ]
        }


framing_analyzer_service = FramingAnalyzer()
