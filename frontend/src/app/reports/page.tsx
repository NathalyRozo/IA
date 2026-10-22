'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Download, Plus, CheckCircle, Shield, ExternalLink, Calendar } from 'lucide-react';
import { fetchReports, createReport } from '@/lib/api';
import { ReportItem } from '@/lib/types';

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorNotes, setAuthorNotes] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-10-10');
  const [dateTo, setDateTo] = useState('2026-10-18');

  // Datos mock iniciales para permitir visualización inmediata
  const mockReport: ReportItem = {
    id: 1,
    title: 'Informe Preliminar: Tratamiento Informativo de Reformas Sociales y Económicas',
    description: 'Investigación comparativa sobre la cobertura del debate legislativo laboral y tributario en Colombia y medios internacionales.',
    date_from: '2026-10-10T00:00:00Z',
    date_to: '2026-10-18T23:59:59Z',
    sources_included: ['todos'],
    topics_included: ['Política', 'Economía'],
    empirical_data: {
      total_articles: 86,
      coverage_by_media: {
        'El Tiempo': 22,
        'El Espectador': 19,
        'RTVC Noticias': 16,
        'Reuters': 15,
        'The New York Times': 8,
        'El Heraldo': 6
      },
      coverage_by_topic: {
        'Economía': 48,
        'Política': 38
      },
      source_articles: [
        { title: 'Empresarios advierten freno a la contratación por nuevos costos de reforma laboral', media: 'El Tiempo', url: 'https://www.eltiempo.com', published_at: '2026-10-18 14:30' },
        { title: 'Congreso retoma debate de reforma laboral con acuerdos en recargo nocturno', media: 'El Espectador', url: 'https://www.elespectador.com', published_at: '2026-10-18 13:45' },
        { title: 'Trabajadores respaldan recuperación de la jornada nocturna desde las 7:00 p.m.', media: 'RTVC Noticias', url: 'https://rtvcnoticias.com', published_at: '2026-10-18 12:00' },
        { title: 'Colombia congress debates labor reform bill amid fiscal deficit scrutiny', media: 'Reuters', url: 'https://www.reuters.com', published_at: '2026-10-18 16:15' }
      ]
    },
    ai_interpretation_markdown: `### 3.1. Patrones de Atención en la Agenda
- **Tema predominante:** Economía y reformas estructurales concentraron el 55.8% del volumen total observado.
- **Encuadres identificados:** Los medios privados nacionales dieron preponderancia a la advertencia de costos para el sector empresarial, mientras que los medios públicos enfatizaron el bienestar de los trabajadores asalariados.
- **Perspectiva internacional:** Las agencias globales analizaron la coyuntura bajo el prisma del equilibrio macroeconómico y la confianza de los inversionistas extranjeros.

### 3.2. Diferencias en la Selección de Fuentes y Titulares
- Predominio de fuentes gremiales en titulares de medios corporativos.
- Predominio de voceros gubernamentales y sindicales en medios de servicio público.`,
    created_at: '2026-10-18T18:00:00Z'
  };

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await fetchReports();
      if (res && res.length > 0) {
        setReports(res);
        setSelectedReport(res[0]);
      } else {
        setReports([mockReport]);
        setSelectedReport(mockReport);
      }
    } catch {
      setReports([mockReport]);
      setSelectedReport(mockReport);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newRep = await createReport({
        title,
        description,
        author_notes: authorNotes,
        date_from: new Date(dateFrom).toISOString(),
        date_to: new Date(dateTo).toISOString(),
      });
      setReports([newRep, ...reports]);
      setSelectedReport(newRep);
      setIsCreating(false);
      setTitle('');
      setDescription('');
    } catch {
      // Mock creation
      const createdMock: ReportItem = {
        ...mockReport,
        id: Date.now(),
        title,
        description,
        created_at: new Date().toISOString()
      };
      setReports([createdMock, ...reports]);
      setSelectedReport(createdMock);
      setIsCreating(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!selectedReport) return;
    const blob = new Blob([selectedReport.ai_interpretation_markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `informe_mediatrix_${selectedReport.id}.md`;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
            <FileText className="w-4 h-4" />
            <span>Función 5: Informes para Periodismo e Investigación</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Generación de Informes de Análisis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Produce informes organizados con clara separación entre datos empíricos brutos e interpretaciones de IA.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cancelar' : 'Nuevo Informe'}</span>
        </button>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl border border-sky-200 shadow-md space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Configurar Nueva Investigación</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Título del Informe</label>
              <input
                required
                type="text"
                placeholder="Ej. Cobertura de la Cumbre Climática en Medios Nacionales"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Fecha Inicial</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Fecha Final</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Objetivo / Descripción del Estudio</label>
            <textarea
              rows={2}
              placeholder="Describa el propósito de la investigación..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Notas de Campo del Investigador (Opcional)</label>
            <input
              type="text"
              placeholder="Anotaciones metodológicas o hipótesis a contrastar..."
              value={authorNotes}
              onChange={(e) => setAuthorNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              {loading ? 'Generando Informe...' : 'Compilar Informe'}
            </button>
          </div>
        </form>
      )}

      {/* Main Report View */}
      {selectedReport ? (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Generado el {new Date(selectedReport.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>Periodo: {new Date(selectedReport.date_from).toLocaleDateString()} a {new Date(selectedReport.date_to).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {selectedReport.title}
              </h2>
              {selectedReport.description && (
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedReport.description}</p>
              )}
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition self-start md:self-auto flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Exportar en Markdown (.md)</span>
            </button>
          </div>

          {/* BLOCK A: EMPIRICAL EVIDENCE */}
          <div className="bg-white rounded-xl border-2 border-emerald-500/30 shadow-sm overflow-hidden">
            <div className="bg-emerald-50/70 border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>BLOQUE A: EVIDENCIA EMPÍRICA Y REGISTRO DE FUENTES</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                Datos Primarios Verificables
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Quant Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Noticias Muestreadas</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{selectedReport.empirical_data.total_articles}</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Medios con Cobertura</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{Object.keys(selectedReport.empirical_data.coverage_by_media).length} / 10</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Tema Dominante</div>
                  <div className="text-xl font-bold text-emerald-700 mt-1">Economía</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Marco Temporal</div>
                  <div className="text-sm font-semibold text-slate-800 mt-2">8 Días observados</div>
                </div>
              </div>

              {/* Source Articles with direct links */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Registro de Noticias y Enlaces Directos a los Medios:
                </h4>
                <div className="space-y-2">
                  {selectedReport.empirical_data.source_articles.map((art, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {art.media}
                        </span>
                        <span className="text-slate-800 font-medium">"{art.title}"</span>
                      </div>
                      <a
                        href={art.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 hover:text-sky-800 flex items-center gap-1 font-semibold flex-shrink-0"
                      >
                        <span>Fuente original</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK B: AI-ASSISTED INTERPRETATION */}
          <div className="bg-white rounded-xl border-2 border-sky-500/30 shadow-sm overflow-hidden">
            <div className="bg-sky-50/70 border-b border-sky-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sky-950 text-sm">
                <Shield className="w-4 h-4 text-sky-600" />
                <span>BLOQUE B: INTERPRETACIÓN Y SÍNTESIS ASISTIDA POR IA</span>
              </div>
              <span className="text-[11px] font-semibold text-sky-800 bg-sky-100/70 px-2.5 py-0.5 rounded-full">
                Análisis Heurístico del Discurso
              </span>
            </div>

            <div className="p-6">
              <div className="prose prose-sm max-w-none text-slate-700 space-y-4">
                <div className="p-4 rounded-lg bg-sky-50/50 border border-sky-100 text-xs text-sky-900 mb-4">
                  <strong>Aviso deontológico:</strong> Los patrones de encuadre presentados a continuación se infieren mediante modelos de procesamiento de lenguaje natural y deben ser validados por el criterio profesional del investigador.
                </div>

                <div className="text-sm whitespace-pre-line leading-relaxed">
                  {selectedReport.ai_interpretation_markdown}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-10 text-center text-slate-400">
          No hay informes generados actualmente.
        </div>
      )}
    </div>
  );
}
