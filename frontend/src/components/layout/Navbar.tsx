'use client';

import React from 'react';

export interface NavbarProps {
  activeScope?: 'all' | 'nacional' | 'internacional';
  onScopeChange?: (scope: 'all' | 'nacional' | 'internacional') => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isSyncing?: boolean;
  onSyncGemini?: () => void;
  onToggleSidebar?: () => void;
  onOpenDisclaimer?: () => void;
}

export default function Navbar({
  activeScope = 'nacional',
  onScopeChange,
  searchQuery = '',
  onSearchChange,
  isSyncing = false,
  onSyncGemini,
  onToggleSidebar,
  onOpenDisclaimer,
}: NavbarProps) {
  const scopes: Array<{ id: 'all' | 'nacional' | 'internacional'; label: string; icon?: string }> = [
    { id: 'all', label: 'Todos' },
    { id: 'nacional', label: 'Nacional (Colombia)', icon: 'flag' },
    { id: 'internacional', label: 'Internacional', icon: 'public' },
  ];

  return (
    <header className="sticky top-0 z-10 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between flex-wrap gap-4 shadow-sm">
      {/* Left: Hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 min-w-[240px] max-w-xl">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            title="Alternar Menú Lateral"
            aria-label="Alternar Menú Lateral"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
        )}

        <div className="relative w-full flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Buscar fuentes, temas clave o perspectivas..."
            className="w-full bg-slate-900 border border-slate-700/60 rounded-full pl-10 pr-12 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/40 transition-all"
          />
          <kbd className="absolute right-3 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Center: Scope Filter Switcher */}
      <div className="flex items-center flex-wrap gap-1 bg-slate-900 p-1 rounded-full border border-slate-800 shrink-0">
        {scopes.map((s) => {
          const isSelected = activeScope === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onScopeChange && onScopeChange(s.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                isSelected
                  ? 'bg-yellow-400 text-slate-950 shadow-[0_0_8px_rgba(250,204,21,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s.icon && <span className="material-symbols-outlined text-[14px]">{s.icon}</span>}
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center flex-wrap gap-3 shrink-0">
        {/* Gemini Daily Sync Button */}
        {onSyncGemini && (
          <button
            type="button"
            onClick={onSyncGemini}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-extrabold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(250,204,21,0.3)] cursor-pointer disabled:opacity-50"
            title="Sincronizar noticias del día con Gemini 3.5"
          >
            <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Gemini'}</span>
          </button>
        )}

        {/* Ethical Limits Shortcut */}
        {onOpenDisclaimer && (
          <button
            type="button"
            onClick={onOpenDisclaimer}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/60 hover:border-yellow-400/40 text-slate-300 text-xs font-semibold uppercase transition-all cursor-pointer"
            title="Ver límites deontológicos de FOQUÉ"
          >
            <span className="material-symbols-outlined text-yellow-400 text-[16px]">verified</span>
            <span>Qué NO hace</span>
          </button>
        )}

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
  );
}
