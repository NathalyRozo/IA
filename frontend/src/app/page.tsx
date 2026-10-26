'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [activeTopic, setActiveTopic] = useState('all');
  const [activeTerritory, setActiveTerritory] = useState<'nacional' | 'internacional'>('nacional');

  const topics = [
    { id: 'all', label: 'Todos los temas', dot: 'bg-on-primary-container' },
    { id: 'politica', label: 'Política', dot: 'bg-primary-container' },
    { id: 'economia', label: 'Economía', dot: 'bg-tertiary-container' },
    { id: 'salud', label: 'Salud', dot: 'bg-secondary-container' },
    { id: 'deportes', label: 'Deportes', dot: 'bg-[#ff6b00]' },
    { id: 'tecnologia', label: 'Tecnología', dot: 'bg-[#0066ff]' },
  ];

  const articles = [
    {
      id: 1,
      category: 'economia',
      categoryLabel: 'Economía',
      categoryColor: 'text-tertiary-fixed',
      categoryDot: 'bg-tertiary-container',
      sources: ['EE', 'RE'],
      sourceName: 'Espectador + Reuters',
      badge: '+4.2% Cobertura',
      badgeClass: 'bg-tertiary-container text-on-tertiary-container',
      time: 'Hace 35 min',
      title: 'Dólar baja de la barrera de los $3.900 tras decisiones de tasas del Banco de la República',
      description: 'La moneda estadounidense toca mínimos trimestrales. Analistas destacan la contención inflacionaria y el influjo de capital extranjero en bonos locales.',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
      viewsCount: '5 perspectivas',
      viewsIcon: 'visibility',
      hoverBorder: 'group-hover:border-tertiary-container/40',
      accentColor: 'text-tertiary-fixed',
      territory: 'nacional'
    },
    {
      id: 2,
      category: 'salud',
      categoryLabel: 'Salud',
      categoryColor: 'text-secondary',
      categoryDot: 'bg-secondary-container',
      sources: ['ET', 'RT', 'EH'],
      sourceName: '3 Redacciones',
      badge: 'Tensión Alta',
      badgeClass: 'bg-secondary-container text-on-secondary shadow-[0_0_8px_rgba(255,74,141,0.3)]',
      time: 'Hace 1h',
      title: 'Crisis de financiamiento en el sistema de salud: EPS solicitan mesas técnicas de emergencia',
      description: 'Gremios aseguradores afirman insuficiencia en el cálculo de la UPC, mientras el Ministerio de Salud defiende los giros directos ejecutados.',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
      viewsCount: 'Divergencia crítica',
      viewsIcon: 'compare_arrows',
      hoverBorder: 'group-hover:border-secondary-container/40',
      accentColor: 'text-secondary',
      territory: 'nacional'
    },
    {
      id: 3,
      category: 'tecnologia',
      categoryLabel: 'Tecnología',
      categoryColor: 'text-[#59a6ff]',
      categoryDot: 'bg-[#0066ff]',
      sources: ['BBC', 'NYT', 'AFP'],
      sourceName: 'Internacional',
      badge: 'Debate Global',
      badgeClass: 'bg-[#0066ff]/20 text-[#59a6ff]',
      time: 'Hace 2h',
      title: 'IA y regulación algorítmica: Cumbre global debate leyes de transparencia en medios',
      description: 'Plataformas y líderes jurídicos concilian estándares de etiquetado para contenidos sintéticos y protección de derechos periodísticos.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      viewsCount: '3 agendas divergentes',
      viewsIcon: 'language',
      hoverBorder: 'group-hover:border-[#0066ff]/40',
      accentColor: 'text-[#59a6ff]',
      territory: 'internacional'
    },
    {
      id: 4,
      category: 'politica',
      categoryLabel: 'Energía Regional',
      categoryColor: 'text-primary-fixed-dim',
      categoryDot: 'bg-primary-container',
      sources: ['EH', 'EC', 'CC'],
      sourceName: 'Caribe & Antioquia',
      badge: 'Consenso 78%',
      badgeClass: 'bg-primary-container text-on-primary-container',
      time: 'Hace 2h 45m',
      title: 'Tarifas de energía en el Caribe: Gobierno y distribuidoras firman acuerdo tarifario',
      description: 'Pacto estipula una reducción paulatina del costo por kilovatio a través de la titularización de la opción tarifaria.',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
      viewsCount: 'Impacto regional',
      viewsIcon: 'location_on',
      hoverBorder: 'group-hover:border-primary-fixed/40',
      accentColor: 'text-primary-fixed',
      territory: 'nacional'
    },
    {
      id: 5,
      category: 'deportes',
      categoryLabel: 'Deportes',
      categoryColor: 'text-[#ff9142]',
      categoryDot: 'bg-[#ff6b00]',
      sources: ['ET', 'CC'],
      sourceName: 'Frecuencia Deportiva',
      badge: 'En Desarrollo',
      badgeClass: 'bg-[#ff6b00]/20 text-[#ff9142]',
      time: 'Hace 3h',
      title: 'Clasificatorias y fixture continental: Selección prepara nómina de cara a la doble fecha',
      description: 'Cuerpo técnico valora convocatorias mixtas entre figuras de ligas europeas y talentos emergentes del fútbol profesional local.',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
      viewsCount: '4 análisis tácticos',
      viewsIcon: 'sports_soccer',
      hoverBorder: 'group-hover:border-[#ff6b00]/40',
      accentColor: 'text-[#ff9142]',
      territory: 'nacional'
    },
    {
      id: 6,
      category: 'politica',
      categoryLabel: 'Internacional',
      categoryColor: 'text-[#59a6ff]',
      categoryDot: 'bg-[#0066ff]',
      sources: ['AP', 'RE', 'NYT'],
      sourceName: 'Agencias Globales',
      badge: 'Diplomacia',
      badgeClass: 'bg-tertiary-container text-on-tertiary-container',
      time: 'Hace 3h 20m',
      title: 'Acuerdo sobre minerales críticos y transición energética en cumbre regional',
      description: 'Naciones andinas y delegaciones multilaterales firman marco regulatorio para la extracción sustentable de litio, níquel y cobre.',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
      viewsCount: 'Tratados cruzados',
      viewsIcon: 'public',
      hoverBorder: 'group-hover:border-tertiary-container/40',
      accentColor: 'text-tertiary-fixed',
      territory: 'internacional'
    }
  ];

  const filteredArticles = articles.filter(a => {
    const matchesTopic = activeTopic === 'all' || a.category === activeTopic;
    const matchesTerritory = activeTerritory === 'nacional' ? a.territory === 'nacional' : true;
    return matchesTopic && matchesTerritory;
  });

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Interactive Top Filters & Scope Selector */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md py-space-sm mb-space-lg">
        {/* Topic Pills */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 text-on-surface">
          {topics.map(t => {
            const isSelected = activeTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`topic-pill px-space-md py-space-xs rounded-full font-label-md text-label-md uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-container shadow-[0_0_16px_rgba(253,228,0,0.35)] font-bold'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-on-primary-container' : t.dot}`}></span>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Territorial Scope Pill Switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-surface-container-low p-1 rounded-full shadow-sm shrink-0 border border-outline-variant/20">
          <button
            onClick={() => setActiveTerritory('nacional')}
            className={`px-space-md py-space-xs rounded-full font-label-sm text-label-sm uppercase font-bold flex items-center gap-1 transition-all ${
              activeTerritory === 'nacional'
                ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(253,228,0,0.3)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">flag</span>
            Nacional (Colombia)
          </button>
          <button
            onClick={() => setActiveTerritory('internacional')}
            className={`px-space-md py-space-xs rounded-full font-label-sm text-label-sm uppercase font-bold flex items-center gap-1 transition-all ${
              activeTerritory === 'internacional'
                ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(253,228,0,0.3)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">public</span>
            Internacional
          </button>
        </div>
      </div>

      {/* Main Hero Card: Radar Global de Portada */}
      <div className="relative w-full rounded-2xl bg-surface-container-low overflow-hidden shadow-2xl mb-space-xl p-space-lg md:p-space-xl border border-outline-variant/30">
        {/* Ambient Backdrop Illumination */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-tertiary-container/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-xl">
          {/* Left Content */}
          <div className="flex-1 flex flex-col gap-space-md">
            {/* Tagline & Status Badges */}
            <div className="flex flex-wrap items-center gap-space-sm">
              <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(253,228,0,0.4)] font-bold">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                Radar de Portada
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary-fixed-dim font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                Política Nacional
              </span>
              <span className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[16px] text-tertiary-container">schedule</span>
                Actualizado hace 12 min
              </span>
            </div>

            {/* Master Headline */}
            <h1 className="font-headline-xl text-headline-xl text-primary font-extrabold tracking-tight leading-tight max-w-3xl">
              Reforma Laboral y Pensional: Senado aprueba artículos clave en medio de fuerte pulso gremial
            </h1>

            {/* Executive Narrative Contrast Context */}
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
              Mayoría de redacciones destacan la concertación de horas nocturnas, mientras periódicos económicos alertan por el impacto fiscal sobre pymes y fondos de retiro.
            </p>

            {/* Multi-Source Convergence Metric Bar */}
            <div className="p-space-md rounded-xl bg-surface-container max-w-2xl flex flex-col gap-space-sm border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-tertiary-container">data_exploration</span>
                  <span className="font-label-md text-label-md text-on-surface uppercase font-bold">Consenso de Portada</span>
                </div>
                <span className="font-label-md text-label-md text-primary-container font-extrabold">8 de 10 medios</span>
              </div>

              {/* Segmented Alignment Indicator */}
              <div className="w-full h-2 rounded-full bg-surface-container-highest flex overflow-hidden gap-0.5">
                <div className="h-full bg-tertiary-container rounded-l-full w-[50%]" title="Enfoque social / concertación"></div>
                <div className="h-full bg-primary-container w-[30%]" title="Enfoque de trámite institucional"></div>
                <div className="h-full bg-secondary-container rounded-r-full w-[20%]" title="Enfoque de alerta macroeconómica"></div>
              </div>

              <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span>50% Enfoque Social</span>
                <span>30% Institucional</span>
                <span>20% Alerta Gremial</span>
              </div>
            </div>

            {/* Sources Avatars Strip & CTA Trigger */}
            <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider font-semibold">
                  Fuentes clave:
                </span>
                <div className="flex items-center -space-x-2 overflow-hidden">
                  <div className="w-9 h-9 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-label-sm text-label-sm font-bold shadow-md">ET</div>
                  <div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-label-sm text-label-sm font-bold shadow-md">EE</div>
                  <div className="w-9 h-9 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-label-sm text-label-sm font-bold shadow-md">RT</div>
                  <div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-label-sm text-label-sm font-bold shadow-md">EC</div>
                  <div className="w-9 h-9 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-label-sm text-label-sm font-bold shadow-md">RE</div>
                  <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-sm text-label-sm font-black shadow-md">+3</div>
                </div>
              </div>

              <Link
                href="/contrast"
                className="px-space-lg py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md uppercase tracking-wider font-extrabold flex items-center gap-space-xs shadow-[0_0_20px_rgba(253,228,0,0.45)] hover:shadow-[0_0_28px_rgba(253,228,0,0.65)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span>Ver análisis comparativo (8 medios)</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Right Visual Widget: Realtime Telemetry Perspective Divergence */}
          <div className="w-full lg:w-80 p-space-md rounded-2xl bg-surface-container flex flex-col gap-space-md border border-outline-variant/30 shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider font-bold">
                Dispersión de Tono
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse shadow-[0_0_8px_rgba(255,74,141,0.8)]"></span>
            </div>

            {/* Radial Divergence Gauge Inline SVG */}
            <div className="relative flex items-center justify-center py-2">
              <svg className="w-44 h-44 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" fill="none" r="50" stroke="#262a35" strokeWidth="8"></circle>
                <circle cx="60" cy="60" fill="none" r="50" stroke="#59fdc5" strokeDasharray="100 214" strokeLinecap="round" strokeWidth="8"></circle>
                <circle cx="60" cy="60" fill="none" r="50" stroke="#fde400" strokeDasharray="80 234" strokeDashoffset="-105" strokeLinecap="round" strokeWidth="8"></circle>
                <circle cx="60" cy="60" fill="none" r="50" stroke="#ff4a8d" strokeDasharray="60 254" strokeDashoffset="-190" strokeLinecap="round" strokeWidth="8"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-headline-lg text-headline-lg font-black text-primary leading-none">68%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-1 font-bold">Divergencia</span>
              </div>
            </div>

            <div className="flex flex-col gap-space-xs text-body-sm text-body-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container"></span> Favorabilidad
                </span>
                <span className="font-bold text-on-surface">42%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span> Neutral / Descriptivo
                </span>
                <span className="font-bold text-on-surface">32%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-secondary-container"></span> Crítica Estructural
                </span>
                <span className="font-bold text-on-surface">26%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Section Header */}
      <div className="flex items-end justify-between gap-space-md mb-space-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed font-bold">
              Radar Dinámico
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
              Cobertura Multi-Espectro
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold mt-1">
            Noticias Analizadas en Tiempo Real ({filteredArticles.length})
          </h2>
        </div>
      </div>

      {/* Feed Grid: 3-Columns Dynamic Article Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
        {filteredArticles.map(article => (
          <article 
            key={article.id}
            className={`news-card group flex flex-col justify-between rounded-2xl bg-surface-container p-space-lg shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-outline-variant/30 ${article.hoverBorder}`}
          >
            <div className="flex flex-col gap-space-md">
              {/* Media source bar & badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center -space-x-2">
                    {article.sources.map((s, idx) => (
                      <div 
                        key={idx}
                        className="w-8 h-8 rounded-full bg-surface-container-highest text-on-surface flex items-center justify-center font-label-sm text-label-sm font-extrabold shadow-sm border border-surface-container"
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                  <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold ml-1">
                    {article.sourceName}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm uppercase font-bold tracking-wider ${article.badgeClass}`}>
                  {article.badge}
                </span>
              </div>

              {/* Article visual snippet */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-surface-container-low border border-outline-variant/20">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-surface/80 backdrop-blur-md font-label-sm text-label-sm uppercase font-bold flex items-center gap-1 ${article.categoryColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${article.categoryDot}`}></span>
                  {article.categoryLabel}
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-xs text-on-surface-variant font-label-sm text-label-sm">
                  {article.time}
                </span>
              </div>

              {/* Headline & Description */}
              <div className="flex flex-col gap-space-xs">
                <h3 className={`font-headline-sm text-headline-sm text-primary font-bold transition-colors ${article.accentColor}`}>
                  {article.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                  {article.description}
                </p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-space-md mt-space-md flex items-center justify-between border-t border-outline-variant/20">
              <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px]">{article.viewsIcon}</span>
                <span>{article.viewsCount}</span>
              </div>
              <Link 
                href="/contrast"
                className="px-space-md py-space-xs rounded-full bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-on-surface font-label-sm text-label-sm uppercase tracking-wider font-bold flex items-center gap-1 transition-all"
              >
                <span>Ver enfoques</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
