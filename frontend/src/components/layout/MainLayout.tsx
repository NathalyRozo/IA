'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MainLayoutProps {
  children?: React.ReactNode;
  activeView?: string;
  onViewChange?: (view: string) => void;
  selectedTerritory?: 'all' | 'nacional' | 'internacional';
  onTerritoryChange?: (territory: 'all' | 'nacional' | 'internacional') => void;
  onSearchChange?: (query: string) => void;
  onSyncGemini?: () => void;
  favoritesCount?: number;
}

export default function MainLayout({
  children,
  activeView = 'inicio',
  onViewChange,
  selectedTerritory = 'nacional',
  onTerritoryChange,
  onSearchChange,
  onSyncGemini,
  favoritesCount = 0,
}: MainLayoutProps) {
  // 1. Estado local de apertura/colapso del Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState(activeView);
  const [territory, setTerritory] = useState<'all' | 'nacional' | 'internacional'>(selectedTerritory);
  const [searchVal, setSearchVal] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  useEffect(() => {
    setCurrentView(activeView);
  }, [activeView]);

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    if (onViewChange) onViewChange(viewId);
  };

  const handleTerritoryClick = (t: 'all' | 'nacional' | 'internacional') => {
    setTerritory(t);
    if (onTerritoryChange) onTerritoryChange(t);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleSyncClick = async () => {
    setIsSyncing(true);
    if (onSyncGemini) {
      await onSyncGemini();
    }
    setTimeout(() => setIsSyncing(false), 1200);
  };

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: 'radar', desc: 'Dashboard & Radar' },
    { id: 'cobertura', label: 'Medición de Cobertura', icon: 'compare_arrows', desc: 'Volumen & Ejes' },
    { id: 'tendencias', label: 'Detección de Tendencias', icon: 'trending_up', desc: 'Aceleración & Radar' },
    { id: 'informes', label: 'Generación de Informes', icon: 'auto_awesome', desc: 'Dossier Ejecutivo' },
    { id: 'favoritos', label: 'Favoritos', icon: 'bookmark', desc: 'Notas Guardadas', badge: favoritesCount },
    { id: 'enfoque', label: 'Enfoque Crítico', icon: 'splitscreen', desc: 'Contraste & Framing' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans antialiased overflow-hidden">
      {/* ============================================================ */}
      {/* 1. ASIDE / SIDEBAR COLAPSABLE (transition-all duration-300) */}
      {/* ============================================================ */}
      <aside
        className={`transition-all duration-300 ease-in-out shrink-0 bg-slate-950/95 backdrop-blur-md border-r border-slate-800 z-20 flex flex-col justify-between ${
          isSidebarOpen ? 'w-64 p-4' : 'w-20 p-3'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Logo & Toggle Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            {isSidebarOpen ? (
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white">FOQUÉ</span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></span>
                  <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center py-1">
                <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"></span>
              </div>
            )}

            {/* Botón de repliegue / alternancia del Sidebar */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isSidebarOpen ? 'Colapsar barra lateral' : 'Expandir barra lateral'}
              aria-label={isSidebarOpen ? 'Colapsar barra lateral' : 'Expandir barra lateral'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isSidebarOpen ? 'chevron_left' : 'chevron_right'}
              </span>
            </button>
          </div>

          {/* Subtítulo si está expandido */}
          {isSidebarOpen && (
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold px-2 -mt-3">
              Radar de Agenda Mediática
            </p>
          )}

          {/* Navigation Items (2. Navegación Dinámica) */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  title={!isSidebarOpen ? item.label : undefined}
                  className={`flex items-center gap-3 rounded-xl transition-all text-left cursor-pointer group relative ${
                    isSidebarOpen ? 'px-3.5 py-2.5' : 'p-3 justify-center'
                  } ${
                    isActive
                      ? 'bg-yellow-400 text-slate-950 font-bold shadow-[0_0_16px_rgba(250,204,21,0.35)]'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] shrink-0 transition-transform ${
                      isActive ? 'text-slate-950 font-bold' : 'text-slate-400 group-hover:text-yellow-400'
                    }`}
                  >
                    {item.icon}
                  </span>

                  {isSidebarOpen && (
                    <div className="flex-1 min-w-0">
                      <span className="text-xs uppercase tracking-wider block truncate">
                        {item.label}
                      </span>
                    </div>
                  )}

                  {/* Badge de favoritos */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-slate-950 text-yellow-400'
                          : 'bg-yellow-400 text-slate-950'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar / Tarjeta Enfoque Ético */}
        <div className="pt-4 border-t border-slate-800/80">
          {isSidebarOpen ? (
            <div
              onClick={() => setIsDisclaimerOpen(true)}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-yellow-400/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-yellow-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">policy</span>
                  Enfoque Crítico
                </span>
                <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover:text-yellow-400">
                  info
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-tight">
                Análisis de encuadres mediáticos sin fact-checking policial.
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsDisclaimerOpen(true)}
              className="w-full flex justify-center p-2 rounded-lg text-yellow-400 hover:bg-slate-800 transition-colors"
              title="Límites deontológicos & Qué NO hace"
            >
              <span className="material-symbols-outlined text-[20px]">policy</span>
            </button>
          )}
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MAIN CONTENT WRAPPER (flex-1 flex flex-col min-w-0)       */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
        {/* ============================================================ */}
        {/* 3. HEADER FLUIDO SIN OVERLAPS (flex-wrap gap-4)              */}
        {/* ============================================================ */}
        <header className="sticky top-0 z-10 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between flex-wrap gap-4 shadow-sm">
          {/* Left: Mobile Sidebar Trigger & Search Bar */}
          <div className="flex items-center gap-3 flex-1 min-w-[240px] max-w-xl">
            {/* Botón hamburguesa alternativo en Header */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              title="Alternar Menú Lateral"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            {/* Barra de búsqueda */}
            <div className="relative w-full flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchVal}
                onChange={handleSearchInput}
                placeholder="Buscar titulares, encuadres, medios..."
                className="w-full bg-slate-900 border border-slate-700/60 rounded-full pl-10 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/40 transition-all"
              />
            </div>
          </div>

          {/* Center: Fast Scope Switcher (TODOS, NACIONAL, INTERNACIONAL) */}
          <div className="flex items-center flex-wrap gap-1 bg-slate-900 p-1 rounded-full border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => handleTerritoryClick('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                territory === 'all'
                  ? 'bg-yellow-400 text-slate-950 shadow-[0_0_8px_rgba(250,204,21,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => handleTerritoryClick('nacional')}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                territory === 'nacional'
                  ? 'bg-yellow-400 text-slate-950 shadow-[0_0_8px_rgba(250,204,21,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Nacional
            </button>
            <button
              type="button"
              onClick={() => handleTerritoryClick('internacional')}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all cursor-pointer ${
                territory === 'internacional'
                  ? 'bg-yellow-400 text-slate-950 shadow-[0_0_8px_rgba(250,204,21,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Internacional
            </button>
          </div>

          {/* Right Action Bar (SINCRONIZAR GEMINI, NOTIFICACIONES, PERFIL) */}
          <div className="flex items-center flex-wrap gap-3 shrink-0">
            {/* Botón Sincronizar Gemini */}
            <button
              type="button"
              onClick={handleSyncClick}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-extrabold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(250,204,21,0.3)] cursor-pointer disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Gemini'}</span>
            </button>

            {/* Botón Qué NO hace */}
            <button
              type="button"
              onClick={() => setIsDisclaimerOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/60 hover:border-yellow-400/40 text-slate-300 text-xs font-semibold uppercase transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-yellow-400 text-[16px]">verified</span>
              <span>Qué NO hace</span>
            </button>

            {/* Notificaciones */}
            <button
              type="button"
              className="relative p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="Notificaciones"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500"></span>
            </button>

            {/* Perfil Usuario: Victoria León */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-200 leading-tight">Victoria León</span>
                <span className="text-[10px] text-yellow-400 font-semibold uppercase">Periodista Pro</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-sm">
                VL
              </div>
            </div>
          </div>
        </header>

        {/* ============================================================ */}
        {/* 4. MAIN CONTENT AREA (flex-1 overflow-y-auto p-6)            */}
        {/* ============================================================ */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
          {children}
        </main>
      </div>

      {/* Modal Deontológico / Qué NO hace */}
      {isDisclaimerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsDisclaimerOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <div className="flex items-center gap-2 text-yellow-400 mb-3">
              <span className="material-symbols-outlined text-[24px]">verified</span>
              <h3 className="font-bold text-lg">Límites Deontológicos y Metodología FOQUÉ</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              FOQUÉ es un observatorio académico de cobertura y encuadre mediático fundamentado en la 
              <strong> Teoría del Agenda-Setting (McCombs & Shaw)</strong> y el <strong>Framing (Entman)</strong>.
            </p>
            <ul className="text-xs text-slate-300 space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>No realiza Fact-Checking:</strong> No dictamina la veracidad o falsedad de hechos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>No mide Opinión Pública:</strong> La frecuencia mediática mide la agenda de medios, no el pensamiento ciudadano.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Análisis de Encuadre:</strong> Descompone el foco léxico, tono discursivo y divergencia entre salas de redacción.</span>
              </li>
            </ul>
            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsDisclaimerOpen(false)}
                className="px-4 py-1.5 rounded-full bg-yellow-400 text-slate-950 text-xs font-bold uppercase"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
