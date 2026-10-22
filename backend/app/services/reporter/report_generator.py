import json
from datetime import datetime
from typing import Dict, Any, List


class ReportGenerator:
    """
    Generador de informes de análisis de cobertura mediática.
    Separa de manera explícita y transparente los datos empíricos de las interpretaciones por IA.
    """

    @staticmethod
    def build_markdown_report(
        title: str,
        description: str,
        date_from: datetime,
        date_to: datetime,
        empirical_data: Dict[str, Any],
        ai_interpretation: str,
        author_notes: str = ""
    ) -> str:
        date_str = f"{date_from.strftime('%Y-%m-%d')} a {date_to.strftime('%Y-%m-%d')}"
        total_arts = empirical_data.get("total_articles", 0)
        by_media = empirical_data.get("coverage_by_media", {})
        by_topic = empirical_data.get("coverage_by_topic", {})
        articles_sample = empirical_data.get("source_articles", [])[:15]

        md = f"""# INFORME DE ANÁLISIS DE COBERTURA MEDIÁTICA
**Título de la Investigación:** {title}  
**Periodo de Observación:** {date_str}  
**Fecha de Emisión del Informe:** {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}  

---

> ### ⚠️ NOTA METODOLÓGICA Y DESCARGO DE RESPONSABILIDAD
> 1. **No verificación fáctica:** Este informe analiza patrones de atención mediática y encuadres discursivos. No califica la veracidad o falsedad de los acontecimientos reportados.
> 2. **Diferenciación estricta:** La agenda mediática cuantificada refleja los criterios editoriales de los 10 medios observados y **no constituye un indicador de la opinión ciudadana**.
> 3. **Fuentes consultadas:** 10 medios de referencia (5 nacionales colombianos y 5 internacionales).

---

## 1. DESCRIPCIÓN Y OBJETIVOS DE LA INVESTIGACIÓN
{description or 'Análisis comparativo de la agenda informativa en medios nacionales e internacionales.'}

{f"**Notas del Investigador:** {author_notes}" if author_notes else ""}

---

## 2. BLOQUE A: EVIDENCIA EMPÍRICA Y DATOS OBSERVACIONALES
*Esta sección contiene únicamente mediciones cuantitativas directas y registros verificables de las fuentes.*

### 2.1. Métricas Globales
- **Total de artículos analizados:** {total_arts}
- **Medios activos con publicaciones:** {len(by_media)}

### 2.2. Distribución de Cobertura por Medio de Comunicación
| Medio | Volumen de Publicaciones | % del Total Analizado |
| :--- | :---: | :---: |
"""
        for media, count in by_media.items():
            pct = (count / total_arts * 100) if total_arts > 0 else 0
            md += f"| {media} | {count} | {pct:.1f}% |\n"

        md += """
### 2.3. Distribución Temática de la Agenda
| Tema / Categoría | Volumen de Artículos | % de la Agenda |
| :--- | :---: | :---: |
"""
        for topic, count in by_topic.items():
            pct = (count / total_arts * 100) if total_arts > 0 else 0
            md += f"| {topic} | {count} | {pct:.1f}% |\n"

        md += """
### 2.4. Muestra de Registro de Fuentes y Titulares Verificables
*Enlaces directos a las publicaciones originales utilizadas en el estudio:*

"""
        for art in articles_sample:
            md += f"- **[{art.get('media', 'Medio')}]** [{art.get('title')}]({art.get('url')}) *(Publicado: {art.get('published_at')})*\n"

        md += f"""

---

## 3. BLOQUE B: INTERPRETACIÓN Y SÍNTESIS ANALÍTICA (ASISTIDA POR IA)
*Esta sección presenta hallazgos cualitativos, patrones de encuadre y divergencias identificadas mediante modelos de procesamiento de lenguaje natural.*

{ai_interpretation}

---
*Informe generado automáticamente por Mediatrix - Observatorio de Medios para uso investigativo y académico.*
"""
        return md


report_generator_service = ReportGenerator()
