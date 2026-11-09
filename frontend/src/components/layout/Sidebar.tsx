'use client';

import React from 'react';

export interface SidebarProps {
  currentView?: string;
  onSelectView?: (view: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenDisclaimer?: () => void;
  favoritesCount?: number;
}

export default function Sidebar({
  currentView = 'inicio',
  onSelectView,
  isCollapsed = false,
  onToggleCollapse,
  onOpenDisclaimer,
  favoritesCount = 0,
}: SidebarProps) {
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: 'radar', desc: 'Dashboard & Radar' },
    { id: 'cobertura', label: 'Medición de Cobertura', icon: 'compare_arrows', desc: 'Volumen & Ejes' },
    { id: 'contraste', label: 'Splitscreen en Contraste', icon: 'splitscreen', desc: 'Contraste & Framing' },
    { id: 'tendencias', label: 'Detección de Tendencias', icon: 'trending_up', desc: 'Aceleración & Radar' },
    { id: 'informes', label: 'Generación de Informes', icon: 'auto_awesome', desc: 'Dossier Ejecutivo' },
    { id: 'favoritos', label: 'Favoritos', icon: 'bookmark', desc: 'Notas Guardadas', badge: favoritesCount },
    { id: 'enfoque', label: 'Enfoque Crítico', icon: 'policy', desc: 'Límites Éticos PRD' },
  ];

  const handleNav = (id: string) => {
    if (onSelectView) {
      onSelectView(id);
    }
  };

  return (
    <aside
      className={`transition-all duration-300 ease-in-out shrink-0 bg-slate-950/95 backdrop-blur-md border-r border-slate-800 z-20 flex flex-col justify-between ${
        isCollapsed ? 'w-20 p-3' : 'w-64 p-4'
      }`}
    >
      <div className="flex flex-col gap-5">
        {/* Logo & Toggle Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('inicio')}>
              <span className="font-extrabold text-2xl tracking-tight text-white">FOQUÉ</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></span>
                <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center py-1 cursor-pointer" onClick={() => handleNav('inicio')}>
              <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"></span>
            </div>
          )}

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
              aria-label="Alternar barra lateral"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isCollapsed ? 'chevron_right' : 'chevron_left'}
              </span>
            </button>
          )}
        </div>

        {/* Navigation Items with active onClick handlers */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 w-full py-2.5 px-3 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-yellow-400 text-slate-950 font-bold shadow-[0_0_16px_rgba(250,204,21,0.35)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 font-medium'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-slate-950' : 'text-slate-400'}`}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-xs uppercase tracking-wider leading-none truncate font-bold">
                      {item.label}
                    </div>
                    <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                      {item.desc}
                    </div>
                  </div>
                )}

                {!isCollapsed && typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-yellow-400 text-[10px] font-mono font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Critical Focus / Scope Ethical Banner Card */}
      <div className="pt-4 border-t border-slate-800/80">
        {!isCollapsed ? (
          <div
            onClick={onOpenDisclaimer}
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
            <p className="text-[10px] text-slate-500 mt-1">
              Mira más allá de los titulares.
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenDisclaimer}
            className="w-full flex justify-center p-2 rounded-lg text-yellow-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Límites deontológicos & Qué NO hace"
          >
            <span className="material-symbols-outlined text-[20px]">policy</span>
          </button>
        )}
      </div>
    </aside>
  );
}
