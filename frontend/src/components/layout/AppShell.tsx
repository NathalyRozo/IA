'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ScopeDisclaimer from './ScopeDisclaimer';
import { Menu, Search, ShieldCheck } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      <ScopeDisclaimer />

      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar with Hamburger */}
          <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition focus:outline-none"
                aria-label="Abrir o colapsar menú"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight">PRISMA</span>
                <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full font-bold">
                  Radar v2.0
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar en los 10 medios..."
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 w-56 transition"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-xl font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">10 Medios Activos</span>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
