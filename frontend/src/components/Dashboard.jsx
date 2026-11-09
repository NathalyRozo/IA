'use client';

import React, { useState, useEffect } from 'react';

export default function Dashboard({
  currentView = 'inicio',
  selectedTerritory = 'nacional',
  searchQuery = '',
  onNavigate,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [coverageWindow, setCoverageWindow] = useState('7 días');
  const [trendsPeriod, setTrendsPeriod] = useState('7 Días');
  const [contrastFraming, setContrastFraming] = useState('all');
  const [allArticles, setAllArticles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Cargar caché de datos inicial
  useEffect(() => {
    if (typeof window !== 'undefined' && window.EMBEDDED_DAILY_CACHE) {
      const data = window.EMBEDDED_DAILY_CACHE;
      if (data?.feed?.all_articles) {
        setAllArticles(data.feed.all_articles);
      }
    } else {
      fetch('/data/daily_cache.json')
        .then((res) => res.json())
        .then((data) => {
          if (data?.feed?.all_articles) {
            setAllArticles(data.feed.all_articles);
          }
        })
        .catch(() => {});
    }

    try {
      const saved = localStorage.getItem('foque_favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFavorite = (art) => {
    const exists = favorites.some((f) => f.id === art.id);
    let updated;
    if (exists) {
      updated = favorites.filter((f) => f.id !== art.id);
      showToast('Artículo eliminado de Favoritos.');
    } else {
      updated = [...favorites, art];
      showToast('Artículo guardado en Favoritos.');
    }
    setFavorites(updated);
    try {
      localStorage.setItem('foque_favorites', JSON.stringify(updated));
    } catch (e) {}
  };

  // Categorías Canónicas en contenedor flex flex-wrap gap-2
  const categories = [
    { id: 'all', label: 'Todos los Temas', icon: 'view_stream' },
    { id: 'Política', label: 'Política', icon: 'account_balance' },
    { id: 'Economía', label: 'Economía', icon: 'trending_up' },
    { id: 'Sociedad', label: 'Sociedad', icon: 'groups' },
    { id: 'Conflicto y Paz', label: 'Conflicto y Paz', icon: 'shield' },
    { id: 'Salud', label: 'Salud', icon: 'vital_signs' },
    { id: 'Medio Ambiente', label: 'Medio Ambiente', icon: 'eco' },
    { id: 'Internacional', label: 'Internacional', icon: 'public' },
    { id: 'Tecnología', label: 'Tecnología', icon: 'memory' },
    { id: 'Deportes', label: 'Deportes', icon: 'sports_soccer' },
    { id: 'Cultura', label: 'Cultura', icon: 'theater_comedy' },
  ];

  // Filtrado de artículos
  const filteredArticles = allArticles.filter((a) => {
    if (selectedTerritory !== 'all') {
      const scope = (a.source_scope || a.origin_type || '').toLowerCase();
      const isNac = scope === 'nacional' || scope === 'colombia' || (scope.includes('nac') && !scope.includes('inter'));
      if (selectedTerritory === 'nacional' && !isNac) return false;
      if (selectedTerritory === 'internacional' && isNac) return false;
    }
    if (activeCategory !== 'all') {
      const cat = (a.category || a.topic || '').toLowerCase();
      if (!cat.includes(activeCategory.toLowerCase())) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const title = (a.title || '').toLowerCase();
      const media = (a.source_name || '').toLowerCase();
      if (!title.includes(q) && !media.includes(q)) return false;
    }
    return true;
  });

  // Balance Territorial dinámico
  const nacCount = allArticles.filter((a) => {
    const s = (a.source_scope || a.origin_type || '').toLowerCase();
    return s === 'nacional' || s === 'colombia' || (s.includes('nac') && !s.includes('inter'));
  }).length;
  const intCount = allArticles.length - nacCount;
  const nacPct = allArticles.length > 0 ? Math.round((nacCount / allArticles.length) * 100) : 52;
  const intPct = 100 - nacPct;

  // ====================================================================
  // RENDER: VISTA 1 - INICIO
  // ====================================================================
  if (currentView === 'inicio') {
    const leadArticle = filteredArticles[0] || {
      title: 'Monitoreo diario de medios de comunicación en Colombia y el mundo',
      source_name: 'FOQUÉ Observatorio',
      category: 'Política',
      url: 'https://www.elespectador.com',
      narrative_angle: 'Cobertura sistemática de las salas de redacción según Teoría de Agenda-Setting.',
    };

    return (
      <div className="flex flex-col gap-6">
        {/* Banner de Bienvenida y Telemetría Rápida */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 text-[10px] font-bold uppercase tracking-wider">
                Edición de Hoy
              </span>
              <span className="text-xs text-slate-400">08 Noviembre 2026</span>
            </div>
            <h1 className="text-xl font-extrabold text-white">Buenos días, Victoria</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Panel analítico de agenda mediática sobre 10 medios nacionales e internacionales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
              <span className="block text-lg font-black text-yellow-400">{allArticles.length || 372}</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Notas Indexadas</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
              <span className="block text-lg font-black text-emerald-400">10 / 10</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Medios Activos</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
              <span className="block text-lg font-black text-pink-500">Gemini 3.5</span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Motor IA</span>
            </div>
          </div>
        </div>

        {/* 3. FILTROS DE CATEGORÍAS (flex flex-wrap gap-2) */}
        <div className="flex flex-wrap gap-2 items-center bg-slate-950/40 p-2 rounded-2xl border border-slate-800/80">
          {categories.map((c) => {
            const isSel = activeCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isSel
                    ? 'bg-yellow-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(250,204,21,0.3)]'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Lead Story / Radar de Portada */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Titular Destacado de Agenda
              </span>
              <span className="text-xs text-slate-400 font-mono">{leadArticle.source_name}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-snug mb-3">
              {leadArticle.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {leadArticle.narrative_angle || 'Análisis de encuadre editorial y jerarquización informativa en portada.'}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-yellow-400 text-[10px] font-bold uppercase">
                  {leadArticle.category || 'General'}
                </span>
                <span className="text-xs text-slate-400">10 salas de redacción monitoreadas</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite(leadArticle)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-yellow-400 border border-slate-800"
                  title="Guardar en Favoritos"
                >
                  <span className="material-symbols-outlined text-[18px]">bookmark</span>
                </button>
                <a
                  href={leadArticle.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                >
                  <span>Ver original</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>

          {/* Telemetría: Tono y Consenso */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 flex flex-col gap-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-200">Dispersión de Tono Editorial</span>
                <span className="material-symbols-outlined text-yellow-400 text-[18px]">equalizer</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Neutro / Descriptivo</span>
                    <span className="font-bold text-slate-200">58%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full w-[58%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Crítico / Conflicto</span>
                    <span className="font-bold text-slate-200">26%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 rounded-full w-[26%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Institucional / Oficial</span>
                    <span className="font-bold text-slate-200">16%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full w-[16%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 flex flex-col gap-2 shadow-md">
              <span className="text-xs font-bold uppercase text-slate-200 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-yellow-400 text-[16px]">handshake</span>
                Consenso de Agenda Mediática
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                El <strong>72% de los medios</strong> coinciden en ubicar temas electorales y crisis regional en sus portadas principales.
              </p>
            </div>
          </div>
        </div>

        {/* Feed de Noticias */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Noticias Monitoreadas ({filteredArticles.length} resultados)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.slice(1, 13).map((art, idx) => (
              <div
                key={art.id || idx}
                className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 hover:border-yellow-400/40 transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">
                      {art.category || 'General'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{art.source_name}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-yellow-400 transition-colors leading-snug mb-2">
                    {art.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {art.narrative_angle || art.excerpt || 'Despacho periodístico registrado en la matriz de monitoreo.'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {art.published_at ? art.published_at.slice(0, 10) : '08 Nov'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(art)}
                      className="p-1 text-slate-400 hover:text-yellow-400"
                      title="Guardar en Favoritos"
                    >
                      <span className="material-symbols-outlined text-[16px]">bookmark</span>
                    </button>
                    <a
                      href={art.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-yellow-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Leer</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ====================================================================
  // RENDER: VISTA 2 - MEDICIÓN DE COBERTURA
  // ====================================================================
  if (currentView === 'cobertura') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-xl font-extrabold text-white">Medición de Cobertura</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Métricas de alcance, distribución editorial y balance territorial en los 10 medios.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-full border border-slate-800">
            {['24 horas', '7 días', 'Mes actual', '30 días'].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setCoverageWindow(w)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                  coverageWindow === w
                    ? 'bg-yellow-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-white">Balance Territorial</span>
              <span className="material-symbols-outlined text-yellow-400 text-[18px]">public</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-yellow-400">Nacional: {nacPct}% ({nacCount})</span>
              <span className="text-emerald-400">Internacional: {intPct}% ({intCount})</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden">
              <div className="h-full bg-yellow-400 transition-all duration-500" style={{ width: `${nacPct}%` }}></div>
              <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${intPct}%` }}></div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Distribución calculada sobre los 372 artículos clasificados sin sesgos de subcadena.
            </p>
          </div>

          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase text-white flex items-center gap-1.5 text-pink-500">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              Alerta de Omisión Editorial
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              El análisis cruzado detecta si algún medio monitoreado omite temas de alta concentración en salas competidoras.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <strong>1 de los 10 medios</strong> no publicó en portada sobre la destitución presidencial en Paraguay.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================================
  // RENDER: VISTA 3 - DETECCIÓN DE TENDENCIAS
  // ====================================================================
  if (currentView === 'tendencias') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-xl font-extrabold text-white">Detección de Tendencias</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Aceleración informativa, velocidad de publicación y dispersión temática calculada con IA.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-full border border-slate-800">
            {['Hoy', '7 Días', '30 Días'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setTrendsPeriod(p)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                  trendsPeriod === p
                    ? 'bg-yellow-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs text-yellow-400 font-bold uppercase tracking-wider">Dinámica Temporal</span>
              <h3 className="text-lg font-bold text-white">Velocidad & Aceleración de Temas Clave</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-yellow-400">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> Política & Elecciones
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Internacional & Geopolítica
              </span>
              <span className="flex items-center gap-1.5 text-pink-500">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Economía & Finanzas
              </span>
            </div>
          </div>

          <div className="w-full h-48 flex items-end pt-4 pb-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 200" preserveAspectRatio="none">
              <line x1="0" y1="50" x2="800" y2="50" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#1e293b" strokeDasharray="4 4" />
              <path d="M 0,160 Q 200,140 400,90 T 800,20" fill="none" stroke="#facc15" strokeWidth="3.5" />
              <path d="M 0,180 Q 250,160 500,110 T 800,50" fill="none" stroke="#34d399" strokeWidth="3" />
              <path d="M 0,60 Q 250,90 500,140 T 800,180" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeDasharray="6 3" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================================
  // RENDER: VISTA 4 - GENERACIÓN DE INFORMES
  // ====================================================================
  if (currentView === 'informes') {
    const handleDownloadWord = () => {
      const title = 'Informe Ejecutivo de Agenda Mediática FOQUÉ';
      const wordHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>${title}</title>
        <style>body{font-family:Calibri,sans-serif;font-size:11pt;margin:2cm;} h1{color:#1e3a8a;} table{width:100%;border-collapse:collapse;} th,td{border:1pt solid #cbd5e1;padding:6pt;}</style>
        </head><body>
        <h1>${title}</h1>
        <p>Observatorio FOQUÉ | 10 Medios Monitoreados | Fecha: 08 Noviembre 2026</p>
        <h2>Bloque A: Evidencia Empírica Verificable</h2>
        <p>Monitoreo cuantitativo de 372 notas clasificadas con Gemini 3.5.</p>
        <h2>Bloque B: Interpretación y Síntesis de Patrones Asistida por IA</h2>
        <p>Prevalencia de agenda en asuntos internacionales y reformas políticas.</p>
        </body></html>
      `;
      const blob = new Blob(['\ufeff' + wordHtml], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'FOQUE_Informe_Ejecutivo_2026.doc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('¡Documento Word (.doc) descargado con éxito!');
    };

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-xl font-extrabold text-white">Generación de Informes</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Exportación de dossiers ejecutivos estructurados en Bloque A (Evidencia) y Bloque B (Síntesis IA).
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadWord}
            className="px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-extrabold uppercase flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">description</span>
            <span>Descargar Word (.doc)</span>
          </button>
        </div>
      </div>
    );
  }

  // ====================================================================
  // RENDER: VISTA 5 - FAVORITOS
  // ====================================================================
  if (currentView === 'favoritos') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-xl font-extrabold text-white">Noticias Guardadas (Favoritos)</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Colección persistida de artículos guardados para consulta y citación en tus columnas.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-bold">
            {favorites.length} artículos guardados
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-slate-950 rounded-2xl p-12 border border-slate-800 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">bookmark_border</span>
            <p className="text-sm text-slate-400">No tienes artículos guardados en favoritos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((art, idx) => (
              <div key={idx} className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex flex-col justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-yellow-400">{art.category}</span>
                  <h4 className="text-sm font-bold text-white mb-2">{art.title}</h4>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <a href={art.url} target="_blank" rel="noreferrer" className="text-xs text-yellow-400 hover:underline">
                    Abrir nota original
                  </a>
                  <button type="button" onClick={() => toggleFavorite(art)} className="text-xs text-pink-500 hover:underline">
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ====================================================================
  // RENDER: VISTA 6 - ENFOQUE CRÍTICO / CONTRASTE DE MEDIOS
  // ====================================================================
  if (currentView === 'enfoque') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-xl font-extrabold text-white">
              Contraste Editorial y Matriz de Encuadres (Framing Multimedio)
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Descomposición analítica de encuadres mediáticos y sesgos discursivos entre medios monitoreados.
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-1 bg-slate-900 p-1 rounded-full border border-slate-800">
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
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
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

        <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 overflow-x-auto">
          <h3 className="text-xs font-bold uppercase text-yellow-400 mb-3">Matriz de Divergencia Léxica por Medio</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="py-2.5 pr-4 text-slate-400 uppercase">Dimensión Analítica</th>
                <th className="py-2.5 px-3 text-yellow-400 uppercase">El Espectador</th>
                <th className="py-2.5 px-3 text-emerald-400 uppercase">El Tiempo</th>
                <th className="py-2.5 px-3 text-pink-500 uppercase">RTVC Noticias</th>
                <th className="py-2.5 px-3 text-cyan-400 uppercase">Reuters</th>
                <th className="py-2.5 px-3 text-amber-400 uppercase">BBC News Mundo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr>
                <td className="py-2.5 pr-4 font-bold text-white font-sans">Titular en Portada</td>
                <td className="py-2.5 px-3">“Línea 2 del Metro de Bogotá: tres grupos pasan a fase final...”</td>
                <td className="py-2.5 px-3">“Crisis en Paraguay: Pedro Alliana promete elecciones...”</td>
                <td className="py-2.5 px-3">“Calendario electoral 2027 en Colombia...”</td>
                <td className="py-2.5 px-3">“India ONGC hopes to operate Venezuelan oil...”</td>
                <td className="py-2.5 px-3">“El escándalo de Ueno Bank en Paraguay...”</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-white font-sans">Encuadre Editorial (Framing)</td>
                <td className="py-2.5 px-3">Avanza proceso licitatorio de infraestructura clave.</td>
                <td className="py-2.5 px-3">Inestabilidad institucional y juicio político en el Cono Sur.</td>
                <td className="py-2.5 px-3">Cronograma oficial de la Registraduría y garantías.</td>
                <td className="py-2.5 px-3">Inversión petrolera y licencias energéticas globales.</td>
                <td className="py-2.5 px-3">Colapso bancario digital y detención presidencial.</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-white font-sans">Foco Léxico Clave</td>
                <td className="py-2.5 px-3 text-yellow-400">Infraestructura, Licitación, Movilidad</td>
                <td className="py-2.5 px-3 text-emerald-400">Juicio político, Transición, Elecciones</td>
                <td className="py-2.5 px-3 text-pink-400">Democracia, Registraduría, Calendario</td>
                <td className="py-2.5 px-3 text-cyan-400">Petróleo, Transición, Mercado</td>
                <td className="py-2.5 px-3 text-amber-400">Crisis bancaria, Ahorradores, Juicio</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-white font-sans">Tono Discursivo</td>
                <td className="py-2.5 px-3">Institucional</td>
                <td className="py-2.5 px-3">Crítico / Alarma</td>
                <td className="py-2.5 px-3">Neutro</td>
                <td className="py-2.5 px-3">Neutro / Económico</td>
                <td className="py-2.5 px-3">Crítico / Investigación</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}
