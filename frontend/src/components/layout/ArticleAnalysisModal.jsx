'use client';

import React, { useState } from 'react';

export default function ArticleAnalysisModal({
  article,
  isOpen,
  onClose,
  isFavorite = false,
  onToggleFavorite,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  const pubDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Fecha reciente';

  const apaCitation = `${article.source_name || 'Medio'}. (${pubDate}). ${article.title || 'Sin título'}. ${article.url || ''}`;

  const handleCopyCitation = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(apaCitation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
                {article.source_name || 'Medio de Comunicación'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold uppercase">
                {article.source_scope || 'Nacional'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-yellow-400 text-[10px] font-semibold uppercase">
                {article.category || 'General'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {pubDate}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white mt-2 leading-snug">
              {article.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            title="Cerrar ventana"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body Modal / Desglose de Análisis de Gemini */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300">
          {/* Bloque 1: Encuadre Editorial (Framing) */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 mb-1.5 text-yellow-400 font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              <span>Encuadre Editorial (Framing Detectado por Gemini 3.5)</span>
            </div>
            <p className="text-slate-200 text-xs md:text-sm leading-relaxed">
              {article.narrative_angle || 'Perspectiva estructurada de cobertura: jerarquización informativa orientada a la evolución institucional y repercusiones sectoriales.'}
            </p>
          </div>

          {/* Bloque 2: Matriz de Tono y Aspectos Destacados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-[11px] uppercase font-bold">
                <span className="material-symbols-outlined text-[16px] text-pink-400">tune</span>
                <span>Tono del Discurso</span>
              </div>
              <p className="text-xs font-semibold text-slate-200 uppercase">
                {article.tone || 'Neutro / Informativo'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-[11px] uppercase font-bold">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
                <span>Aspectos Resaltados</span>
              </div>
              <p className="text-xs text-slate-300">
                {article.highlighted_aspects || 'Hechos empíricos, posturas oficiales y contraste de actores.'}
              </p>
            </div>
          </div>

          {/* Bloque 3: Resumen o Extracto Empírico */}
          {article.excerpt && (
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Extracto / Síntesis Empírica
              </span>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{article.excerpt}"
              </p>
            </div>
          )}

          {/* Bloque 4: Cita Académica APA 7 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase font-bold text-slate-300 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-yellow-400 text-[16px]">menu_book</span>
                Cita Bibliográfica (Norma APA 7ma Edición)
              </span>
              <button
                type="button"
                onClick={handleCopyCitation}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-yellow-400 text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? '¡Copiada!' : 'Copiar Cita'}</span>
              </button>
            </div>
            <p className="text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 select-all break-all">
              {apaCitation}
            </p>
          </div>
        </div>

        {/* Footer Modal con Acciones */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(article)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-pink-500 text-white shadow-[0_0_12px_rgba(236,72,153,0.4)]'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isFavorite ? 'bookmark_added' : 'bookmark_add'}
                </span>
                <span>{isFavorite ? 'En Favoritos' : 'Guardar en Favoritos'}</span>
              </button>
            )}

            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                <span>Ver Noticia Original</span>
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold uppercase transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
