'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, PieChart, Layers, Calendar, AlertCircle } from 'lucide-react';
import { fetchCoverageOverview } from '@/lib/api';
import { CoverageOverview } from '@/lib/types';

export default function CoveragePage() {
  const [data, setData] = useState<CoverageOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData(days);
  }, [days]);

  const loadData = async (selectedDays: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchCoverageOverview(selectedDays);
      setData(res);
    } catch (err: any) {
      setError('No se pudo conectar con el servidor backend (asegúrate de que FastAPI esté ejecutándose en el puerto 8000). Mostrando interfaz con estructura de datos.');
    } finally {
      setLoading(false);
    }
  };

  const topicEntries = data ? Object.entries(data.coverage_by_topic) : [
    ['Política', 42],
    ['Economía', 35],
    ['Sociedad', 28],
    ['Conflicto y Paz', 19],
    ['Internacional', 16],
    ['Salud', 9],
    ['Medio Ambiente', 7],
    ['Deportes', 5],
  ];

  const totalArticles = data ? data.total_articles : 161;
  const maxTopicCount = Math.max(...topicEntries.map(([_, count]) => count), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Función 2: Análisis de Agenda</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Medición de la Cobertura Mediática
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Calcula la cantidad de publicaciones que recibe cada tema e identifica cuáles concentran mayor y menor atención.
          </p>
        </div>

        {/* Time Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-md transition ${
                days === d ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Últimos {d} días
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Noticias Procesadas</div>
          <div className="text-3xl font-black text-slate-900 mt-2">{totalArticles}</div>
          <div className="text-xs text-slate-400 mt-1">En los 10 medios de referencia</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tema de Mayor Concentración</div>
          <div className="text-3xl font-black text-sky-600 mt-2">{topicEntries[0]?.[0] || 'Política'}</div>
          <div className="text-xs text-slate-400 mt-1">
            {topicEntries[0] ? `${topicEntries[0][1]} publicaciones (${Math.round((topicEntries[0][1] / totalArticles) * 100)}%)` : ''}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tema con Menor Presencia</div>
          <div className="text-3xl font-black text-slate-700 mt-2">
            {topicEntries[topicEntries.length - 1]?.[0] || 'Cultura'}
          </div>
          <div className="text-xs text-slate-400 mt-1">Subrepresentado en la agenda mediática</div>
        </div>
      </div>

      {/* Distribution by Topic Chart (Interactive Bar Visualization) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-600" />
            Distribución de la Atención Mediática por Tema
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Frecuencia absoluta y porcentaje relativo de noticias dedicadas a cada categoría informativa.
          </p>
        </div>

        <div className="space-y-3.5 pt-2">
          {topicEntries.map(([topic, count]) => {
            const percentage = Math.round((count / totalArticles) * 100);
            const barWidth = `${Math.max((count / maxTopicCount) * 100, 3)}%`;

            return (
              <div key={topic} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-800 font-semibold">{topic}</span>
                  <span className="text-slate-500">
                    {count} noticias <span className="text-slate-400">({percentage}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full transition-all duration-500"
                    style={{ width: barWidth }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outlets Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-slate-700" />
            Desglose de Cobertura por Sala de Redacción
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparativa de prioridades temáticas entre medios nacionales e internacionales.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Medio de Comunicación</th>
                <th className="px-6 py-3.5">Alcance</th>
                <th className="px-6 py-3.5 text-center">Volumen de Noticias</th>
                <th className="px-6 py-3.5">Temas Principales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(data?.media_breakdown || [
                { source_name: 'El Tiempo', scope: 'nacional', total_articles: 26, top_topics: [{ topic: 'Economía', share_percentage: 38 }, { topic: 'Política', share_percentage: 30 }] },
                { source_name: 'El Espectador', scope: 'nacional', total_articles: 24, top_topics: [{ topic: 'Política', share_percentage: 45 }, { topic: 'Conflicto y Paz', share_percentage: 25 }] },
                { source_name: 'RTVC Noticias', scope: 'nacional', total_articles: 21, top_topics: [{ topic: 'Sociedad', share_percentage: 40 }, { topic: 'Política', share_percentage: 35 }] },
                { source_name: 'El Heraldo', scope: 'nacional', total_articles: 18, top_topics: [{ topic: 'Economía', share_percentage: 33 }, { topic: 'Sociedad', share_percentage: 28 }] },
                { source_name: 'El Colombiano', scope: 'nacional', total_articles: 19, top_topics: [{ topic: 'Conflicto y Paz', share_percentage: 42 }, { topic: 'Política', share_percentage: 26 }] },
                { source_name: 'Reuters', scope: 'internacional', total_articles: 15, top_topics: [{ topic: 'Economía', share_percentage: 60 }, { topic: 'Internacional', share_percentage: 20 }] },
                { source_name: 'BBC News (Mundo)', scope: 'internacional', total_articles: 14, top_topics: [{ topic: 'Medio Ambiente', share_percentage: 35 }, { topic: 'Internacional', share_percentage: 35 }] },
                { source_name: 'Associated Press (AP)', scope: 'internacional', total_articles: 12, top_topics: [{ topic: 'Internacional', share_percentage: 50 }, { topic: 'Economía', share_percentage: 25 }] },
                { source_name: 'AFP', scope: 'internacional', total_articles: 11, top_topics: [{ topic: 'Salud', share_percentage: 36 }, { topic: 'Internacional', share_percentage: 27 }] },
                { source_name: 'The New York Times', scope: 'internacional', total_articles: 10, top_topics: [{ topic: 'Internacional', share_percentage: 60 }, { topic: 'Política', share_percentage: 20 }] },
              ]).map((m: any) => (
                <tr key={m.source_name} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900">{m.source_name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${
                      m.scope === 'nacional' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-sky-50 text-sky-800 border border-sky-200'
                    }`}>
                      {m.scope}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-800">{m.total_articles}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {m.top_topics.map((t: any) => (
                        <span key={t.topic} className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">
                          {t.topic} ({t.share_percentage}%)
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
