'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  onOpenDisclaimer?: () => void;
}

export default function Sidebar({ onOpenDisclaimer }: SidebarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Inicio', icon: 'radar' },
    { href: '/coverage', label: 'Medición de Cobertura', icon: 'compare_arrows' },
    { href: '/contrast', label: 'Contraste de Información', icon: 'splitscreen' },
    { href: '/trends', label: 'Detección de Tendencias', icon: 'trending_up' },
    { href: '/reports', label: 'Generación de Informes', icon: 'auto_awesome' },
    { href: '#', label: 'Favoritos', icon: 'bookmark' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest z-50 flex flex-col justify-between p-space-md shadow-[0_1px_8px_rgba(0,0,0,0.25)] border-r border-outline-variant/20">
      <div className="flex flex-col gap-space-lg">
        {/* Brand Header */}
        <div className="px-space-sm pt-space-xs">
          <Link href="/" className="flex items-center gap-space-xs group">
            <span className="font-headline-lg text-headline-lg tracking-tight text-primary font-bold">
              FOQUÉ
            </span>
            <div className="flex items-center gap-1.5 ml-1">
              <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_rgba(253,228,0,0.6)]"></span>
              <span className="w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_8px_rgba(255,74,141,0.6)]"></span>
              <span className="w-2 h-2 rounded-full bg-tertiary-container shadow-[0_0_8px_rgba(89,253,197,0.6)]"></span>
              <span className="w-2 h-2 rounded-full bg-inverse-surface"></span>
            </div>
          </Link>
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mt-1">
            Tu radar de noticias
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-space-xs">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-space-sm px-space-md py-space-sm uppercase transition-all font-label-md text-label-md rounded-full ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container shadow-[0_0_16px_rgba(253,228,0,0.35)] font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Critical Focus / Scope Ethical Banner Card */}
      <div 
        onClick={onOpenDisclaimer}
        className="p-space-md rounded-xl bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.1)] flex flex-col gap-space-xs border border-outline-variant/30 cursor-pointer hover:border-primary-fixed/50 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary-fixed text-[18px]">verified</span>
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">
              Enfoque Crítico
            </span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant text-[16px] group-hover:text-primary-fixed transition-colors">
            info
          </span>
        </div>
        <p className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
          La información también es poder.
        </p>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          Mira más allá de los titulares y detecta los sesgos editoriales.
        </p>
      </div>
    </aside>
  );
}
