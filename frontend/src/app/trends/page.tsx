'use client';

import React, { useState } from 'react';

export default function TrendsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7 Días');

  const trendCards = [
    {
      topic: 'Reforma Laboral y Régimen Nocturno',
      category: 'Política Nacional',
      status: 'En Auge',
      statusColor: 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(253,228,0,0.5)]',
      statusIcon: 'trending_up',
      velocity: '18.4 notas/día',
      acceleration: '+142%',
      accelColor: 'text-tertiary-fixed',
      sourcesCoverage: '10 de 10 medios',
      summary: 'Máxima aceleración tras la votación maratónica en Comisión Séptima. Concentra el 38% del debate editorial matutino.'
    },
    {
      topic: 'Inteligencia Artificial y Regulación de Medios',
      category: 'Tecnología Global',
      status: 'En Auge',
      statusColor: 'bg-tertiary-container text-on-tertiary-container shadow-[0_0_12px_rgba(89,253,197,0.4)]',
      statusIcon: 'bolt',
      velocity: '9.2 notas/día',
      acceleration: '+86%',
      accelColor: 'text-tertiary-fixed',
      sourcesCoverage: '7 de 10 medios',
      summary: 'Tracción impulsada por las directivas internacionales de etiquetado de contenidos sintéticos y derechos de autor en redacciones.'
    },
    {
      topic: 'Tasas de Interés y Dólar en Colombia',
      category: 'Economía & Mercados',
      status: 'Estable',
      statusColor: 'bg-surface-container-high text-on-surface border border-outline-variant/40',
      statusIcon: 'horizontal_rule',
      velocity: '12.1 notas/día',
      acceleration: '+4%',
      accelColor: 'text-on-surface-variant',
      sourcesCoverage: '9 de 10 medios',
      summary: 'Cobertura sostenida sin sobresaltos. Los medios mantienen columnas de análisis cambiario y proyecciones trimestrales.'
    },
    {
      topic: 'Precios de Combustibles y Diésel',
      category: 'Economía Regional',
      status: 'En Declive',
      statusColor: 'bg-secondary-container/30 text-secondary border border-secondary-container/40',
      statusIcon: 'trending_down',
      velocity: '3.6 notas/día',
      acceleration: '-38%',
      accelColor: 'text-secondary',
      sourcesCoverage: '4 de 10 medios',
      summary: 'Pérdida paulatina de interés mediático tras el levantamiento de los bloqueos de transportadores hace dos semanas.'
    }
  ];

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Sub-header Bar */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-md mb-space-lg">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="px-3 py-1 rounded-full bg-primary-container/20 text-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
              Módulo Radar v2.4
            </span>
            <span className="text-on-surface-variant text-label-sm font-label-sm">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
              Indexación en Tiempo Real
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary tracking-tight font-extrabold m-0">
            Detección de Tendencias
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Algoritmos de aceleración informativa, dispersión semántica y cambios de encuadre en los 10 medios monitoreados.
          </p>
        </div>

        {/* Temporal Toggles */}
        <div className="flex flex-wrap items-center gap-space-sm bg-surface-container-low p-1.5 rounded-full shadow-sm border border-outline-variant/30">
          <div className="inline-flex items-center gap-1 bg-surface-container px-1 py-1 rounded-full">
            {['Hoy', '7 Días', '30 Días', 'Trimestre'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`temporal-pill px-4 py-1.5 rounded-full font-label-md text-label-md uppercase transition-all duration-200 ${
                  selectedPeriod === p
                    ? 'bg-primary-container text-on-primary-container shadow-[0_0_16px_rgba(253,228,0,0.35)] font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Analytic Widget: Evolution of Themes (Chart Board) */}
      <div className="w-full bg-surface-container-low rounded-2xl p-space-lg sm:p-space-xl relative overflow-hidden shadow-xl mb-space-xl border border-outline-variant/30">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-container/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-secondary-container/5 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md mb-space-lg relative z-10">
          <div>
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
              Dinámica Temporal de la Agenda
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-1">
              Velocidad & Aceleración de Temas Clave
            </h2>
          </div>

          <div className="flex items-center gap-4 text-label-sm text-label-sm font-semibold">
            <span className="flex items-center gap-1.5 text-primary-fixed">
              <span className="w-3 h-3 rounded-full bg-primary-container"></span>
              Reforma Laboral
            </span>
            <span className="flex items-center gap-1.5 text-tertiary-fixed">
              <span className="w-3 h-3 rounded-full bg-tertiary-container"></span>
              IA & Regulación
            </span>
            <span className="flex items-center gap-1.5 text-secondary">
              <span className="w-3 h-3 rounded-full bg-secondary-container"></span>
              Combustibles
            </span>
          </div>
        </div>

        {/* Visual Simulated SVG Chart */}
        <div className="relative w-full h-64 z-10 flex items-end pt-4 pb-2">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
            {/* Grid lines */}
            <line x1="0" y1="50" x2="800" y2="50" stroke="#262a35" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="#262a35" strokeDasharray="4 4" />
            <line x1="0" y1="150" x2="800" y2="150" stroke="#262a35" strokeDasharray="4 4" />

            {/* Line 1: Reforma Laboral (Yellow #fde400) - Exponential Rise */}
            <path
              d="M 0,160 Q 200,150 400,110 T 800,20"
              fill="none"
              stroke="#fde400"
              strokeWidth="4"
              className="drop-shadow-[0_0_8px_rgba(253,228,0,0.6)]"
            />
            {/* Line 2: IA & Regulación (Cyan #59fdc5) - Rising */}
            <path
              d="M 0,180 Q 250,170 500,120 T 800,60"
              fill="none"
              stroke="#59fdc5"
              strokeWidth="3"
              className="drop-shadow-[0_0_8px_rgba(89,253,197,0.5)]"
            />
            {/* Line 3: Combustibles (Magenta #ff4a8d) - Falling */}
            <path
              d="M 0,40 Q 250,70 500,130 T 800,180"
              fill="none"
              stroke="#ff4a8d"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              className="drop-shadow-[0_0_8px_rgba(255,74,141,0.4)]"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase pt-4 border-t border-outline-variant/20 z-10 relative">
          <span>Hace 7 días</span>
          <span>Hace 5 días</span>
          <span>Hace 3 días</span>
          <span>Ayer</span>
          <span className="text-primary font-bold">Hoy (Pico de Cobertura)</span>
        </div>
      </div>

      {/* Grid of Trend Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {trendCards.map(t => (
          <div 
            key={t.topic}
            className="p-space-lg rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col justify-between gap-space-md shadow-md hover:border-outline transition-all"
          >
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                  {t.category}
                </span>
                <span className={`px-space-md py-1 rounded-full font-label-sm text-label-sm uppercase font-bold flex items-center gap-1 ${t.statusColor}`}>
                  <span className="material-symbols-outlined text-[16px]">{t.statusIcon}</span>
                  {t.status, t.status}
                </span>
              </div>

              <h3 className="font-headline-sm text-headline-sm text-primary font-bold leading-snug">
                {t.topic}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {t.summary}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-space-sm pt-space-sm border-t border-outline-variant/20">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Velocidad</span>
                <span className="font-label-md text-label-md font-bold text-on-surface">{t.velocity}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Aceleración</span>
                <span className={`font-label-md text-label-md font-bold ${t.accelColor}`}>{t.acceleration}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Presencia</span>
                <span className="font-label-md text-label-md font-bold text-on-surface">{t.sourcesCoverage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
