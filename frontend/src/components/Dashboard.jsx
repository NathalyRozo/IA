'use client';

import React, { useState, useEffect } from 'react';

export default function Dashboard({
  currentView = 'inicio',
  activeScope = 'nacional',
  selectedTerritory,
  activeTopic = 'all',
  onTopicChange,
  searchQuery = '',
  onNavigate,
  onSelectArticle,
  articles = [],
  favorites = [],
  onToggleFavorite,
  onOpenDisclaimer,
  onSyncGemini,
  isSyncing = false,
}) {
  const effectiveScope = selectedTerritory || activeScope;

  const [coverageWindow, setCoverageWindow] = useState('7 días');
  const [trendsPeriod, setTrendsPeriod] = useState('7 Días');
  const [contrastFraming, setContrastFraming] = useState('all');
  const [contrastMediaA, setContrastMediaA] = useState('El Espectador');
  const [contrastMediaB, setContrastMediaB] = useState('El Tiempo');

  const categories = [
    { id: 'all', label: 'Todos los Temas', icon: 'view_stream' },
    { id: 'politica', label: 'Política', icon: 'account_balance' },
    { id: 'economia', label: 'Economía', icon: 'trending_up' },
    { id: 'sociedad', label: 'Sociedad', icon: 'groups' },
    { id: 'conflicto-y-paz', label: 'Conflicto y Paz', icon: 'shield' },
    { id: 'salud', label: 'Salud', icon: 'vital_signs' },
    { id: 'medio-ambiente', label: 'Medio Ambiente', icon: 'eco' },
    { id: 'internacional', label: 'Internacional', icon: 'public' },
    { id: 'tecnologia', label: 'Tecnología', icon: 'memory' },
    { id: 'deportes', label: 'Deportes', icon: 'sports_soccer' },
    { id: 'cultura', label: 'Cultura', icon: 'theater_comedy' },
  ];

  const filteredArticles = articles.filter((a) => {
    if (effectiveScope === 'nacional') {
      const s = (a.source_scope || a.origin_type || '').toLowerCase();
      const isNac = s === 'nacional' || s === 'colombia' || (s.includes('nac') && !s.includes('inter'));
      if (!isNac) return false;
    } else if (effectiveScope === 'internacional') {
      const s = (a.source_scope || a.origin_type || '').toLowerCase();
      const isNac = s === 'nacional' || s === 'colombia' || (s.includes('nac') && !s.includes('inter'));
      if (isNac) return false;
    }

    if (activeTopic && activeTopic !== 'all') {
      const cat = (a.category || a.topic || '').toLowerCase();
      const normTopic = activeTopic.replace('-', ' ').toLowerCase();
      if (!cat.includes(activeTopic.toLowerCase()) && !cat.includes(normTopic)) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = (a.title || '').toLowerCase();
      const media = (a.source_name || '').toLowerCase();
      const angle = (a.narrative_angle || '').toLowerCase();
      if (!title.includes(q) && !media.includes(q) && !angle.includes(q)) return false;
    }

    return true;
  });

  const nacCount = articles.filter((a) => {
    const s = (a.source_scope || a.origin_type || '').toLowerCase();
    return s === 'nacional' || s === 'colombia' || (s.includes('nac') && !s.includes('inter'));
  }).length;
  const intCount = articles.length - nacCount;
  const nacPct = articles.length > 0 ? Math.round((nacCount / articles.length) * 100) : 52;
  const intPct = 100 - nacPct;

  const handleArticleClick = (art) => {
    if (onSelectArticle) {
      onSelectArticle(art);
    }
  };

  const downloadWordDoc = () => {
    const title = 'Dossier Ejecutivo de Agenda Setting - FOQUÉ';
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; padding: 24px; }
        h1 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
        h2 { color: #1e293b; margin-top: 20px; }
        .meta { color: #64748b; font-size: 13px; margin-bottom: 20px; }
        .block { background: #f8fafc; border-left: 4px solid #facc15; padding: 12px; margin-bottom: 16px; }
        .source { font-weight: bold; color: #0f172a; }
        .apa { font-family: monospace; background: #e2e8f0; padding: 8px; font-size: 12px; }
      </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p class='meta'>Generado por FOQUÉ Observatorio • ${new Date().toLocaleDateString('es-CO')} • Muestra: ${articles.length} notas analizadas.</p>
        
        <h2>Bloque A: Evidencia Empírica de Cobertura</h2>
        <div class='block'>
          <p><strong>Balance Territorial:</strong> ${nacPct}% Nacional (${nacCount} notas) / ${intPct}% Internacional (${intCount} notas).</p>
          <p><strong>Medios Monitoreados (10 redacciones):</strong> El Tiempo, El Espectador, RTVC Noticias, El Colombiano, Revista Semana, BBC News Mundo, Reuters América Latina, El País América, CNN en Español, The New York Times.</p>
        </div>

        <h2>Bloque B: Síntesis de Encuadres Editoriales (Gemini 3.5)</h2>
        ${filteredArticles.slice(0, 15).map((a, i) => `
          <div class='block'>
            <p class='source'>${i + 1}. [${a.source_name}] ${a.title}</p>
            <p><strong>Encuadre (Framing):</strong> ${a.narrative_angle || 'Análisis de jerarquización institucional.'}</p>
            <p><strong>Tono:</strong> ${a.tone || 'Neutro / Informativo'}</p>
            <p class='apa'>${a.source_name}. (${new Date(a.published_at || Date.now()).getFullYear()}). ${a.title}. ${a.url}</p>
          </div>
        `).join('')}

        <p class='meta'>FOQUÉ analiza encuadres mediáticos bajo la teoría de Agenda-Setting (McCombs & Shaw, 1972). No realiza verificación de hechos (fact-checking).</p>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FOQUE_Dossier_Ejecutivo_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // VISTA 1: INICIO
  if (currentView === 'inicio') {
    const leadArticle = filteredArticles[0] || {
      title: 'Línea 2 del Metro de Bogotá: tres grupos pasan a fase final de licitación',
      source_name: 'El Espectador',
      category: 'Política',
      url: 'https://www.elespectador.com',
      narrative_angle: 'Cobertura centrada en el cronograma institucional de infraestructura y la adjudicación de contratos estratégicos de movilidad.',
      tone: 'Neutro / Informativo',
      published_at: new Date().toISOString(),
    };

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 text-[10px] font-bold uppercase tracking-wider">
                Radar Activo
              </span>
              <span className="text-xs text-slate-400">Edición en Tiempo Real</span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Buenos días, Victoria</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Observatorio de agenda y contraste de encuadres en 10 medios nacionales e internacionales.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[85px]">
              <span className="block text-lg font-black text-yellow-400">{articles.length || 372}</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Notas</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[85px]">
              <span className="block text-lg font-black text-emerald-400">10 / 10</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Medios</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[85px]">
              <span className="block text-lg font-black text-pink-500">Gemini 3.5</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Análisis IA</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center bg-slate-950/40 p-2.5 rounded-2xl border border-slate-800/80">
          {categories.map((c) => {
            const isSelected = activeTopic === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onTopicChange && onTopicChange(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-yellow-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(250,204,21,0.35)]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div 
            onClick={() => handleArticleClick(leadArticle)}
            className="lg:col-span-2 bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-yellow-400/50 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Titular Central en Agenda
              </span>
              <span className="text-xs text-yellow-400 font-mono font-bold">
                {leadArticle.source_name}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-white leading-snug mb-3 group-hover:text-yellow-400 transition-colors">
              {leadArticle.title}
            </h2>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 mb-4">
              <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                Encuadre Detectado por Gemini 3.5:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {leadArticle.narrative_angle || 'Cobertura con foco en el desarrollo licitatorio y su impacto en la movilidad urbana.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-yellow-400 text-[10px] font-bold uppercase">
                  {leadArticle.category || 'Política'}
                </span>
                <span className="text-xs text-slate-400">Haz clic para ver desglose completo</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleArticleClick(leadArticle);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Ver Análisis Gemini</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-yellow-400 text-[18px]">pie_chart</span>
                  Balance Territorial
                </span>
                <span className="text-[10px] font-mono text-slate-400">{articles.length} notas</span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">Nacional (Colombia)</span>
                    <span className="font-mono text-yellow-400 font-bold">{nacPct}% ({nacCount})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${nacPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">Internacional</span>
                    <span className="font-mono text-cyan-400 font-bold">{intPct}% ({intCount})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${intPct}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div 
              onClick={onOpenDisclaimer}
              className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-yellow-400/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  Enfoque Crítico
                </span>
                <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-yellow-400">info</span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                "Mira más allá de los titulares y detecta los sesgos editoriales."
              </p>
              <span className="text-[10px] text-yellow-400 underline font-semibold mt-1 inline-block">
                Ver principios deontológicos
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-yellow-400 text-[20px]">feed</span>
              Noticias Analizadas por Gemini ({filteredArticles.length})
            </h2>
            <span className="text-xs text-slate-400">
              Filtro: {activeTopic === 'all' ? 'Todos los Temas' : activeTopic} • {effectiveScope}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.slice(0, 18).map((art, idx) => {
              const isFav = favorites.some((f) => f.id === art.id);
              return (
                <div
                  key={art.id || idx}
                  onClick={() => handleArticleClick(art)}
                  className="bg-slate-950 rounded-2xl p-4 border border-slate-800 hover:border-yellow-400/40 transition-all flex flex-col justify-between shadow-md hover:-translate-y-0.5 cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-yellow-400 uppercase">
                        {art.source_name || 'Medio'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {art.category || 'General'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2 mb-2 leading-snug">
                      {art.title}
                    </h3>

                    {art.narrative_angle && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {art.narrative_angle}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleFavorite) onToggleFavorite(art);
                      }}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${
                        isFav ? 'text-pink-500' : 'text-slate-400 hover:text-white'
                      }`}
                      title={isFav ? 'Quitar de Favoritos' : 'Guardar en Favoritos'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isFav ? 'bookmark_added' : 'bookmark_add'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArticleClick(art);
                      }}
                      className="text-yellow-400 hover:text-yellow-300 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Desglose Gemini</span>
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // VISTA 2: COBERTURA
  if (currentView === 'cobertura') {
    const mediaVolumes = [
      { name: 'El Tiempo', count: 96, pct: 26, bar: 'bg-yellow-400', scope: 'Nacional' },
      { name: 'El Espectador', count: 75, pct: 20, bar: 'bg-emerald-400', scope: 'Nacional' },
      { name: 'RTVC Noticias', count: 48, pct: 13, bar: 'bg-pink-500', scope: 'Nacional' },
      { name: 'Reuters América Latina', count: 42, pct: 11, bar: 'bg-cyan-400', scope: 'Internacional' },
      { name: 'BBC News Mundo', count: 36, pct: 10, bar: 'bg-amber-400', scope: 'Internacional' },
      { name: 'El País América', count: 28, pct: 8, bar: 'bg-purple-400', scope: 'Internacional' },
      { name: 'El Colombiano', count: 22, pct: 6, bar: 'bg-orange-400', scope: 'Nacional' },
      { name: 'Revista Semana', count: 15, pct: 4, bar: 'bg-red-400', scope: 'Nacional' },
      { name: 'CNN en Español', count: 6, pct: 1.5, bar: 'bg-indigo-400', scope: 'Internacional' },
      { name: 'The New York Times', count: 4, pct: 0.5, bar: 'bg-teal-400', scope: 'Internacional' },
    ];

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Medición de Cobertura y Volumen</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Frecuencia de publicación, cuota de pantalla y omisiones editoriales entre las 10 redacciones.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-1 bg-slate-900 p-1 rounded-full border border-slate-800">
            {['24 horas', '7 días', '30 días', 'Mes actual'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setCoverageWindow(p)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                  coverageWindow === p
                    ? 'bg-yellow-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Distribución de Volumen por Redacción ({coverageWindow})
            </h2>
            <span className="text-xs text-slate-400 font-mono">10 Medios Activos</span>
          </div>

          <div className="space-y-3.5">
            {mediaVolumes.map((m) => (
              <div key={m.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{m.name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                      {m.scope}
                    </span>
                  </div>
                  <span className="font-mono text-slate-300 font-bold">{m.count} notas ({m.pct}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className={`h-full ${m.bar} rounded-full`} style={{ width: `${m.pct * 3.5}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // VISTA 3: CONTRASTE / SPLITSCREEN
  if (currentView === 'contraste' || currentView === 'splitscreen') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">
              Splitscreen en Contraste de Información
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparativa lado a lado de encuadres, jerarquización y divergencia léxica entre dos fuentes.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={contrastMediaA}
              onChange={(e) => setContrastMediaA(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-yellow-400 font-bold outline-none cursor-pointer"
            >
              <option value="El Espectador">El Espectador</option>
              <option value="El Tiempo">El Tiempo</option>
              <option value="RTVC Noticias">RTVC Noticias</option>
              <option value="BBC News Mundo">BBC News Mundo</option>
              <option value="Reuters">Reuters</option>
            </select>
            <span className="text-xs text-slate-500 font-black">VS</span>
            <select
              value={contrastMediaB}
              onChange={(e) => setContrastMediaB(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-bold outline-none cursor-pointer"
            >
              <option value="El Tiempo">El Tiempo</option>
              <option value="El Espectador">El Espectador</option>
              <option value="RTVC Noticias">RTVC Noticias</option>
              <option value="BBC News Mundo">BBC News Mundo</option>
              <option value="Reuters">Reuters</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950 rounded-2xl p-5 border border-yellow-400/30 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-black uppercase text-yellow-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  {contrastMediaA}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Enfoque 1</span>
              </div>
              <h3 className="text-base font-bold text-white mt-3 leading-snug">
                “Línea 2 del Metro de Bogotá: tres grupos pasan a fase final de licitación”
              </h3>
              <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <strong className="text-yellow-400 block mb-1">Encuadre:</strong>
                Foco técnico e institucional. Resalta el cumplimiento del cronograma y la participación de consorcios internacionales en infraestructura pública.
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">Tono: Institucional</span>
              <a
                href="https://www.elespectador.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline flex items-center gap-1 font-bold text-xs"
              >
                <span>Ver nota original</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>

          <div className="bg-slate-950 rounded-2xl p-5 border border-emerald-400/30 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  {contrastMediaB}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Enfoque 2</span>
              </div>
              <h3 className="text-base font-bold text-white mt-3 leading-snug">
                “Sobrecostos y alertas fiscales: advertencias sobre la financiación de la Línea 2”
              </h3>
              <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <strong className="text-emerald-400 block mb-1">Encuadre:</strong>
                Foco financiero y de riesgo. Pone el acento en los reparos de gremios y analistas sobre el impacto en el endeudamiento distrital.
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">Tono: Crítico / Fiscal</span>
              <a
                href="https://www.eltiempo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 font-bold text-xs"
              >
                <span>Ver nota original</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 overflow-x-auto shadow-md">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <h3 className="text-xs font-bold uppercase text-yellow-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              Matriz de Divergencia Léxica por Redacción
            </h3>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-full border border-slate-800">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'social', label: 'Social / Laboral' },
                { id: 'fiscal', label: 'Fiscal / Mercados' },
                { id: 'politico', label: 'Político / Gobierno' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setContrastFraming(f.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    contrastFraming === f.id
                      ? 'bg-yellow-400 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-2.5 pr-4">Dimensión</th>
                <th className="py-2.5 px-3 text-yellow-400">El Espectador</th>
                <th className="py-2.5 px-3 text-emerald-400">El Tiempo</th>
                <th className="py-2.5 px-3 text-pink-500">RTVC Noticias</th>
                <th className="py-2.5 px-3 text-cyan-400">Reuters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr>
                <td className="py-2.5 pr-4 font-bold text-white font-sans">Encuadre Clave</td>
                <td className="py-2.5 px-3">Infraestructura y Licitación</td>
                <td className="py-2.5 px-3">Gasto Fiscal y Advertencias</td>
                <td className="py-2.5 px-3">Inversión Pública y Transparencia</td>
                <td className="py-2.5 px-3">Interés de Mercados Globales</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-white font-sans">Léxico Central</td>
                <td className="py-2.5 px-3 text-yellow-400">Consorcios, Movilidad, Ofertas</td>
                <td className="py-2.5 px-3 text-emerald-400">Deuda, Advertencias, Riesgo</td>
                <td className="py-2.5 px-3 text-pink-400">Acceso, Transporte, Gestión</td>
                <td className="py-2.5 px-3 text-cyan-400">Capital, Licitación, Finanzas</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-white font-sans">Tono Detectado</td>
                <td className="py-2.5 px-3">Institucional</td>
                <td className="py-2.5 px-3">Crítico</td>
                <td className="py-2.5 px-3">Neutro</td>
                <td className="py-2.5 px-3">Financiero</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // VISTA 4: TENDENCIAS
  if (currentView === 'tendencias') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Detección de Tendencias y Curvas de Agenda</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Evolución temporal de temas emergentes y aceleración de cobertura mediática.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-full border border-slate-800">
            {['24 Horas', '7 Días', '30 Días'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setTrendsPeriod(p)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                  trendsPeriod === p
                    ? 'bg-yellow-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-yellow-400 text-[18px]">show_chart</span>
              Curva de Frecuencia ({trendsPeriod})
            </h2>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1 text-yellow-400">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> Metro Bogotá
              </span>
              <span className="flex items-center gap-1 text-pink-500">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Calendario Electoral
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Paraguay Transición
              </span>
            </div>
          </div>

          <div className="w-full h-56 flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200">
              <polyline
                fill="none"
                stroke="#facc15"
                strokeWidth="3"
                points="0,160 100,140 200,90 300,120 400,60 500,40 600,20"
              />
              <polyline
                fill="none"
                stroke="#ec4899"
                strokeWidth="3"
                points="0,180 100,170 200,130 300,110 400,130 500,90 600,70"
              />
              <polyline
                fill="none"
                stroke="#22d3ee"
                strokeWidth="3"
                points="0,190 100,180 200,160 300,140 400,110 500,80 600,50"
              />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Línea 2 Metro de Bogotá',
              speed: '12.4 notas/día',
              presence: '9 de 10 medios',
              color: 'text-yellow-400',
              trend: '+45% esta semana',
            },
            {
              title: 'Calendario Electoral 2027',
              speed: '8.1 notas/día',
              presence: '7 de 10 medios',
              color: 'text-pink-400',
              trend: '+22% esta semana',
            },
            {
              title: 'Transición Institucional Paraguay',
              speed: '6.7 notas/día',
              presence: '6 de 10 medios',
              color: 'text-cyan-400',
              trend: '+68% esta semana',
            },
          ].map((t) => (
            <div key={t.title} className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-md">
              <span className={`text-xs font-bold uppercase ${t.color}`}>{t.trend}</span>
              <h3 className="text-sm font-bold text-white mt-1 mb-3">{t.title}</h3>
              <div className="flex justify-between text-xs pt-3 border-t border-slate-800 text-slate-300 font-mono">
                <span>Velocidad: <strong>{t.speed}</strong></span>
                <span>{t.presence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // VISTA 5: INFORMES
  if (currentView === 'informes') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Generación de Informes & Dossier</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Exportación ejecutiva en formato Word (.doc) y citas académicas en norma APA 7ma Edición.
            </p>
          </div>

          <button
            type="button"
            onClick={downloadWordDoc}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_16px_rgba(250,204,21,0.35)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Descargar Informe en Word (.doc)</span>
          </button>
        </div>

        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] uppercase font-bold text-yellow-400">Dossier Ejecutivo</span>
            <h2 className="text-lg font-bold text-white mt-1">
              Reporte Integral de Agenda Setting y Encuadres Editoriales
            </h2>
            <p className="text-xs text-slate-400">
              Muestra acumulada de {articles.length} noticias recolectadas de 10 medios de comunicación.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-xs font-bold uppercase text-yellow-400 mb-2">
              Bloque A: Evidencia Empírica de Cobertura
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Durante la ventana de análisis, el <strong>{nacPct}% ({nacCount} notas)</strong> correspondió a la agenda nacional de Colombia, liderada por El Tiempo y El Espectador, mientras que el <strong>{intPct}% ({intCount} notas)</strong> correspondió a la agenda internacional (Reuters, BBC Mundo, El País).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-xs font-bold uppercase text-yellow-400 mb-2">
              Bloque B: Síntesis de Inteligencia Artificial Gemini 3.5
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              El análisis de encuadres revela una divergencia marcada entre el tratamiento institucional y el tratamiento fiscal en los proyectos estratégicos de movilidad e infraestructura en Colombia.
            </p>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400">
              Cita APA muestra: El Espectador. ({new Date().getFullYear()}). Línea 2 del Metro de Bogotá: tres grupos pasan a fase final de licitación. https://www.elespectador.com
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VISTA 6: FAVORITOS
  if (currentView === 'favoritos') {
    return (
      <div className="flex flex-col gap-6">
        <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Notas Guardadas en Favoritos</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Artículos y perspectivas guardadas localmente para consulta editorial rápida.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-yellow-400 text-slate-950 text-xs font-bold font-mono">
            {favorites.length} guardados
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            <span className="material-symbols-outlined text-[36px] text-slate-600 block mb-2">bookmark_border</span>
            No tienes artículos guardados en favoritos. Haz clic en el ícono de marcador en cualquier tarjeta para guardarla.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                onClick={() => handleArticleClick(fav)}
                className="bg-slate-950 rounded-2xl p-4 border border-slate-800 hover:border-yellow-400/40 transition-all flex flex-col justify-between shadow-md cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-yellow-400 text-[10px] font-bold uppercase">
                      {fav.source_name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{fav.category}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-2 leading-snug mb-2">
                    {fav.title}
                  </h3>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleFavorite) onToggleFavorite(fav);
                    }}
                    className="text-pink-500 hover:text-pink-400 font-semibold text-[11px] uppercase cursor-pointer"
                  >
                    Quitar
                  </button>
                  <span className="text-yellow-400 text-[11px] font-bold">Ver Análisis →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // VISTA 7: ENFOQUE CRÍTICO / PRINCIPIOS ÉTICOS
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
        <h1 className="text-xl md:text-2xl font-extrabold text-white">
          Enfoque Crítico & Límites Metodológicos
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Marco deontológico de FOQUÉ: teoría de Agenda-Setting, análisis de encuadres y qué NO hace la herramienta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: 'No determina si una noticia es verdadera o falsa',
            desc: 'Analiza contenidos, frecuencias y encuadres discursivos (framing), no es un verificador forense de hechos.',
            icon: 'gavel',
            color: 'text-yellow-400',
          },
          {
            title: 'No mide directamente la opinión pública',
            desc: 'La frecuencia de publicación refleja la agenda editorial de los medios (media agenda setting), no el sentir ciudadano ni las audiencias.',
            icon: 'groups',
            color: 'text-emerald-400',
          },
          {
            title: 'No abarca la totalidad de internet',
            desc: 'Se limita estrictamente a los 10 medios seleccionados (5 nacionales y 5 internacionales) para garantizar rigurosidad y estabilidad jurídica.',
            icon: 'language',
            color: 'text-cyan-400',
          },
          {
            title: 'No sustituye el criterio de la periodista',
            desc: 'Funciona como un instrumento de síntesis asistida. La comprobación final pertenece a la persona comunicadora.',
            icon: 'psychology',
            color: 'text-pink-400',
          },
        ].map((item) => (
          <div key={item.title} className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className={`material-symbols-outlined text-[20px] ${item.color}`}>{item.icon}</span>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
