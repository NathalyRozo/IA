'use client';

import React, { useState } from 'react';

interface NavbarProps {
  territory?: 'all' | 'nacional' | 'internacional';
  onTerritoryChange?: (territory: 'all' | 'nacional' | 'internacional') => void;
  onOpenDisclaimer?: () => void;
}

export default function Navbar({ 
  territory = 'nacional', 
  onTerritoryChange,
  onOpenDisclaimer 
}: NavbarProps) {
  const [selectedTerritory, setSelectedTerritory] = useState<'all' | 'nacional' | 'internacional'>(territory);

  const handleTerritory = (t: 'all' | 'nacional' | 'internacional') => {
    setSelectedTerritory(t);
    if (onTerritoryChange) onTerritoryChange(t);
    window.dispatchEvent(new CustomEvent('territoryChange', { detail: t }));
  };

  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-surface/80 backdrop-blur-xl z-40 px-space-lg flex items-center justify-between gap-space-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/20">
      {/* Search Bar & Fast Scope Switcher */}
      <div className="flex items-center gap-space-md flex-1 max-w-xl">
        <div className="relative w-full flex items-center">
          <span className="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[20px]">
            search
          </span>
          <input 
            className="w-full bg-surface-container-low rounded-full pl-11 pr-14 py-space-sm text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm outline-none focus:bg-surface-container-high transition-colors border border-outline-variant/20 focus:border-primary-fixed/40"
            placeholder="Buscar fuentes, temas clave o perspectivas..." 
            type="text"
            onChange={(e) => {
              window.dispatchEvent(new CustomEvent('searchChange', { detail: e.target.value }));
            }}
          />
          <kbd className="absolute right-space-md px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase">
            ⌘K
          </kbd>
        </div>

        <div className="inline-flex p-1 bg-surface-container-low rounded-full border border-outline-variant/20 shrink-0">
          <button 
            type="button"
            onClick={() => handleTerritory('all')}
            className={`px-space-sm py-space-xs rounded-full font-label-sm text-label-sm uppercase transition-all ${
              selectedTerritory === 'all'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_10px_rgba(253,228,0,0.3)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Todos
          </button>
          <button 
            type="button"
            onClick={() => handleTerritory('nacional')}
            className={`px-space-md py-space-xs rounded-full font-label-sm text-label-sm uppercase transition-all ${
              selectedTerritory === 'nacional'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_10px_rgba(253,228,0,0.3)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Nacional
          </button>
          <button 
            type="button"
            onClick={() => handleTerritory('internacional')}
            className={`px-space-md py-space-xs rounded-full font-label-sm text-label-sm uppercase transition-all ${
              selectedTerritory === 'internacional'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_10px_rgba(253,228,0,0.3)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Internacional
          </button>
        </div>
      </div>

      {/* Right User Bar */}
      <div className="flex items-center gap-space-md">
        {/* Ethical disclaimer shortcut */}
        <button
          onClick={onOpenDisclaimer}
          className="px-space-sm py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary-fixed flex items-center gap-1 font-label-sm text-label-sm uppercase transition-all border border-outline-variant/30 cursor-pointer"
          title="Ver límites de alcance y principios deontológicos"
        >
          <span className="material-symbols-outlined text-[16px] text-primary-fixed">verified</span>
          <span className="hidden sm:inline">Qué NO hace</span>
        </button>

        {/* Dark mode indicator */}
        <div className="flex items-center bg-surface-container-low rounded-full p-1 border border-outline-variant/20">
          <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-primary-fixed">
            <span className="material-symbols-outlined text-[16px]">dark_mode</span>
          </div>
        </div>

        {/* Notifications */}
        <button 
          type="button"
          className="relative p-space-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_8px_rgba(255,74,141,0.6)]"></span>
        </button>

        {/* User Persona Profile: Victoria León */}
        <div className="flex items-center gap-space-sm pl-space-xs border-l border-outline-variant/30">
          <div className="flex flex-col text-right">
            <span className="font-label-md text-label-md text-on-surface leading-tight font-bold">
              Victoria León
            </span>
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">
              Periodista Pro
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container font-black flex items-center justify-center shadow-[0_0_12px_rgba(253,228,0,0.3)]">
            VL
          </div>
        </div>
      </div>
    </header>
  );
}
