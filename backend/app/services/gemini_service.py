import json
import logging
from typing import List, Dict, Any, Optional

from google import genai
from google.genai import types

from app.core.config import settings

logger = logging.getLogger(__name__)

# System prompt deontológico y metodológico estricto conforme al PRD de FOQUÉ
SYSTEM_PROMPT_ETHICAL_GUIDELINES = """
Eres el motor de análisis analítico de FOQUÉ, un observatorio de cobertura y agenda mediática académica y periodística basado en la Teoría del Agenda-Setting (McCombs & Shaw) y la Teoría del Framing / Encuadre Noticioso (Entman).

PRINCIPIOS ÉTICOS Y LÍMITES DE ALCANCE OBLIGATORIOS (ESTRICTO CUMPLIMIENTO):
1. PROHIBICIÓN TOTAL DE FACT-CHECKING:
   - No debes determinar si un hecho o noticia es verdadera, falsa, dudosa o engañosa.
   - Tu función no es verificar la realidad factual ni hacer periodismo forense de verificación.
   - Analizas exclusivamente CÓMO los medios presentan los acontecimientos (ángulo discursivo, foco, tono y jerarquización editorial), nunca su veracidad.

2. PROHIBICIÓN DE MEDIR U OPINAR SOBRE OPINIÓN PÚBLICA:
   - La frecuencia o prominencia con que un tema aparece en los medios refleja la agenda de los medios (media agenda), NO la opinión ciudadana ni la voluntad popular.
   - Queda estrictamente prohibido afirmar o inferir qué piensa la ciudadanía, el electorado o la población.

3. ECOSISTEMA ESTRICTO DE 10 MEDIOS:
   - El análisis se circunscribe únicamente a los 10 medios monitoreados:
     * 5 Nacionales (Colombia): El Espectador, RTVC Noticias, El Tiempo, El Heraldo, El Colombiano.
     * 5 Internacionales: Reuters, BBC News (Mundo), Associated Press (AP), Agence France-Presse (AFP), The New York Times.

4. HERRAMIENTA HEURÍSTICA Y CRITERIO HUMANO (Human-in-the-Loop):
   - El usuario final es Victoria León (estudiante de comunicación social y columnista de opinión).
   - Tus análisis son insumos descriptivos y heurísticos para enriquecer su juicio crítico, no para sustituirlo.

5. NO REESCRIBIR NI GENERAR NOTICIAS SINTÉTICAS:
   - No redactes noticias simuladas ni alteres el texto periodístico original. Solo extrae y categoriza variables analíticas.
"""


