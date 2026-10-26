'use client';

import React, { useState } from 'react';

export default function ContrastPage() {
  const [activeFraming, setActiveFraming] = useState('all');

  const framingPills = [
    { id: 'all', label: 'Todos los enfoques' },
    { id: 'fiscal', label: 'Fiscal / Mercados' },
    { id: 'social', label: 'Social / Laboral' },
    { id: 'politico', label: 'Político / Gobierno' },
  ];

  const columns = [
    {
      id: 'espectador',
      source: 'El Espectador',
      scope: 'Prensa Nacional • Colombia',
      abbr: 'EE',
      framingType: 'social',
      framingLabel: 'Enfoque Social / Derechos',
      accentColor: 'text-secondary-fixed',
      badgeBg: 'bg-secondary-container text-on-secondary-container shadow-[0_0_10px_rgba(255,74,141,0.4)]',
      borderTop: 'bg-secondary-container',
      headline: '“Con reparos en el régimen de transición laboral, avanza la reforma en primer debate”',
      lead: 'La célula legislativa destrabó el articulado nuclear tras 14 horas de negociación, priorizando la jornada nocturna anticipada y contratos a término indefinido como norma general.',
      toneLabel: 'Garantista Crítico',
      tonePercent: 68,
      toneBarColor: 'bg-secondary-container',
      emphasisText: 'Protección prioritaria a trabajadores de plataformas digitales, formalización agropecuaria y recargo nocturno a partir de las 7:00 PM.',
      omissionText: 'Minimiza la cuantificación del impacto en estructura de costos de micro y pequeñas empresas frente al incremento en la sobretasa dominical.',
      link: '#'
    },
    {
      id: 'reuters',
      source: 'Reuters LatAm',
      scope: 'Agencia Global • Londres / Bogotá',
      abbr: 'RE',
      framingType: 'fiscal',
      framingLabel: 'Económico / Mercados',
      accentColor: 'text-tertiary-fixed',
      badgeBg: 'bg-surface-container-high text-tertiary-fixed border border-tertiary-fixed/30',
      borderTop: 'bg-tertiary-fixed-dim',
      headline: '“Colombia labor reform clears committee hurdle amid private sector and rating scrutiny”',
      lead: 'Las agencias crediticias y bancos de inversión advierten sobre presiones indexadas en costos operativos, mientras el peso colombiano registró volatilidad marginal durante la votación.',
      toneLabel: 'Riesgo Financiero / Fiscal',
      tonePercent: 74,
      toneBarColor: 'bg-tertiary-fixed-dim',
      emphasisText: 'Estimaciones de la ANDI y Fenalco que alertan sobre un posible sobrecosto laboral entre el 11.8% y el 14% en nómina.',
      omissionText: 'Omite testimonios de centrales obreras (CUT, CTC) y datos sobre precarización histórica del trabajo nocturno desde la reforma del 2002.',
      link: '#'
    },
    {
      id: 'rtvc',
      source: 'RTVC Noticias',
      scope: 'Sistema Público Nacional • Colombia',
      abbr: 'RT',
      framingType: 'politico',
      framingLabel: 'Político / Institucional',
      accentColor: 'text-primary-fixed',
      badgeBg: 'bg-primary-container text-on-primary-container shadow-[0_0_10px_rgba(253,228,0,0.4)]',
      borderTop: 'bg-primary-container',
      headline: '“Paso histórico en el Congreso hacia la restitución de derechos laborales del pueblo trabajador”',
      lead: 'Con masiva movilización ciudadana en las barras del Capitolio, se aprobó el núcleo sustantivo que devuelve la dignidad a los trabajadores diurnos y nocturnos.',
      toneLabel: 'Reivindicatorio Institucional',
      tonePercent: 82,
      toneBarColor: 'bg-primary-container',
      emphasisText: 'Devolución de conquistas laborales arrebatadas hace más de dos décadas, equidad salarial de género y blindaje a la huelga.',
      omissionText: 'Omite objeciones y reparos emitidos por el Banco de la República sobre riesgo de desincentivo al empleo juvenil y formalización.',
      link: '#'
    }
  ];

  const filteredColumns = columns.filter(c => {
    if (activeFraming === 'all') return true;
    return c.framingType === activeFraming;
  });

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Breadcrumbs & Meta Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-md">
        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
          <span className="hover:text-on-surface cursor-pointer transition-colors font-bold">
            Comparador de Medios
          </span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary-fixed font-bold">Acontecimiento Crítico</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary-container mx-space-xs animate-pulse"></span>
          <span className="text-secondary-fixed font-semibold tracking-normal">En vivo</span>
        </div>

        <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-1.5 rounded-full shadow-sm w-fit border border-outline-variant/30">
          <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">sync</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Actualizado hace 15 minutos • <strong className="text-on-surface">48 artículos vinculados</strong>
          </span>
        </div>
      </div>

      {/* Main Headline Block */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-space-lg bg-surface-container-low p-space-lg rounded-2xl shadow-sm relative overflow-hidden border border-outline-variant/30">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-container/5 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col gap-space-xs max-w-4xl z-10">
          <div className="flex flex-wrap items-center gap-space-xs mb-1">
            <span className="px-space-md py-1 rounded-full bg-surface-container-high text-primary-fixed font-label-sm text-label-sm uppercase tracking-wider shadow-sm flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_rgba(253,228,0,0.8)]"></span>
              10 medios analizados en simultáneo
            </span>
            <span className="px-space-md py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Congreso de la República • Comisión Séptima
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight">
            Acontecimiento: Reforma Laboral y Régimen de Contratación Nocturna en el Congreso
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Descomposición analítica de encuadres mediáticos (<em>framing</em>), sesgos léxicos y divergencias de cobertura editorial entre prensa corporativa, pública e internacional.
          </p>
        </div>

        {/* Framing Filter Pills */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-space-xs z-10 bg-surface-container-high p-1.5 rounded-full border border-outline-variant/30">
          {framingPills.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveFraming(p.id)}
              className={`filter-pill px-space-md py-space-xs rounded-full font-label-md text-label-md uppercase transition-all ${
                activeFraming === p.id
                  ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(253,228,0,0.35)] font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side 3-Column Comparative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg mb-space-xl">
        {filteredColumns.map(col => (
          <article 
            key={col.id}
            className="flex flex-col justify-between bg-surface-container-low rounded-2xl p-space-lg shadow-md transition-all duration-300 hover:shadow-2xl relative overflow-hidden group border border-outline-variant/30"
          >
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${col.borderTop}`}></div>

            <div className="flex flex-col gap-space-md">
              {/* Source Header & Framing Badge */}
              <div className="flex items-start justify-between gap-space-sm pt-space-xs">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold font-headline-sm text-[16px] shadow-sm border border-outline-variant/20">
                    {col.abbr}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
                      {col.source}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                      {col.scope}
                    </span>
                  </div>
                </div>

                <span className={`px-space-md py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-bold ${col.badgeBg}`}>
                  {col.framingLabel}
                </span>
              </div>

              {/* Headline & Editorial Lead */}
              <div className="flex flex-col gap-space-xs">
                <span className={`font-label-sm text-label-sm uppercase tracking-wider font-bold ${col.accentColor}`}>
                  Titular de portada
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-extrabold leading-snug group-hover:text-primary transition-colors">
                  {col.headline}
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {col.lead}
                </p>
              </div>

              {/* Media Sentiment & Bias Strip */}
              <div className="bg-surface-container-high rounded-xl p-space-sm flex flex-col gap-1.5 border border-outline-variant/20">
                <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm">
                  <span>Tono Interpretativo</span>
                  <span className={`font-semibold ${col.accentColor}`}>{col.toneLabel} ({col.tonePercent}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container flex overflow-hidden">
                  <div className={`${col.toneBarColor} h-full`} style={{ width: `${col.tonePercent}%` }}></div>
                  <div className="bg-surface-bright h-full flex-1"></div>
                </div>
              </div>

              {/* Analytical Highlights Box */}
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <span className="font-label-md text-label-md text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <span className={`material-symbols-outlined text-[16px] ${col.accentColor}`}>fact_check</span>
                  Deconstrucción de Puntos Clave
                </span>

                <div className="p-space-md rounded-xl bg-surface-container-highest/60 flex flex-col gap-space-xs border border-outline-variant/20">
                  <div className={`flex items-center gap-space-xs font-label-sm text-label-sm uppercase font-bold ${col.accentColor}`}>
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Énfasis Declarado
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                    {col.emphasisText}
                  </p>
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-highest/30 flex flex-col gap-space-xs border border-outline-variant/10">
                  <div className="flex items-center gap-space-xs text-outline font-label-sm text-label-sm uppercase font-bold">
                    <span className="material-symbols-outlined text-[16px]">visibility_off</span>
                    Dimensión Omitida / Marginal
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {col.omissionText}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-space-lg flex items-center justify-between gap-space-sm border-t border-outline-variant/20 mt-space-md">
              <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">verified</span>
                Fuente Monitoreada
              </div>
              <button 
                type="button"
                className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high text-on-surface hover:bg-primary-container hover:text-on-primary-container font-label-md text-label-md uppercase transition-all shadow-sm font-bold"
              >
                <span>Ver fuente</span>
                <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Lexical Divergence Matrix */}
      <section className="bg-surface-container-low rounded-2xl p-space-lg shadow-md border border-outline-variant/30">
        <div className="flex items-center justify-between mb-space-md">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary-fixed text-[22px]">spellcheck</span>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
              Matriz de Divergencia Léxica (Sesgos en la Titulación)
            </h3>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
            Extracción PLN Comparada
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead>
              <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-sm text-label-sm uppercase">
                <th className="py-space-sm pr-space-md">Eje Conceptual</th>
                <th className="py-space-sm px-space-md text-secondary">El Espectador</th>
                <th className="py-space-sm px-space-md text-tertiary-fixed">Reuters LatAm</th>
                <th className="py-space-sm pl-space-md text-primary-fixed">RTVC Noticias</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              <tr>
                <td className="py-space-sm pr-space-md font-bold text-on-surface">Jornada y Recargos</td>
                <td className="py-space-sm px-space-md text-on-surface">“Recuperación de horas nocturnas”</td>
                <td className="py-space-sm px-space-md text-on-surface">“Sobrecosto en nómina nocturna”</td>
                <td className="py-space-sm pl-space-md text-on-surface">“Restitución histórica al pueblo”</td>
              </tr>
              <tr>
                <td className="py-space-sm pr-space-md font-bold text-on-surface">Tipo de Contratación</td>
                <td className="py-space-sm px-space-md text-on-surface">“Estabilidad y contratos indefinidos”</td>
                <td className="py-space-sm px-space-md text-on-surface">“Rigidez en el régimen laboral”</td>
                <td className="py-space-sm pl-space-md text-on-surface">“Fin definitivo a la precarización”</td>
              </tr>
              <tr>
                <td className="py-space-sm pr-space-md font-bold text-on-surface">Impacto Económico</td>
                <td className="py-space-sm px-space-md text-on-surface">“Concertación y balance productivo”</td>
                <td className="py-space-sm px-space-md text-on-surface">“Presión inflacionaria y rating crediticio”</td>
                <td className="py-space-sm pl-space-md text-on-surface">“Distribución equitativa de riqueza”</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
