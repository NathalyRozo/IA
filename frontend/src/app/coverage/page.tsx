'use client';

import React, { useState } from 'react';

export default function CoveragePage() {
  const [selectedTheme, setSelectedTheme] = useState('Medio Ambiente y Transición Energética');
  const [selectedPeriod, setSelectedPeriod] = useState('7 días');
  const [selectedScope, setSelectedScope] = useState<'all' | 'nacional' | 'internacional'>('all');
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const themes = [
    { name: 'Medio Ambiente y Transición Energética', icon: 'eco' },
    { name: 'Política y Reformas Estructurales', icon: 'account_balance' },
    { name: 'Economía, Finanzas y Empleo', icon: 'trending_up' },
    { name: 'Salud y Crisis de Financiamiento', icon: 'vital_signs' },
    { name: 'Conflicto, Paz y Seguridad Regional', icon: 'shield' },
    { name: 'Tecnología y Regulación de IA', icon: 'memory' }
  ];

  const mediaList = [
    {
      name: 'El Tiempo',
      abbr: 'ET',
      scope: 'nacional',
      scopeLabel: 'Nacional',
      desc: 'Prensa tradicional líder • 96 publicaciones',
      change: '+6% vs ant.',
      percent: 28,
      barColor: 'bg-primary-fixed',
      barShadow: 'shadow-[0_0_12px_rgba(253,228,0,0.5)]'
    },
    {
      name: 'El Espectador',
      abbr: 'EE',
      scope: 'nacional',
      scopeLabel: 'Nacional',
      desc: 'Línea investigativa y ambiental • 75 publicaciones',
      change: '+3% vs ant.',
      percent: 22,
      barColor: 'bg-secondary-container',
      barShadow: 'shadow-[0_0_12px_rgba(255,74,141,0.5)]'
    },
    {
      name: 'Reuters América Latina',
      abbr: 'RE',
      scope: 'internacional',
      scopeLabel: 'Internacional',
      desc: 'Agencia global especializada en transición energética • 55 publicaciones',
      change: '+8% vs ant.',
      percent: 16,
      barColor: 'bg-tertiary-container',
      barShadow: 'shadow-[0_0_12px_rgba(89,253,197,0.5)]'
    },
    {
      name: 'RTVC Noticias',
      abbr: 'RT',
      scope: 'nacional',
      scopeLabel: 'Nacional',
      desc: 'Sistema público nacional • 48 publicaciones',
      change: '+12% vs ant.',
      percent: 14,
      barColor: 'bg-primary-fixed-dim',
      barShadow: 'shadow-[0_0_12px_rgba(222,200,0,0.4)]'
    },
    {
      name: 'The New York Times',
      abbr: 'NYT',
      scope: 'internacional',
      scopeLabel: 'Internacional',
      desc: 'Cobertura climática hemisférica • 37 publicaciones',
      change: '-2% vs ant.',
      percent: 11,
      barColor: 'bg-[#59a6ff]',
      barShadow: 'shadow-[0_0_12px_rgba(0,102,255,0.4)]'
    },
    {
      name: 'El Colombiano',
      abbr: 'EC',
      scope: 'nacional',
      scopeLabel: 'Nacional',
      desc: 'Enfoque empresarial y regional • 31 publicaciones',
      change: '+1% vs ant.',
      percent: 9,
      barColor: 'bg-primary-container',
      barShadow: 'shadow-[0_0_10px_rgba(253,228,0,0.3)]'
    }
  ];

  const filteredMedia = mediaList.filter(m => {
    if (selectedScope === 'all') return true;
    return m.scope === selectedScope;
  });

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Sub-header Meta Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-primary-container shadow-[0_0_10px_rgba(253,228,0,0.8)]"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary-fixed font-bold">
              Radar de Discurso Mediático
            </span>
            <span className="text-outline-variant font-label-sm text-label-sm">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Corte en tiempo real
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">
            Medición de Cobertura
          </h1>
        </div>

        {/* Live Counter Pill */}
        <div className="flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container-high shadow-sm self-start md:self-auto border border-outline-variant/30">
          <div className="w-2.5 h-2.5 rounded-full bg-tertiary-container shadow-[0_0_8px_rgba(89,253,197,0.8)] animate-pulse"></div>
          <span className="font-label-md text-label-md text-on-surface uppercase tracking-wide">
            <strong className="text-tertiary-container font-headline-sm text-headline-sm mr-1">342</strong> piezas periodísticas analizadas
          </span>
        </div>
      </div>

      {/* Panel 1: Controles y Filtros Dinámicos */}
      <section className="bg-surface-container-low rounded-2xl p-space-md md:p-space-lg shadow-md mb-space-lg border border-outline-variant/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-center">
          {/* Theme Dropdown */}
          <div className="lg:col-span-5 relative">
            <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1.5 pl-1 font-bold">
              Eje temático activo
            </label>
            <button
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="w-full bg-surface-container-high hover:bg-surface-variant text-left px-space-md py-space-sm rounded-full flex items-center justify-between text-on-surface transition-all border border-outline-variant/20"
              type="button"
            >
              <div className="flex items-center gap-space-sm truncate">
                <span className="material-symbols-outlined text-primary-fixed text-[20px]">
                  {themes.find(t => t.name === selectedTheme)?.icon || 'topic'}
                </span>
                <span className="font-headline-sm text-headline-sm truncate text-primary font-bold">
                  {selectedTheme}
                </span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-[20px] ml-2 shrink-0">
                {isThemeOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isThemeOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-high rounded-xl border border-outline-variant/40 shadow-2xl z-30 overflow-hidden py-1">
                {themes.map(t => (
                  <button
                    key={t.name}
                    onClick={() => {
                      setSelectedTheme(t.name);
                      setIsThemeOpen(false);
                    }}
                    className={`w-full px-space-md py-space-sm text-left flex items-center gap-2 hover:bg-surface-bright transition-colors font-body-sm text-body-sm ${
                      selectedTheme === t.name ? 'text-primary-fixed font-bold bg-surface-variant' : 'text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Temporal Window Filter */}
          <div className="lg:col-span-4">
            <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1.5 pl-1 font-bold">
              Ventana temporal
            </label>
            <div className="inline-flex w-full p-1 bg-surface-container-high rounded-full justify-between items-center text-center border border-outline-variant/20">
              {['24h', '7 días', '30 días', 'Mes en curso'].map(period => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`period-btn px-space-sm py-1.5 rounded-full font-label-sm text-label-sm uppercase transition-all flex-1 truncate ${
                    selectedPeriod === period
                      ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_12px_rgba(253,228,0,0.35)]'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Scope Segment */}
          <div className="lg:col-span-3">
            <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1.5 pl-1 font-bold">
              Filtrado editorial
            </label>
            <div className="inline-flex w-full p-1 bg-surface-container-high rounded-full justify-between items-center text-center border border-outline-variant/20">
              <button
                onClick={() => setSelectedScope('all')}
                className={`scope-btn px-space-xs py-1.5 rounded-full font-label-sm text-label-sm uppercase transition-all flex-1 font-bold ${
                  selectedScope === 'all'
                    ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(253,228,0,0.35)]'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Todos (10)
              </button>
              <button
                onClick={() => setSelectedScope('nacional')}
                className={`scope-btn px-space-xs py-1.5 rounded-full font-label-sm text-label-sm uppercase transition-all flex-1 font-bold ${
                  selectedScope === 'nacional'
                    ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(253,228,0,0.35)]'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Nac. (5)
              </button>
              <button
                onClick={() => setSelectedScope('internacional')}
                className={`scope-btn px-space-xs py-1.5 rounded-full font-label-sm text-label-sm uppercase transition-all flex-1 font-bold ${
                  selectedScope === 'internacional'
                    ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(253,228,0,0.35)]'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Int. (5)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout Grid: 12 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column (8 cols): Comparador de Cobertura Mediática */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          <div className="flex items-center justify-between px-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary-fixed text-[22px]">bar_chart</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Cuota de Atención por Medio (Share of Voice)
              </h2>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Ordenado por % volumen
            </span>
          </div>

          {/* Media List Cards */}
          <div className="flex flex-col gap-space-sm">
            {filteredMedia.map(m => (
              <article 
                key={m.name}
                className="media-row group bg-surface-container-low hover:bg-surface-container transition-all duration-300 rounded-2xl p-space-md shadow-sm border border-outline-variant/30"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-headline-sm font-bold shadow-sm border border-outline-variant/20">
                      {m.abbr}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                          {m.name}
                        </h3>
                        <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant uppercase font-semibold">
                          {m.scopeLabel}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {m.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-md self-end sm:self-auto">
                    <span className="inline-flex items-center gap-1 font-label-md text-label-md px-space-sm py-0.5 rounded-full bg-tertiary-container/10 text-tertiary-fixed shadow-[0_0_8px_rgba(89,253,197,0.2)] font-bold">
                      <span className="material-symbols-outlined text-[14px]">arrow_upward</span> {m.change}
                    </span>
                    <span className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">
                      {m.percent}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar Graphic */}
                <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden p-0.5">
                  <div 
                    className={`h-full rounded-full ${m.barColor} ${m.barShadow} transition-all duration-700 ease-out`}
                    style={{ width: `${m.percent}%` }}
                  ></div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Column (4 cols): Radar Semántico y Métricas Rápidas */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* Widget 1: Balance Territorial */}
          <div className="bg-surface-container-low rounded-2xl p-space-lg shadow-md border border-outline-variant/30 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface uppercase font-bold">
                Balance Territorial
              </span>
              <span className="material-symbols-outlined text-primary-fixed text-[20px]">public</span>
            </div>

            <div className="flex items-center justify-between text-body-sm text-body-sm">
              <span className="text-primary font-bold">Nacional: 64%</span>
              <span className="text-tertiary-fixed font-bold">Internacional: 36%</span>
            </div>

            <div className="w-full h-3 rounded-full bg-surface-container-highest flex overflow-hidden">
              <div className="h-full bg-primary-container rounded-l-full w-[64%] shadow-[0_0_8px_rgba(253,228,0,0.5)]"></div>
              <div className="h-full bg-tertiary-container rounded-r-full w-[36%] shadow-[0_0_8px_rgba(89,253,197,0.5)]"></div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              La prensa nacional lidera el volumen con coberturas enfocadas en impacto tarifario regional, mientras que las agencias internacionales centran la narrativa en compromisos de descarbonización.
            </p>
          </div>

          {/* Widget 2: Conceptos más reiterados */}
          <div className="bg-surface-container-low rounded-2xl p-space-lg shadow-md border border-outline-variant/30 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface uppercase font-bold">
                Conceptos Clave de la Agenda
              </span>
              <span className="material-symbols-outlined text-secondary-container text-[20px]">label</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { tag: 'Transición energética', weight: 'bg-primary-container text-on-primary-container font-bold' },
                { tag: 'Opción tarifaria', weight: 'bg-surface-container-high text-primary-fixed' },
                { tag: 'Ecopetrol & contratos', weight: 'bg-secondary-container/20 text-secondary font-bold' },
                { tag: 'Descarbonización', weight: 'bg-tertiary-container/20 text-tertiary-fixed font-bold' },
                { tag: 'Amazonía & COP16', weight: 'bg-surface-container-high text-on-surface' },
                { tag: 'Regalías mineras', weight: 'bg-surface-container-high text-on-surface-variant' }
              ].map(k => (
                <span 
                  key={k.tag}
                  className={`px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider ${k.weight}`}
                >
                  {k.tag}
                </span>
              ))}
            </div>
          </div>

          {/* Widget 3: Puntos Ciegos / Alerta de omisión */}
          <div className="bg-surface-container-low rounded-2xl p-space-lg shadow-md border border-secondary-container/30 flex flex-col gap-space-xs">
            <div className="flex items-center gap-2 text-secondary font-bold">
              <span className="material-symbols-outlined text-[20px]">warning</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">
                Alerta de Omisión Editorial
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mt-1">
              <strong>2 de los 10 medios</strong> monitoreados omitieron en sus portadas la resolución del Consejo de Estado sobre suspensión de licencias en páramos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
