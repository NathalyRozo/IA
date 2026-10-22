'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Newspaper, BarChart3, SplitSquareVertical, TrendingUp, FileText, RefreshCw } from 'lucide-react';
import { triggerScraping } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const [syncing, setSyncing] = React.useState(false);
  const [syncMessage, setSyncMessage] = React.useState<string | null>(null);

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Newspaper },
    { href: '/coverage', label: '1. Cobertura Mediática', icon: BarChart3 },
    { href: '/contrast', label: '2. Contraste de Medios', icon: SplitSquareVertical },
    { href: '/trends', label: '3. Tendencias', icon: TrendingUp },
    { href: '/reports', label: '4. Informes', icon: FileText },
  ];

  const handleSync = async () => {
    try {
      setSyncing(true);
      await triggerScraping();
      setSyncMessage('Ingesta iniciada en segundo plano...');
      setTimeout(() => setSyncMessage(null), 4000);
    } catch (err) {
      setSyncMessage('Error al sincronizar');
      setTimeout(() => setSyncMessage(null), 3000);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-slate-900 group-hover:bg-sky-400 transition-colors">
                M
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight block leading-none">MEDIATRIX</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Observatorio de Medios</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-sky-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Sincronizar noticias de los 10 medios"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-sky-400' : ''}`} />
              <span>{syncing ? 'Sincronizando...' : 'Actualizar Feeds'}</span>
            </button>
            {syncMessage && (
              <span className="text-xs text-sky-400 bg-sky-950/60 border border-sky-800 px-2 py-1 rounded">
                {syncMessage}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
