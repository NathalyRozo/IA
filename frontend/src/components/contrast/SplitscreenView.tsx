'use client';

import React, { useState } from 'react';

export interface SplitscreenViewProps {
  articles?: any[];
  onSelectArticle?: (article: any) => void;
}

export default function SplitscreenView({
  articles = [],
  onSelectArticle,
}: SplitscreenViewProps) {
  // 10 Medios Canónicos
  const all10Outlets = [
    { name: 'El Espectador', scope: 'Nacional', color: 'text-yellow-400', badge: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/40' },
    { name: 'El Tiempo', scope: 'Nacional', color: 'text-emerald-400', badge: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/40' },
    { name: 'RTVC Noticias', scope: 'Nacional', color: 'text-pink-500', badge: 'bg-pink-500/20 text-pink-400 border-pink-500/40' },
    { name: 'El Colombiano', scope: 'Nacional', color: 'text-orange-400', badge: 'bg-orange-400/20 text-orange-300 border-orange-400/40' },
    { name: 'Revista Semana', scope: 'Nacional', color: 'text-red-400', badge: 'bg-red-400/20 text-red-300 border-red-400/40' },
    { name: 'Reuters', scope: 'Internacional', color: 'text-cyan-400', badge: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40' },
    { name: 'BBC News Mundo', scope: 'Internacional', color: 'text-amber-400', badge: 'bg-amber-400/20 text-amber-300 border-amber-400/40' },
    { name: 'El País América', scope: 'Internacional', color: 'text-purple-400', badge: 'bg-purple-400/20 text-purple-300 border-purple-400/40' },
    { name: 'CNN en Español', scope: 'Internacional', color: 'text-indigo-400', badge: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/40' },
    { name: 'The New York Times', scope: 'Internacional', color: 'text-teal-400', badge: 'bg-teal-400/20 text-teal-300 border-teal-400/40' },
  ];

  // Estados
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>([
    'El Espectador', 'El Tiempo', 'RTVC Noticias', 'Reuters', 'BBC News Mundo'
  ]);
  const [activeFraming, setActiveFraming] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');

  // Selectores para modo Enfrentado de 2-3 medios
  const [mediaA, setMediaA] = useState<string>('El Espectador');
  const [mediaB, setMediaB] = useState<string>('El Tiempo');
  const [mediaC, setMediaC] = useState<string>('Reuters');

  // Alternar medios seleccionados
  const toggleOutlet = (name: string) => {
    if (selectedOutlets.includes(name)) {
      if (selectedOutlets.length <= 2) return; // Mínimo 2 medios
      setSelectedOutlets(selectedOutlets.filter((o) => o !== name));
    } else {
      setSelectedOutlets([...selectedOutlets, name]);
    }
  };

  // Filtros de temas / enfoques
  const framingFilters = [
    { id: 'all', label: 'Todos los Temas' },
    { id: 'politica', label: 'Política / Gobierno' },
    { id: 'economia', label: 'Economía / Mercados' },
    { id: 'social', label: 'Social / Laboral' },
    { id: 'conflicto', label: 'Conflicto y Paz' },
    { id: 'internacional', label: 'Internacional' },
  ];

  // Obtener noticia representativa de un medio según el filtro activo
  const getOutletArticle = (outletName: string) => {
    const art = articles.find((a) => {
      const src = (a.source_name || '').toLowerCase();
      const match = src.includes(outletName.toLowerCase()) || outletName.toLowerCase().includes(src);
      if (!match) return false;

      if (activeFraming === 'all') return true;
      const cat = (a.category || a.topic || '').toLowerCase();
      const title = (a.title || '').toLowerCase();
      if (activeFraming === 'politica') return cat.includes('política') || cat.includes('politica') || title.includes('gobierno') || title.includes('congreso');
      if (activeFraming === 'economia') return cat.includes('economía') || cat.includes('economia') || title.includes('dólar') || title.includes('mercado');
      if (activeFraming === 'social') return cat.includes('sociedad') || cat.includes('salud') || title.includes('laboral') || title.includes('social');
      if (activeFraming === 'conflicto') return cat.includes('conflicto') || title.includes('paz') || title.includes('seguridad');
      if (activeFraming === 'internacional') return cat.includes('internacional') || (a.source_scope || '').toLowerCase().includes('inter');
      return true;
    });

    if (art) return art;

    // Respaldo de fallback para asegurar contenido
    const fallback = articles.find((a) => {
      const src = (a.source_name || '').toLowerCase();
      return src.includes(outletName.toLowerCase()) || outletName.toLowerCase().includes(src);
    });

    return fallback || {
      title: `Monitoreo informativo continuo en ${outletName}`,
      narrative_angle: 'Cobertura de actualidad nacional e internacional bajo criterios editoriales propios.',
      tone: 'Neutro / Informativo',
      highlighted_aspects: ['Institucional', 'Coyuntura', 'Agenda'],
      url: 'https://www.google.com',
      source_name: outletName,
    };
  };

  const activeOutletsList = all10Outlets.filter((o) => selectedOutlets.includes(o.name));

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ============================================================== */}
      {/* 1. HEADER DE CONFIGURACIÓN A 100% DE ANCHO (TOP-TO-BOTTOM)    */}
      {/* ============================================================== */}
      <div className="w-full bg-slate-950/80 p-5 md:p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col gap-5">
        {/* Título y Estado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Contraste Multimedio
              </span>
              <span className="text-xs text-slate-400 font-mono">
                10 Salas de Redacción Monitorizadas
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Contraste Editorial y Matriz de Encuadres (Framing Multimedio)
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-4xl">
              Descomposición analítica de encuadres mediáticos (<em>framing</em>), sesgos léxicos y divergencias discursivas entre prensa nacional e internacional.
            </p>
          </div>

          {/* Selector de Modo de Visualización */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-full border border-slate-800 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-yellow-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">table_chart</span>
              <span>Matriz Completa</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-yellow-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">splitscreen</span>
              <span>Enfrentados (2-3 Medios)</span>
            </button>
          </div>
        </div>

        {/* Fila 1: Filtros de Tema / Enfoque (flex flex-wrap gap-2 limpio) */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Filtrar Acontecimiento por Eje Temático:
          </span>
          <div className="flex flex-wrap gap-2">
            {framingFilters.map((f) => {
              const isSel = activeFraming === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFraming(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isSel
                      ? 'bg-yellow-400 text-slate-950 shadow-[0_0_12px_rgba(250,204,21,0.35)]'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fila 2: Selector de Medios a Contrastar (Botones Chip a 100% de Ancho) */}
        <div className="flex flex-col gap-2 pt-3 border-t border-slate-800/60">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">tune</span>
              Seleccionar Medios a Contrastar en Paralelo:
            </span>
            <span className="text-xs font-mono text-slate-400">
              {selectedOutlets.length} de 10 medios activos en comparativa
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {all10Outlets.map((m) => {
              const isSelected = selectedOutlets.includes(m.name);
              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => toggleOutlet(m.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? `${m.badge} shadow-sm font-extrabold`
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800 opacity-60'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-current' : 'bg-slate-600'}`}></span>
                  <span>{m.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({m.scope[0]})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MODO 1: TABLA DE MATRIZ A ANCHO COMPLETO CON COLUMNA STICKY */}
      {/* ============================================================== */}
      {viewMode === 'matrix' && (
        <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-yellow-400 text-[20px]">spellcheck</span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Matriz de Divergencia Léxica y Encuadres en Paralelo ({activeOutletsList.length} Medios)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              ↔ Desplaza horizontalmente para ver todos los medios
            </span>
          </div>

          {/* Contenedor con Scroll Horizontal Limpio */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              {/* Encabezado con Medios */}
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950">
                  {/* Primera Columna Fija (Sticky) */}
                  <th className="sticky left-0 bg-slate-950 z-20 shadow-[2px_0_10px_rgba(0,0,0,0.5)] min-w-[200px] md:min-w-[220px] p-4 border-r border-slate-800 font-extrabold text-slate-300 uppercase tracking-wider">
                    Dimensión Analítica
                  </th>

                  {/* Columnas de Medios con Ancho Mínimo de 280px */}
                  {activeOutletsList.map((m) => (
                    <th
                      key={m.name}
                      className="min-w-[280px] w-72 max-w-[320px] p-4 border-r border-slate-800/80 last:border-r-0 bg-slate-950"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-black text-sm ${m.color}`}>{m.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                          {m.scope}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Filas de Comparativa */}
              <tbody className="divide-y divide-slate-800/70">
                {/* FILA 1: TITULAR EN PORTADA */}
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="sticky left-0 bg-slate-950 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.5)] p-4 border-r border-slate-800 font-bold text-white uppercase text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-yellow-400 text-[16px]">newspaper</span>
                      <span>Titular en Portada</span>
                    </div>
                  </td>
                  {activeOutletsList.map((m) => {
                    const art = getOutletArticle(m.name);
                    return (
                      <td
                        key={m.name}
                        onClick={() => onSelectArticle && onSelectArticle(art)}
                        className="p-4 border-r border-slate-800/80 last:border-r-0 text-slate-200 font-medium leading-snug hover:text-yellow-400 transition-colors cursor-pointer group"
                      >
                        <p className="line-clamp-3 font-semibold">“{art.title}”</p>
                      </td>
                    );
                  })}
                </tr>

                {/* FILA 2: ENCUADRE EDITORIAL (FRAMING) */}
                <tr className="hover:bg-slate-900/40 transition-colors bg-slate-950/40">
                  <td className="sticky left-0 bg-slate-950 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.5)] p-4 border-r border-slate-800 font-bold text-white uppercase text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-400 text-[16px]">psychology</span>
                      <span>Encuadre Editorial (Framing)</span>
                    </div>
                  </td>
                  {activeOutletsList.map((m) => {
                    const art = getOutletArticle(m.name);
                    return (
                      <td key={m.name} className="p-4 border-r border-slate-800/80 last:border-r-0 text-slate-300 text-xs leading-relaxed">
                        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                          {art.narrative_angle || 'Enfoque de cobertura sobre la agenda coyuntural del sector.'}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* FILA 3: FOCO LÉXICO & TÉRMINOS CLAVE */}
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="sticky left-0 bg-slate-950 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.5)] p-4 border-r border-slate-800 font-bold text-white uppercase text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-pink-400 text-[16px]">tune</span>
                      <span>Foco Léxico Clave</span>
                    </div>
                  </td>
                  {activeOutletsList.map((m) => {
                    const art = getOutletArticle(m.name);
                    const aspects = (art.highlighted_aspects && art.highlighted_aspects.length)
                      ? art.highlighted_aspects.join(', ')
                      : (art.category || 'Institucional, Hechos');
                    return (
                      <td key={m.name} className="p-4 border-r border-slate-800/80 last:border-r-0 font-mono text-xs text-yellow-400 font-bold">
                        {aspects}
                      </td>
                    );
                  })}
                </tr>

                {/* FILA 4: TONO DISCURSIVO */}
                <tr className="hover:bg-slate-900/40 transition-colors bg-slate-950/40">
                  <td className="sticky left-0 bg-slate-950 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.5)] p-4 border-r border-slate-800 font-bold text-white uppercase text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-cyan-400 text-[16px]">record_voice_over</span>
                      <span>Tono Discursivo</span>
                    </div>
                  </td>
                  {activeOutletsList.map((m) => {
                    const art = getOutletArticle(m.name);
                    return (
                      <td key={m.name} className="p-4 border-r border-slate-800/80 last:border-r-0 text-xs">
                        <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-bold uppercase text-[10px]">
                          {art.tone || 'Neutro / Informativo'}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* FILA 5: VER NOTICIA ORIGINAL */}
                <tr className="hover:bg-slate-900/40 transition-colors">
                  <td className="sticky left-0 bg-slate-950 z-10 shadow-[2px_0_10px_rgba(0,0,0,0.5)] p-4 border-r border-slate-800 font-bold text-white uppercase text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-amber-400 text-[16px]">open_in_new</span>
                      <span>Enlace al Medio</span>
                    </div>
                  </td>
                  {activeOutletsList.map((m) => {
                    const art = getOutletArticle(m.name);
                    return (
                      <td key={m.name} className="p-4 border-r border-slate-800/80 last:border-r-0 text-xs">
                        {art.url ? (
                          <a
                            href={art.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 hover:bg-yellow-400 hover:text-slate-950 text-slate-300 border border-slate-700/60 font-bold uppercase text-[10px] transition-all"
                          >
                            <span>Leer en medio</span>
                            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                          </a>
                        ) : (
                          <span className="text-slate-500 font-mono text-[11px]">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. MODO 2: COMPARATIVA ENFRENTADA ÁGIL (2 O 3 MEDIOS)         */}
      {/* ============================================================== */}
      {viewMode === 'cards' && (
        <div className="flex flex-col gap-5 w-full">
          {/* Selectores Rápidos de Medios */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <span className="text-xs font-bold uppercase text-yellow-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">compare</span>
              Seleccionar Medios a Enfrentar:
            </span>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={mediaA}
                onChange={(e) => setMediaA(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-yellow-400 font-bold outline-none cursor-pointer"
              >
                {all10Outlets.map((o) => (
                  <option key={o.name} value={o.name}>{o.name}</option>
                ))}
              </select>

              <span className="text-xs font-black text-slate-500">VS</span>

              <select
                value={mediaB}
                onChange={(e) => setMediaB(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-bold outline-none cursor-pointer"
              >
                {all10Outlets.map((o) => (
                  <option key={o.name} value={o.name}>{o.name}</option>
                ))}
              </select>

              <span className="text-xs font-black text-slate-500">VS</span>

              <select
                value={mediaC}
                onChange={(e) => setMediaC(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-cyan-400 font-bold outline-none cursor-pointer"
              >
                {all10Outlets.map((o) => (
                  <option key={o.name} value={o.name}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tarjetas Lado a Lado (3 Columnas Holgadas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[mediaA, mediaB, mediaC].map((outletName, i) => {
              const art = getOutletArticle(outletName);
              const outletInfo = all10Outlets.find((o) => o.name === outletName) || all10Outlets[0];
              const borderColors = ['border-yellow-400/40', 'border-emerald-400/40', 'border-cyan-400/40'];

              return (
                <div
                  key={outletName}
                  className={`bg-slate-950 rounded-2xl p-5 border ${borderColors[i % 3]} shadow-xl flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className={`text-xs font-black uppercase ${outletInfo.color} flex items-center gap-1.5`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
                        {outletName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {outletInfo.scope}
                      </span>
                    </div>

                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Titular en Portada
                      </span>
                      <h3
                        onClick={() => onSelectArticle && onSelectArticle(art)}
                        className="text-base font-bold text-white hover:text-yellow-400 transition-colors cursor-pointer leading-snug"
                      >
                        “{art.title}”
                      </h3>
                    </div>

                    <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                      <span className="text-yellow-400 font-bold uppercase text-[10px] block mb-1">
                        Encuadre Editorial (Framing):
                      </span>
                      <p className="leading-relaxed">
                        {art.narrative_angle || 'Análisis de cobertura temática y jerarquización informativa.'}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
                      <span className="text-slate-400 font-mono text-[11px]">
                        Tono: <strong className="text-white">{art.tone || 'Neutro'}</strong>
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {art.category || 'General'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onSelectArticle && onSelectArticle(art)}
                      className="text-yellow-400 hover:text-yellow-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                    >
                      <span>Desglose Gemini</span>
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </button>

                    {art.url && (
                      <a
                        href={art.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                      >
                        <span>Ver original</span>
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