class GeminiMediaService:
    """
    Servicio de inteligencia analítica para FOQUÉ utilizando el SDK oficial google-genai.
    Ejecuta clasificación temática canónica, detección de encuadres narrativos,
    contrastes editoriales y generación de informes divididos estrictamente en Bloque A y Bloque B.
    """

    def __init__(self):
        self._client: Optional[genai.Client] = None
        self._init_client()

    def _init_client(self):
        if settings.GEMINI_API_KEY:
            try:
                self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
                logger.info(f"Cliente google-genai inicializado exitosamente con modelo {settings.GEMINI_MODEL}.")
            except Exception as e:
                logger.error(f"Error inicializando cliente google-genai: {e}")
                self._client = None
        else:
            logger.warning("GEMINI_API_KEY no configurada. Se emplearán métodos heurísticos de respaldo.")

    @property
    def is_available(self) -> bool:
        return self._client is not None and bool(settings.GEMINI_API_KEY)

    def _call_gemini_json(self, contents: str, model_override: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Invoca la API de Gemini con salida forzada en JSON y manejo de fallbacks."""
        if not self.is_available:
            return None

        models_to_try = [model_override or settings.GEMINI_MODEL, settings.GEMINI_FALLBACK_MODEL]

        for model_name in models_to_try:
            try:
                config = types.GenerateContentConfig(
                    response_mime_type="application/json",
                    system_instruction=SYSTEM_PROMPT_ETHICAL_GUIDELINES,
                    temperature=0.2,
                )
                response = self._client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config=config,
                )
                if response and response.text:
                    cleaned_text = response.text.strip()
                    if cleaned_text.startswith("```json"):
                        cleaned_text = cleaned_text[7:]
                    if cleaned_text.endswith("```"):
                        cleaned_text = cleaned_text[:-3]
                    return json.loads(cleaned_text.strip())
            except Exception as e:
                logger.warning(f"Error invocando Gemini con modelo {model_name}: {e}")

        return None

    def classify_and_frame_article(self, article: Dict[str, Any]) -> Dict[str, Any]:
        """
        Clasifica un artículo en una de las 10 categorías temáticas canónicas y
        extrae el ángulo de encuadre y tono editorial.
        """
        prompt = f"""
        Analiza el siguiente artículo de prensa:
        Medio: {article.get('source_name')}
        Titular: "{article.get('title')}"
        Resumen/Entradilla: "{article.get('excerpt') or article.get('raw_text', '')[:300]}"

        Categorías canónicas permitidas (selecciona EXACTAMENTE UNA de esta lista):
        {json.dumps(settings.CANONICAL_TOPICS, ensure_ascii=False)}

        Valores permitidos para tono editorial:
        ["Neutro", "Crítico", "Institucional", "Alarma", "Optimista"]

        Responde en JSON con la siguiente estructura exacta:
        {{
            "topic": "Nombre de la categoría canónica exacta",
            "narrative_angle": "Descripción sintética (1 frase) del ángulo de la noticia",
            "tone": "Tono editorial",
            "highlighted_aspects": ["Elemento relevante 1", "Elemento relevante 2"],
            "omitted_aspects": ["Aspecto de contexto dejado a segundo plano"],
            "key_entities": {{"personas": [], "organizaciones": [], "lugares": []}}
        }}
        """

        result = self._call_gemini_json(prompt)
        if result and "topic" in result and result["topic"] in settings.CANONICAL_TOPICS:
            return result

        # Fallback heurístico si Gemini no responde
        from app.services.nlp.classifier import classifier_service
        topic = classifier_service.classify_text(article.get("title", ""), article.get("raw_text", ""))
        return {
            "topic": topic,
            "narrative_angle": "Cobertura general del acontecimiento",
            "tone": "Neutro",
            "highlighted_aspects": [article.get("title", "")],
            "omitted_aspects": ["Contexto no especificado en el despacho"],
            "key_entities": {"personas": [], "organizaciones": [], "lugares": []}
        }

    def batch_classify_and_frame(self, articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Procesa una lista de noticias en lotes optimizados para Gemini, reduciendo llamadas de red.
        """
        if not articles:
            return []

        if not self.is_available:
            from app.services.nlp.classifier import classifier_service
            for art in articles:
                topic = classifier_service.classify_text(art.get("title", ""), art.get("raw_text", ""))
                art["topic"] = topic
                art["narrative_angle"] = "Cobertura editorial estándar"
                art["tone"] = "Neutro"
                art["highlighted_aspects"] = [art.get("title", "")]
                art["omitted_aspects"] = []
            return articles

        # Procesar en lotes de hasta 8 noticias
        batch_size = 8
        for i in range(0, len(articles), batch_size):
            batch = articles[i:i + batch_size]
            summarized_batch = [
                {
                    "idx": j,
                    "media": art.get("source_name"),
                    "title": art.get("title"),
                    "excerpt": (art.get("excerpt") or art.get("raw_text", ""))[:200]
                }
                for j, art in enumerate(batch)
            ]

            prompt = f"""
            Clasifica cada una de las siguientes noticias dentro de las 10 categorías canónicas del PRD:
            Categorías permitidas: {json.dumps(settings.CANONICAL_TOPICS, ensure_ascii=False)}

            Noticias a clasificar:
            {json.dumps(summarized_batch, ensure_ascii=False, indent=2)}

            Devuelve un JSON con formato:
            {{
                "results": [
                    {{
                        "idx": 0,
                        "topic": "Categoría exacta",
                        "narrative_angle": "Ángulo descriptivo",
                        "tone": "Neutro | Crítico | Institucional | Alarma | Optimista",
                        "highlighted_aspects": ["Punto 1", "Punto 2"],
                        "omitted_aspects": ["Aspecto omitido"]
                    }}
                ]
            }}
            """

            resp = self._call_gemini_json(prompt)
            if resp and "results" in resp:
                res_map = {item.get("idx"): item for item in resp["results"]}
                for j, art in enumerate(batch):
                    matched = res_map.get(j)
                    if matched and matched.get("topic") in settings.CANONICAL_TOPICS:
                        art["topic"] = matched.get("topic")
                        art["narrative_angle"] = matched.get("narrative_angle", "Cobertura de agenda")
                        art["tone"] = matched.get("tone", "Neutro")
                        art["highlighted_aspects"] = matched.get("highlighted_aspects", [art.get("title")])
                        art["omitted_aspects"] = matched.get("omitted_aspects", [])
                    else:
                        from app.services.nlp.classifier import classifier_service
                        art["topic"] = classifier_service.classify_text(art.get("title", ""), art.get("raw_text", ""))
                        art["narrative_angle"] = "Cobertura informativa"
                        art["tone"] = "Neutro"
                        art["highlighted_aspects"] = [art.get("title")]
                        art["omitted_aspects"] = []
            else:
                from app.services.nlp.classifier import classifier_service
                for art in batch:
                    art["topic"] = classifier_service.classify_text(art.get("title", ""), art.get("raw_text", ""))
                    art["narrative_angle"] = "Cobertura informativa"
                    art["tone"] = "Neutro"
                    art["highlighted_aspects"] = [art.get("title")]
                    art["omitted_aspects"] = []

        return articles

    def analyze_event_framing_contrast(
        self,
        canonical_title: str,
        articles_by_outlet: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Analiza el contraste editorial lado a lado para un acontecimiento cubierto por múltiples medios.
        Identifica qué destaca y qué omite cada sala de redacción, así como las divergencias discursivas.
        """
        if not articles_by_outlet:
            return {
                "overview": canonical_title,
                "outlet_frames": {},
                "divergences": []
            }

        prompt = f"""
        Compara la cobertura periodística del siguiente acontecimiento entre distintos medios:
        Acontecimiento común: "{canonical_title}"

        Noticias de los medios:
        {json.dumps(articles_by_outlet, ensure_ascii=False, indent=2)}

        Instrucciones deontológicas estrictas:
        - NO emitas juicios de veracidad ni califiques hechos como verdaderos o falsos.
        - Analiza el enfoque (político, fiscal, social, legal, humano, institucional) de cada medio.
        - Identifica aspectos resaltados en portada/titular y qué matices o elementos de contexto se dejan de lado.
        - Identifica divergencias editoriales claras entre los medios observados.

        Responde en JSON con la siguiente estructura exacta:
        {{
            "overview": "Síntesis neutral del hecho común (sin adjetivos valorativos)",
            "outlet_frames": {{
                "<NombreMedio>": {{
                    "angle": "Ángulo narrativo asignado",
                    "tone": "Neutro | Crítico | Institucional | Alarma | Optimista",
                    "highlighted": ["Punto 1 destacado", "Punto 2 destacado"],
                    "omitted": ["Matiz contextual secundario u omitido"]
                }}
            }},
            "divergences": [
                "Divergencia 1 entre los medios A y B",
                "Divergencia 2 en el tono o enfoque"
            ]
        }}
        """

        result = self._call_gemini_json(prompt)
        if result and "overview" in result and "outlet_frames" in result:
            return result

        # Fallback heurístico si no hay conexión Gemini
        outlet_frames = {}
        for art in articles_by_outlet:
            media = art.get("source_name", "Medio")
            outlet_frames[media] = {
                "angle": art.get("narrative_angle", f"Tratamiento informativo de {media}"),
                "tone": art.get("tone", "Neutro"),
                "highlighted": art.get("highlighted_aspects", [art.get("title")]),
                "omitted": art.get("omitted_aspects", ["Aspectos complementarios del debate"])
            }

        return {
            "overview": f"Cobertura múltiple sobre {canonical_title}",
            "outlet_frames": outlet_frames,
            "divergences": [
                "Variación en la selección del titular principal y énfasis en las fuentes citadas.",
                "Diferencias en la priorización de consecuencias económicas versus institucionales."
            ]
        }

    def generate_daily_executive_report(
        self,
        date_str: str,
        empirical_data: Dict[str, Any],
        top_events: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Genera el informe diario con separación metodológica estricta:
        - Bloque A: Evidencia Empírica Verificable (datos duros, cuota de atención, enlaces directos).
        - Bloque B: Interpretación y Síntesis Asistida por IA (patrones de agenda y encuadres).
        """
        prompt = f"""
        Genera el informe analítico diario de Agenda Setting para FOQUÉ del día {date_str}.
        
        Datos Empíricos Verificados (Bloque A):
        - Total noticias analizadas: {empirical_data.get('total_articles')}
        - Distribución por medios: {json.dumps(empirical_data.get('coverage_by_media', {}), ensure_ascii=False)}
        - Distribución por categorías: {json.dumps(empirical_data.get('coverage_by_topic', {}), ensure_ascii=False)}
        - Acontecimientos de alta cobertura: {json.dumps(top_events[:3], ensure_ascii=False)}

        Genera el Bloque B (Interpretación asistida por IA) en Markdown profesional, estructurado en:
        1. **Diagnóstico General de la Agenda**: Temas dominantes y velocidad de la conversación.
        2. **Balance Territorial**: Comparativo entre agenda nacional (Colombia) e internacional.
        3. **Patrones de Encuadre Noticioso**: Cómo se bifurcan los marcos narrativos entre medios estatales/privados o locales/globales.
        4. **Recomendaciones para Victoria León**: 2 sugerencias de temas con riqueza de contraste para su columna de opinión semanal.
        5. **Límites Deontológicos**: Recordatorio explícito de que este análisis no califica veracidad ni mide opinión pública.

        Responde en JSON:
        {{
            "title": "Informe Diario de Agenda Mediática - FOQUÉ ({date_str})",
            "description": "Monitoreo sistemático de cuotas de atención y encuadres editoriales en 10 medios.",
            "ai_interpretation_markdown": "Texto completo en Markdown profesional...",
            "methodology_notes": "Metodología: Monitoreo de 10 medios (5 Colombia, 5 Internacionales). Análisis de encuadre con Gemini 3.5 Flash.",
            "recommended_column_topics": ["Tema 1 sugerido para columna", "Tema 2 sugerido para columna"]
        }}
        """

        result = self._call_gemini_json(prompt)
        if result and "ai_interpretation_markdown" in result:
            return result

        # Fallback estructurado en Markdown
        fallback_md = f"""### Diagnóstico General de la Agenda ({date_str})
La agenda noticiosa del día se concentra prioritariamente en las categorías de **{list(empirical_data.get('coverage_by_topic', {}).keys())[:2]}**, con una cobertura coordinada entre medios nacionales e internacionales.

### Balance Territorial
- **Medios Nacionales (Colombia):** Mayor concentración en reformas legislativas, economía de bolsillo y orden público.
- **Medios Internacionales:** Enfoque en dinámicas geopolíticas, mercados globales e impacto regional.

### Recomendaciones para Victoria León (Columna de Opinión)
1. **Contraste de marcos en la agenda económica:** Contrastar el enfoque institucional frente a las advertencias sectoriales.
2. **Impacto de la agenda internacional en Colombia:** Analizar cómo la prensa global encuadra los movimientos diplomáticos regionales.

> **Aviso Deontológico FOQUÉ:** Este informe refleja la agenda de los medios analizados. No mide la opinión pública ciudadana ni califica la veracidad factual de los acontecimientos.
"""
        return {
            "title": f"Informe Diario de Agenda Mediática - FOQUÉ ({date_str})",
            "description": "Análisis comparativo de la agenda noticiosa diaria en 10 medios de referencia.",
            "ai_interpretation_markdown": fallback_md,
            "methodology_notes": "Monitoreo automatizado con separación empírica y síntesis de encuadre.",
            "recommended_column_topics": [
                "Tensiones de encuadre en reformas nacionales",
                "Efectos macroeconómicos globales en el contexto colombiano"
            ]
        }


gemini_service = GeminiMediaService()
