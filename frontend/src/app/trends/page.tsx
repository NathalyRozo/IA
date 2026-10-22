'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, Flame, Activity } from 'lucide-react';
import { fetchTrends } from '@/lib/api';
import { TrendsData } from '@/lib/types';

export default function TrendsPage() {
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [windowDays, setWindowDays] = useState(7);
  const [loading, setLoading] = useState(false);

  // Datos mock por defecto para disponibilidad inmediata
  const defaultTrends: TrendsData = {
    period_analyzed: 'Últimos 7 días vs 7 días anteriores',
    trends: [
      {
        topic: 'Política',
        current_count: 58,
        previous_count: 38,
        percentage_change: 52.6,
        trend_status: 'en_auge',
        velocity_score: 2.85,
        sample_headlines: [
          'Congreso retoma debate de reforma laboral con acuerdos en recargo nocturno',
          'Corte Constitucional delimita competencias en consultas populares'
        ]
      },
      {
        topic: 'Economía',
        current_count: 44,
        previous_count: 32,
        percentage_change: 37.5,
        trend_status: 'en_auge',
        velocity_score: 1.71,
        sample_headlines: [
          'Empresarios advierten freno a la contratación por nuevos costos laborales',
          'Tarifas de energía en el Caribe: alcaldes insisten en intervención'
        ]
      },
      {
        topic: 'Conflicto y Paz',
        current_count: 22,
        previous_count: 24,
        percentage_change: -8.3,
        trend_status: 'estable',
        velocity_score: -0.28,
        sample_headlines: [
          'Defensoría alerta por confinamiento de comunidades en Antioquia'
        ]
      },
      {
        topic: 'Internacional',
        current_count: 19,
        previous_count: 20,
        percentage_change: -5.0,
        trend_status: 'estable',
        velocity_score: -0.14,
        sample_headlines: [
          'Latin America diplomatic shifts in regional summit'
        ]
      },
      {
        topic: 'Salud',
        current_count: 8,
        previous_count: 15,
        percentage_change: -46.7,
        trend_status: 'en_declive',
        velocity_score: -1.0,
        sample_headlines: [
          'Avances científicos en terapias génicas abren nueva era en medicina'
        ]
      },
      {
        topic: 'Medio Ambiente',
        current_count: 6,
        previous_count: 12,
        percentage_change: -50.0,
        trend_status: 'en_declive',
        velocity_score: -0.85,
        sample_headlines: [
          'COP biodiversidad: Los retos de América Latina frente a la transición verde'
        ]
      }
    ],
    time_series: [
      { date: 'Día -6', Política: 5, Economía: 4, Internacional: 2 },
      { date: 'Día -5', Política: 6, Economía: 5, Internacional: 3 },
      { date: 'Día -4', Política: 8, Economía: 6, Internacional: 3 },
      { date: 'Día -3', Política: 9, Economía: 7, Internacional: 2 },
      { date: 'Día -2', Política: 11, Economía: 7, Internacional: 3 },
      { date: 'Día -1', Política: 10, Economía: 8, Internacional: 3 },
      { date: 'Hoy', Política: 12, Economía: 9, Internacional: 4 },
    ],
    methodological_disclaimer: 'La frecuencia mediática refleja las prioridades de los 10 medios analizados, no la opinión ciudadana.'
  };

  useEffect(() => {
    loadTrends(windowDays);
  }, [windowDays]);

  const loadTrends = async (days: number) => {
    try {
      setLoading(true);
      const res = await fetchTrends(days);
      setTrendsData(res);
    } catch {
      setTrendsData(defaultTrends);
    } finally {
      setLoading(false);
    }
  };

  const current = trendsData || defaultTrends;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Función 4: Dinámica Temporal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Detección de Tendencias en la Agenda
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Identifica qué temas aumentan, disminuyen o mantienen su presencia informativa en los medios seleccionados.
          </p>
        </div>

        {/* Window Selector */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 text-xs font-medium self-start sm:self-auto">
          {[7, 14, 21].map((d) => (
            <button
              key={d}
              onClick={() => setWindowDays(d)}
              className={`px-3 py-1.5 rounded-md transition ${
                windowDays === d ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Ventana de {d} días
            </button>
          ))}
        </div>
      </div>

      {/* Trends Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Temas en Auge</span>
            <Flame className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-950 mt-2">
            {current.trends.filter((t) => t.trend_status === 'en_auge').length}
          </div>
          <div className="text-xs text-emerald-700 mt-1">Crecimiento superior al +20%</div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Temas Estables</span>
            <Minus className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {current.trends.filter((t) => t.trend_status === 'estable').length}
          </div>
          <div className="text-xs text-slate-500 mt-1">Variación entre -20% y +20%</div>
        </div>

        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Temas en Declive</span>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-950 mt-2">
            {current.trends.filter((t) => t.trend_status === 'en_declive').length}
          </div>
          <div className="text-xs text-rose-700 mt-1">Reducción mayor al -20%</div>
        </div>
      </div>

      {/* Trends Ranking List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-600" />
              Ranking de Variación en la Presencia Mediática
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparativa de volumen entre el periodo actual y el periodo inmediatamente anterior.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {current.trends.map((item, index) => {
            const isRising = item.trend_status === 'en_auge';
            const isFalling = item.trend_status === 'en_declive';

            return (
              <div key={item.topic} className="p-5 hover:bg-slate-50/60 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    #{index + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{item.topic}</span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isRising
                          ? 'bg-emerald-100 text-emerald-800'
                          : isFalling
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {isRising && <ArrowUpRight className="w-3 h-3" />}
                        {isFalling && <ArrowDownRight className="w-3 h-3" />}
                        {!isRising && !isFalling && <Minus className="w-3 h-3" />}
                        <span>{item.percentage_change > 0 ? `+${item.percentage_change}%` : `${item.percentage_change}%`}</span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-500">
                      Publicaciones: <strong className="text-slate-800">{item.current_count}</strong> (frente a {item.previous_count} en el periodo previo) • Velocidad: <span className="font-mono">{item.velocity_score > 0 ? `+${item.velocity_score}` : item.velocity_score} arts/día</span>
                    </div>

                    {item.sample_headlines.length > 0 && (
                      <div className="text-xs text-slate-600 italic pt-1">
                        Titular de muestra: "{item.sample_headlines[0]}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="self-end md:self-auto text-right">
                  <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md border ${
                    isRising
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : isFalling
                      ? 'border-rose-200 bg-rose-50 text-rose-800'
                      : 'border-slate-200 bg-slate-100 text-slate-700'
                  }`}>
                    {item.trend_status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
