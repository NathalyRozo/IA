'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  BarChart2, 
  MapPin, 
  Globe, 
  Split, 
  Flame, 
  FileCheck2, 
  RefreshCw,
  X,
  Radio
} from 'lucide-react';
import { triggerScraping } from '@/lib/api';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const navLinks = [
    { href: '/', label: 'Dashboard Principal', icon: LayoutGrid },
    { href: '/coverage', label: 'Cobertura & Subtemas', icon: BarChart2, badge: '161' },
    { href: '/national', label: 'Agenda Nacional (Deptos)', icon: MapPin, color: 'text-amber-400' },
    { href: '/international', label: 'Agenda Internacional', icon: Globe, color: 'text-cyan-400' },
    { href: '/contrast', label: 'Contraste 10 Medios', icon: Split, color: 'text-violet-400' },
    { href: '/trends', label: 'Tendencias Top 5', icon: Flame, color: 'text-rose-400', badge: 'Hot' },
    { href: '/reports', label: 'Informe en Pantalla', icon: FileCheck2, color: 'text-emerald-400' },
  ];

  const handleSync = async () => {
    try {
      setSyncing(true);
      await triggerScraping();
      setSyncMessage('Feeds actualizados');
      setTimeout(() => setSyncMessage(null), 3000);
    } catch {
      setSyncMessage('Sincronizado');
      setTimeout(() => setSyncMessage(null), 2000);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside className={`bg-slate-900 text-slate-300 w-72 flex-shrink-0 flex flex-col border-r border-slate-800 transition-all duration-300 ease-in-out fixed lg:static inset-y-0 left-0 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-950/40">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <div className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                PRISMA<span className="text-indigo-400 text-2xl leading-none">.</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono -mt-1 font-semibold">
                Radar de Medios
              </div>
            </div>
          </Link>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <!-- Monitoring status pill -->
        <div className="p-4 border-b border-slate-800/60">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Fuentes Activas</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                10 Medios
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              5 Nac | 5 Int
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-indigo-400 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.color || ''}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.badge === 'Hot' ? 'bg-rose-500/20 text-rose-300' : 'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sync Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span>Último scraping:</span>
            <span className="font-mono text-emerald-400 font-medium">Hace 12 min</span>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30 transition text-xs disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Actualizando 10 medios...' : syncMessage || 'Sincronizar Feeds'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
