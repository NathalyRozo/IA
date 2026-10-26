'use client';

import React, { useState } from 'react';

export default function ReportsPage() {
  const [copiedApa, setCopiedApa] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopyApa = () => {
    const apaCitations = `1. El Tiempo. (2026, 22 de octubre). Senado aprueba en primer debate articulado de la reforma laboral. El Tiempo. https://www.eltiempo.com/politica/congreso/reforma-laboral-aprobada-debate
2. El Espectador. (2026, 22 de octubre). Con reparos en el régimen de transición laboral, avanza la reforma en primer debate. El Espectador. https://www.elespectador.com/politica/debate-reforma-laboral-comision-septima/
3. Reuters. (2026, October 22). Colombia labor reform clears committee hurdle amid private sector and rating scrutiny. Reuters LatAm. https://www.reuters.com/world/americas/colombia-labor-reform-vote/
4. RTVC Noticias. (2026, 22 de octubre). Paso histórico en el Congreso hacia la restitución de derechos laborales. Sistema de Medios Públicos. https://rtvcnoticias.com/politica/reforma-laboral-aprobada-primer-debate`;

    navigator.clipboard.writeText(apaCitations);
    setCopiedApa(true);
    setTimeout(() => setCopiedApa(false), 3000);
  };

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 800);
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* 1. EXPORT CONTROL BAR */}
      <section className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-lg">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container shadow-[0_0_12px_rgba(253,228,0,0.8)]"></span>
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
              Centro de Síntesis Editorial
            </span>
            <span className="text-on-surface-variant font-body-sm">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
              Versión Final Certificada
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-extrabold">
            Generador de Informes y Dossier de Cobertura
          </h1>
        </div>

        {/* Actions Group */}
        <div className="flex flex-wrap items-center gap-space-xs">
          <button 
            type="button"
            onClick={handleCopyApa}
            className="inline-flex items-center gap-space-xs px-space-md py-space-sm rounded-full bg-surface-container-high hover:bg-surface-bright text-on-surface hover:text-primary transition-all duration-200 shadow-sm border border-outline-variant/30 font-bold"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary-container">format_quote</span>
            <span className="font-label-md text-label-md uppercase">
              {copiedApa ? '¡Citas Copiadas!' : 'Copiar Citas APA 7'}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-[10px] font-mono">
              v7.0
            </span>
          </button>

          <button 
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-label-md text-label-md uppercase tracking-wider shadow-[0_0_20px_rgba(253,228,0,0.4)] transition-all duration-200 font-extrabold"
          >
            <span className="material-symbols-outlined text-[20px] font-bold">download</span>
            <span>{downloading ? 'Preparando...' : 'Descargar PDF (Dossier Completo)'}</span>
          </button>
        </div>
      </section>

      {/* PRINTABLE / HIGH-FIDELITY DOSSIER DOCUMENT CONTAINER */}
      <article className="w-full bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-space-xl border border-outline-variant/30">
        {/* Header del informe */}
        <header className="w-full bg-surface-container-low p-space-lg lg:p-space-xl flex flex-col gap-space-lg relative overflow-hidden border-b border-outline-variant/30">
          <div className="flex flex-wrap items-center justify-between gap-space-md relative z-10">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-[0_0_12px_rgba(253,228,0,0.5)] font-black">
                <span className="material-symbols-outlined text-[18px]">folder_special</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface uppercase tracking-widest font-mono font-bold">
                ID Expediente: #FQ-2026-0842
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary-fixed font-label-sm text-label-sm uppercase font-semibold">
                Agenda Setting Monitoreada
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-space-xs relative z-10 max-w-4xl">
            <h2 className="font-headline-xl text-headline-xl text-primary font-black tracking-tight leading-snug">
              Informe Metodológico: Encuadres Editoriales en Torno a la Reforma Laboral en Colombia
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Monitoreo analítico de 10 medios de referencia (5 nacionales y 5 internacionales). Muestra total: 142 artículos periodísticos contrastados entre el 15 y el 22 de octubre de 2026.
            </p>
          </div>
        </header>

        {/* CONTENIDO DEL INFORME CON SEPARACIÓN ESTRICTA DEL PRD */}
        <div className="p-space-lg lg:p-space-xl space-y-space-xl">
          {/* ============================================================== */}
          {/* BLOQUE A: EVIDENCIA EMPÍRICA VERIFICABLE */}
          {/* ============================================================== */}
          <section className="flex flex-col gap-space-md">
            <div className="flex items-center gap-space-xs pb-space-xs border-b border-outline-variant/30">
              <span className="w-3 h-3 rounded-full bg-tertiary-container shadow-[0_0_8px_rgba(89,253,197,0.8)]"></span>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Bloque A: Evidencia Empírica Verificable (Datos Duros & Enlaces Originales)
              </h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Este bloque contiene únicamente hechos registrados, frecuencias de citación, titulares originales sin alteración y metadatos comprobables.
            </p>

            <div className="overflow-x-auto rounded-xl border border-outline-variant/30">
              <table className="w-full text-left font-body-sm text-body-sm">
                <thead className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase">
                  <tr>
                    <th className="py-space-sm px-space-md">Medio</th>
                    <th className="py-space-sm px-space-md">Titular Exacto de Portada</th>
                    <th className="py-space-sm px-space-md">Palabras Clave Frecuentes</th>
                    <th className="py-space-sm px-space-md">Enlace de Origen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 bg-surface-container">
                  <tr>
                    <td className="py-space-sm px-space-md font-bold text-primary">El Espectador</td>
                    <td className="py-space-sm px-space-md text-on-surface">“Con reparos en el régimen de transición laboral, avanza la reforma en primer debate”</td>
                    <td className="py-space-sm px-space-md text-secondary">Horas nocturnas (18), Plataformas (12), Formalización (9)</td>
                    <td className="py-space-sm px-space-md">
                      <a href="#" className="text-tertiary-fixed underline font-semibold flex items-center gap-1">
                        Verificar nota <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-space-sm px-space-md font-bold text-primary">Reuters</td>
                    <td className="py-space-sm px-space-md text-on-surface">“Colombia labor reform clears committee hurdle amid private sector and rating scrutiny”</td>
                    <td className="py-space-sm px-space-md text-tertiary-fixed">Sobrecosto (24), ANDI (15), Inflación (8)</td>
                    <td className="py-space-sm px-space-md">
                      <a href="#" className="text-tertiary-fixed underline font-semibold flex items-center gap-1">
                        Verificar nota <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-space-sm px-space-md font-bold text-primary">RTVC Noticias</td>
                    <td className="py-space-sm px-space-md text-on-surface">“Paso histórico en el Congreso hacia la restitución de derechos laborales concurrida por el pueblo”</td>
                    <td className="py-space-sm px-space-md text-primary-fixed">Restitución (21), Dignidad (16), CUT (14)</td>
                    <td className="py-space-sm px-space-md">
                      <a href="#" className="text-tertiary-fixed underline font-semibold flex items-center gap-1">
                        Verificar nota <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ============================================================== */}
          {/* BLOQUE B: INTERPRETACIÓN Y SÍNTESIS ASISTIDA POR IA */}
          {/* ============================================================== */}
          <section className="flex flex-col gap-space-md">
            <div className="flex items-center gap-space-xs pb-space-xs border-b border-outline-variant/30">
              <span className="w-3 h-3 rounded-full bg-secondary-container shadow-[0_0_8px_rgba(255,74,141,0.8)]"></span>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                Bloque B: Interpretación y Síntesis de Patrones Asistida por IA
              </h3>
            </div>

            {/* Aviso metodológico explícito del PRD */}
            <div className="p-space-md rounded-xl bg-secondary-container/10 border border-secondary-container/30 flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">info</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                <strong className="text-secondary">Aviso metodológico:</strong> Las siguientes inferencias de encuadre (<em>framing</em>) son generadas mediante modelos probabilísticos de PLN para asistir el análisis de Victoria León. Deben someterse al criterio crítico humano antes de redactar conclusiones definitivas.
              </p>
            </div>

            {/* Hallazgos y Patrones de Encuadre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              <div className="p-space-lg rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                  Patrón 1: Bipolaridad Discursiva
                </span>
                <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Encuadre de Derechos vs. Encuadre Fiscal
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Existe una divergencia nítida: los medios públicos y tradicionales independientes enfatizan la deuda histórica con los trabajadores diurnos y nocturnos, mientras las agencias económicas internacionales y prensa financiera centran su análisis en el sobrecosto para pymes y el mercado cambiario.
                </p>
              </div>

              <div className="p-space-lg rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-tertiary-fixed uppercase font-bold tracking-wider">
                  Patrón 2: Puntos Ciegos de la Agenda
                </span>
                <h4 className="font-headline-sm text-headline-sm text-primary font-bold">
                  Omisión del Trabajo Informal
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  El 78% de la cobertura analizada se concentró exclusivamente en el sector formal y gremios organizados (ANDI, CUT). El impacto en el 56% de trabajadores en condición de informalidad laboral quedó prácticamente ausente de los titulares de apertura.
                </p>
              </div>
            </div>

            {/* Conclusión para la columna de opinión */}
            <div className="p-space-lg rounded-xl bg-surface-container-high border border-primary-fixed/30 flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm text-primary-fixed uppercase font-bold tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                Recomendación Editorial para Victoria León (Géneros de Opinión)
              </span>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                El contraste evidencia que una columna que aborde <em>la brecha entre la retórica de derechos del legislativo y la realidad del empleo informal no protegido</em> ofrecería una tesis original, no saturada por los encuadres dominantes de los 10 medios analizados.
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
