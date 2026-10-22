'use client';

import React, { useEffect, useState } from 'react';
import { SplitSquareVertical, ExternalLink, Sparkles, AlertCircle, Bookmark } from 'lucide-react';
import { fetchEventsForContrast, fetchEventContrast } from '@/lib/api';
import { EventContrast } from '@/lib/types';

export default function ContrastPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(1);
  const [contrastData, setContrastData] = useState<EventContrast | null>(null);
  const [loading, setLoading] = useState(false);

  // Datos mock por defecto para garantizar funcionamiento inmediato si el backend está desconectado
  const defaultContrast: EventContrast = {
    event_id: 1,
    canonical_title: 'Debate y votación del proyecto de reforma laboral en el Congreso',
    topic: 'Política',
    total_coverage_count: 4,
    comparison_items: [
      {
        media_name: 'El Tiempo',
        media_scope: 'nacional',
        headline: 'Empresarios advierten freno a la contratación por nuevos costos de reforma laboral',
        published_at: '2026-10-18T14:30:00Z',
        url: 'https://www.eltiempo.com',
        narrative_angle: 'Impacto fiscal y costo de nómina para empresarios',
        tone: 'Crítico',
        highlighted_aspects: ['Costos de recargos nocturnos', 'Riesgo de informalidad', 'Advertencias de gremios'],
        omitted_aspects: ['Estándares internacionales de la OIT', 'Testimonios de centrales obreras']
      },
      {
        media_name: 'El Espectador',
        media_scope: 'nacional',
        headline: 'Congreso retoma debate de reforma laboral con acuerdos en recargo nocturno',
        published_at: '2026-10-18T13:45:00Z',
        url: 'https://www.elespectador.com',
        narrative_angle: 'Trámite parlamentario y búsqueda de consensos',
        tone: 'Institucional',
        highlighted_aspects: ['Votaciones de bancadas independientes', 'Puntos de concertación'],
        omitted_aspects: ['Impacto detallado en PYMES regionales']
      },
      {
        media_name: 'RTVC Noticias',
        media_scope: 'nacional',
        headline: 'Trabajadores respaldan recuperación de la jornada nocturna desde las 7:00 p.m.',
        published_at: '2026-10-18T12:00:00Z',
        url: 'https://rtvcnoticias.com',
        narrative_angle: 'Reivindicación de derechos y justicia social',
        tone: 'Optimista',
        highlighted_aspects: ['Restitución de derechos históricos', 'Voz de los sindicatos'],
        omitted_aspects: ['Postura de los gremios comerciales e industriales']
      },
      {
        media_name: 'Reuters',
        media_scope: 'internacional',
        headline: 'Colombia congress debates labor reform bill amid fiscal deficit scrutiny',
        published_at: '2026-10-18T16:15:00Z',
        url: 'https://www.reuters.com',
        narrative_angle: 'Riesgo soberano y estabilidad macroeconómica',
        tone: 'Neutro',
        highlighted_aspects: ['Reacción de mercados y tasa de cambio', 'Metas fiscales del gobierno'],
        omitted_aspects: ['Tensión política partidista interna']
      }
    ],
    ai_comparative_synthesis: {
      overview: 'El Congreso de Colombia somete a votación los artículos neurálgicos de la reforma laboral. La cobertura muestra una profunda polarización en la jerarquización del hecho.',
      outlet_frames: {
        'El Tiempo': { angle: 'Económico / Empresarial', tone: 'Crítico', highlighted: ['Costos laborales'], omitted: ['Garantías sociales'] },
        'El Espectador': { angle: 'Institucional / Legislativo', tone: 'Neutro', highlighted: ['Votación de artículos'], omitted: ['Efectos a largo plazo'] },
        'RTVC Noticias': { angle: 'Social / Gubernamental', tone: 'Favorable', highlighted: ['Justicia social'], omitted: ['Objeciones gremiales'] },
        'Reuters': { angle: 'Mercados / Macroeconomía', tone: 'Técnico', highlighted: ['Déficit e inversión'], omitted: ['Detalles del articulado'] }
      },
      divergencias: [
        'El Tiempo y Reuters enfocan el hecho desde los riesgos de inversión y la carga sobre el sector productivo.',
        'RTVC Noticias centra la narrativa en la justicia social y el cumplimiento del mandato popular.',
        'El Espectador mantiene un encuadre procedural enfocado en las dinámicas de votación del Congreso.'
      ]
    },
    methodological_disclaimer: 'Este análisis contrasta enfoques editoriales y selección temática. No califica la veracidad de los hechos.'
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadContrast(selectedEventId);
    }
  }, [selectedEventId]);

  const loadEvents = async () => {
    try {
      const res = await fetchEventsForContrast();
      if (res && res.length > 0) {
        setEvents(res);
        setSelectedEventId(res[0].id);
      }
    } catch {
      // Backend desconectado
      setEvents([
        { id: 1, canonical_title: 'Debate de reforma laboral en el Congreso', topic: 'Política' },
        { id: 2, canonical_title: 'Cumbre sobre transición energética y petróleo', topic: 'Economía' }
      ]);
    }
  };

  const loadContrast = async (id: number) => {
    try {
      setLoading(true);
      const res = await fetchEventContrast(id);
      setContrastData(res);
    } catch {
      setContrastData(defaultContrast);
    } finally {
      setLoading(false);
    }
  };

  const current = contrastData || defaultContrast;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
          <SplitSquareVertical className="w-4 h-4" />
          <span>Función 3: Análisis Comparativo</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Contraste de Información entre Medios
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Visualiza los titulares de diferentes medios frente a un mismo acontecimiento y compara enfoques, aspectos destacados y omisiones.
        </p>
      </div>

      {/* Event Selector Pill Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Bookmark className="w-4 h-4 text-sky-600" />
          <span>Seleccionar Acontecimiento para Contrastar:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {events.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedEventId === ev.id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {ev.canonical_title.slice(0, 45)}...
            </button>
          ))}
        </div>
      </div>

      {/* AI Synthesis Box */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-900 rounded-xl p-6 text-white border border-sky-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Síntesis Comparativa de Enfoques (Asistida por PLN / IA)</span>
          </div>
          <span className="text-[11px] font-mono bg-sky-900/60 px-2 py-0.5 rounded border border-sky-700 text-sky-300">
            {current.total_coverage_count} medios contrastados
          </span>
        </div>

        <p className="text-slate-200 text-sm leading-relaxed">
          {current.ai_comparative_synthesis?.overview}
        </p>

        <div className="border-t border-slate-800 pt-3">
          <div className="text-xs font-semibold text-sky-300 uppercase tracking-wider mb-2">
            Principales Divergencias en el Tratamiento Informativo:
          </div>
          <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
            {current.ai_comparative_synthesis?.divergences?.map((div: string, idx: number) => (
              <li key={idx} className="leading-relaxed">{div}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Side-by-Side Headline Cards Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Titulares y Encuadres Paralelos
          </h2>
          <span className="text-xs text-slate-500">
            Comparativa lado a lado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {current.comparison_items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-sky-400 transition"
            >
              <div className="space-y-3">
                {/* Media header */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{item.media_name}</span>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                    item.media_scope === 'nacional' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {item.media_scope}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-sm font-semibold text-slate-800 leading-snug">
                  "{item.headline}"
                </h3>

                {/* Narrative Angle Tag */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Enfoque Narrativo</div>
                  <div className="text-xs font-medium text-slate-800">{item.narrative_angle}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Tono: <span className="font-semibold text-slate-700">{item.tone}</span>
                  </div>
                </div>

                {/* Highlighted Aspects */}
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-emerald-700 uppercase">Aspectos que Destaca</div>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    {item.highlighted_aspects.map((h, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Omitted Aspects */}
                {item.omitted_aspects.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="text-[11px] font-semibold text-rose-700 uppercase">Aspectos Omitidos</div>
                    <ul className="text-xs text-slate-500 space-y-0.5">
                      {item.omitted_aspects.map((o, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Original Link */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400 text-[11px]">
                  {new Date(item.published_at).toLocaleDateString()}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:text-sky-800 flex items-center gap-1 font-semibold"
                >
                  <span>Ver noticia</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
