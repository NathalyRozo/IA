# Product Requirements Document (PRD) - FOQUÉ
## Observatorio de Cobertura y Agenda Mediática

---

### 1. Problema
Los comunicadores sociales en formación o que inician su ejercicio profesional (prácticas o primer empleo) deben decidir a diario qué temas merecen atención, es decir, construir una agenda informativa (*agenda setting*). Para hacerlo tienen que consultar uno por uno muchos medios digitales, agencias y portales de Colombia y del mundo, y contrastar publicaciones. Ese proceso consume mucho tiempo, dificulta detectar a tiempo los temas importantes y deja poco espacio para investigar, entrevistar fuentes y producir contenido propio.

---

### 2. Usuario Arquetipo (User Persona)
**Victoria León:** Estudiante de cuarto semestre de Comunicación Social.  
En su clase de *Géneros de Opinión* debe escribir cada semana una columna sobre el tema más relevante. Para elegirlo necesita ver qué temas reciben más cobertura y cómo presenta cada medio un mismo hecho, pero revisar cada medio por separado le toma demasiado tiempo y no le deja ver patrones.  
*Caso de uso:* Usaría la aplicación al iniciar la semana, antes de escribir, para elegir el tema de su columna con argumentos sólidos y contrastados.

---

### 3. Las Funciones Principales

1. **Recopilar y clasificar noticias:**
   - Reúne a diario las noticias de diez medios:
     - **Nacionales (Colombia):** El Espectador, RTVC Noticias, El Tiempo, El Heraldo, El Colombiano.
     - **Internacionales:** Reuters, BBC News (Mundo), Associated Press (AP), Agence France-Presse (AFP), The New York Times.
   - Las organiza por tema, fecha y acontecimiento mediante procesamiento de lenguaje natural (PLN).

2. **Medir la cobertura:**
   - Cuenta cuántas publicaciones recibe cada tema en un periodo elegido (24h, 7 días, 30 días, mes en curso).
   - Lo muestra de forma visual e interactiva en gráficos de cuota de atención (*Share of Voice*).

3. **Contrastar un acontecimiento entre medios:**
   - Muestra los titulares lado a lado (*side-by-side*).
   - Resume qué destaca cada medio y con qué enfoque narrativo (*framing*), sin juzgar su veracidad.
   - Identifica aspectos destacados y omisiones editoriales.

4. **Mostrar tendencias:**
   - Presenta un ranking y gráficos de cómo cambia la frecuencia de cada tema en el tiempo (en auge / sube, en declive / baja, o estable / se mantiene).
   - Monitorea la velocidad y aceleración de los temas.

5. **Generar un informe:**
   - Exporta resultados, gráficos y enlaces a las noticias originales.
   - Aplica una separación metodológica estricta:
     - **Bloque A:** Datos empíricos verificables (tablas, frecuencias, citas en formato APA 7, enlaces directos).
     - **Bloque B:** Interpretaciones y síntesis de patrones asistida por IA.

---

### 4. Qué NO Hace (Límites de Alcance y Principios Éticos)

- ❌ **No determina si una noticia es verdadera o falsa:** Verificar hechos exige contrastar fuentes con métodos propios del periodismo forense.
- ❌ **No mide la opinión pública:** Que los medios publiquen mucho sobre un tema no demuestra lo que piensa la gente; para ello harían falta encuestas o estudios de audiencia rigurosos.
- ❌ **No incluye todos los medios ni todas las noticias de internet:** Se limita estrictamente a los diez medios seleccionados para que la recopilación sea estable y legalmente accesible.
- ❌ **No reemplaza el criterio del periodista:** La IA debe revisarse antes de sacar conclusiones; es una herramienta de apoyo analítico (*Human-in-the-loop*), no un sustituto.
- ❌ **No redacta ni reescribe noticias:** Solo resume enfoques para comparar; no produce noticias sintéticas ni altera los textos originales.
