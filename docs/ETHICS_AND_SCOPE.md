# Marco Ético, Límites de Alcance y Principios Deontológicos

Este documento rige el diseño, la lógica de negocio y las salvaguardas que deben implementarse en el código de la plataforma **Mediatrix**.

## 1. Qué NO hace la plataforma y fundamentos técnicos/deontológicos

### 1.1. No determina automáticamente si una noticia es verdadera o falsa
- **Fundamento**: La aplicación analiza contenidos, compara enfoques y mide patrones de cobertura, pero no realiza verificación periodística exhaustiva (*fact-checking*). Determinar la veracidad de una información exige contrastar fuentes directas sobre el terreno, consultar documentos probatorios y aplicar metodologías forenses.
- **Implementación en el sistema**:
  - En la interfaz de usuario queda prohibida la visualización de etiquetas tipo *"Verdad"*, *"Falso"* o *"Engañoso"*.
  - Los contrastes se etiquetan únicamente como *"Diferencias en el tratamiento informativo"*, *"Enfoque editorial"* o *"Aspectos resaltados/omitidos"*.

### 1.2. No mide directamente la opinión pública
- **Fundamento**: La frecuencia con la que los medios publican sobre un asunto describe la **agenda mediática** (*media agenda*), no lo que piensa la ciudadanía. Confundir la cobertura de prensa con la opinión ciudadana incurre en un error metodológico grave. Para estudiar la opinión pública es imperativo recurrir a encuestas representativas, sondeos u observaciones sociológicas de campo.
- **Implementación en el sistema**:
  - Toda métrica se nombra expresamente como *"Volumen de Cobertura"*, *"Atención Mediática"* o *"Cuota de Cobertura (Share of Voice)"*.
  - Se añade un aviso metodológico en los paneles de análisis y en los informes generados.

### 1.3. No incluye todos los medios ni todo el contenido de Internet
- **Fundamento**: El análisis está delimitado a los 10 medios de referencia seleccionados (5 colombianos y 5 internacionales). La recopilación depende de la disponibilidad técnica y los límites legales de acceso (robots.txt, términos de servicio y paywalls de suscripción).
- **Implementación en el sistema**:
  - Listado explícito y trazable de las 10 fuentes. Si un medio introduce restricciones de acceso a ciertos contenidos completos, el sistema indexa únicamente los titulares, metadatos y resúmenes públicos autorizados.

### 1.4. No reemplaza el criterio del periodista ni del investigador
- **Fundamento**: Los resultados arrojados por los modelos de procesamiento de lenguaje natural son aproximaciones analíticas que requieren supervisión y contrastación humana. El sistema es un asistente heurístico, no un decisor autónomo.
- **Implementación en el sistema**:
  - El sistema incorpora flujos de trabajo orientados a la intervención humana (*Human-in-the-loop*): los informes generados permiten la anotación manual por parte del investigador antes de su exportación final.

### 1.5. No redacta ni reescribe noticias para su publicación comercial
- **Fundamento**: La herramienta no es una fábrica de refritos ni un generador de noticias automatizadas. Su función es estrictamente analítica, investigativa y comparativa.
- **Implementación en el sistema**:
  - El módulo de generación de texto únicamente produce resúmenes analíticos de encuadre, análisis de patrones y síntesis comparativas destinadas a investigación académica y salas de redacción, siempre acompañadas del enlace permanente y atribución a la fuente original.

---

## 2. Principio de Separación Epistemológica en Informes
Todos los informes generados por la plataforma deben mantener una estricta distinción tipográfica y estructural entre:
1. **Datos Empíricos Primarios**: Cifras exactas de artículos, fechas, nombres de medios, citas textuales de titulares y enlaces web de origen.
2. **Interpretaciones y Análisis de IA**: Resúmenes comparativos, etiquetas de enfoque detectadas y explicaciones de patrones.

Esta diferenciación garantiza la integridad académica y la reproducibilidad científica de las investigaciones fundamentadas en la herramienta.
