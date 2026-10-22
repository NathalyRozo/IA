'use client';

import React from 'react';
import Link from 'next/link';
import { BarChart3, SplitSquareVertical, TrendingUp, FileText, ArrowRight, CheckCircle2, Globe2, Building2 } from 'lucide-react';

export default function HomePage() {
  const mediaSources = [
    { name: 'El Espectador', scope: 'Nacional', country: 'Colombia' },
    { name: 'RTVC Noticias', scope: 'Nacional', country: 'Colombia' },
    { name: 'El Tiempo', scope: 'Nacional', country: 'Colombia' },
    { name: 'El Heraldo', scope: 'Nacional', country: 'Colombia' },
    { name: 'El Colombiano', scope: 'Nacional', country: 'Colombia' },
    { name: 'Reuters', scope: 'Internacional', country: 'Global' },
    { name: 'BBC News (Mundo)', scope: 'Internacional', country: 'Reino Unido' },
    { name: 'Associated Press (AP)', scope: 'Internacional', country: 'EE.UU.' },
    { name: 'Agence France-Presse (AFP)', scope: 'Internacional', country: 'Francia' },
    { name: 'The New York Times', scope: 'Internacional', country: 'EE.UU.' },
  ];

  const modules = [
    {
      title: 'Medición de la Cobertura Mediática',
      desc: 'Calcula y visualiza la cantidad de publicaciones que recibe cada tema, identificando temas dominantes y ausentes en la agenda.',
      href: '/coverage',
      icon: BarChart3,
      badge: 'Función 2'
    },
    {
      title: 'Contraste de Información entre Medios',
      desc: 'Compara titulares uno al lado del otro ante un mismo acontecimiento, revelando enfoques narrativos y aspectos omitidos.',
      href: '/contrast',
      icon: SplitSquareVertical,
      badge: 'Función 3'
    },
    {
      title: 'Detección de Tendencias',
      desc: 'Rankings y series temporales para monitorear qué temas aumentan, disminuyen o mantienen su presencia a lo largo del tiempo.',
      href: '/trends',
      icon: TrendingUp,
      badge: 'Función 4'
    },
    {
      title: 'Generación de Informes de Análisis',
      desc: 'Produce reportes estructurados con distinción explícita entre evidencia empírica (datos duros y fuentes) e inferencias de IA.',
      href: '/reports',
      icon: FileText,
      badge: 'Función 5'
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 rounded-2xl p-8 sm:p-10 text-white shadow-xl border border-slate-700">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Observatorio de Medios & Análisis del Discurso</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Análisis Comparativo y Enfoques de la Agenda Informativa
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Plataforma diseñada para periodistas e investigadores académicos. Recopila y clasifica noticias de 10 medios de comunicación clave mediante Procesamiento de Lenguaje Natural (PLN) para medir cobertura, contrastar enfoques narrativos y detectar tendencias mediáticas.
          </p>
        </div>
      </div>

      {/* 4 Core Functions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-sky-400 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {m.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {m.title}
                </h3>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                  {m.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
                <span>Explorar módulo</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 10 Monitored Media Outlets Panel */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-700" />
              10 Medios de Comunicación Monitoreados
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              5 salas de redacción nacionales (Colombia) y 5 agencias y medios de alcance internacional.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            10/10 Fuentes Configuradas
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
          {mediaSources.map((media) => (
            <div
              key={media.name}
              className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                <span className={`w-1.5 h-1.5 rounded-full ${media.scope === 'Nacional' ? 'bg-amber-500' : 'bg-sky-500'}`} />
                <span>{media.scope}</span>
              </div>
              <div className="font-semibold text-slate-900 text-sm">{media.name}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{media.country}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
