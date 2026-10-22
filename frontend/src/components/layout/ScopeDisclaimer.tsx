'use client';

import React, { useState } from 'react';
import { ShieldAlert, Info, X, ChevronRight } from 'lucide-react';

export default function ScopeDisclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Aviso Metodológico y Deontológico:</strong> Este observatorio compara patrones de atención y encuadres informativos de 10 medios. No califica veracidad ni mide la opinión pública ciudadana.
            </span>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="text-amber-700 font-semibold underline hover:text-amber-900 flex items-center gap-1 flex-shrink-0"
          >
            Ver límites de alcance <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base">
                <Info className="w-5 h-5 text-sky-400" />
                <span>Principios Metodológicos y Límites de Alcance</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-slate-700 max-h-[75vh] overflow-y-auto">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-1">1. No determina automáticamente si una noticia es verdadera o falsa</h4>
                <p className="text-xs text-slate-600">
                  La aplicación analiza contenidos, compara enfoques y mide patrones de cobertura, pero no realiza verificación periodística exhaustiva. Determinar la veracidad exige contrastar fuentes directas y evidencias forenses.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-1">2. No mide directamente la opinión pública</h4>
                <p className="text-xs text-slate-600">
                  La frecuencia con la que los medios publican sobre un tema refleja las prioridades de las salas de redacción (agenda mediática), no lo que piensa la ciudadanía. Para evaluar la opinión pública es imperativo acudir a encuestas y estudios de audiencia.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-1">3. No incluye todos los medios ni todo el internet</h4>
                <p className="text-xs text-slate-600">
                  El análisis se circunscribe a 10 medios de referencia: 5 nacionales (El Espectador, RTVC Noticias, El Tiempo, El Heraldo, El Colombiano) y 5 internacionales (Reuters, BBC News, Associated Press, AFP, The New York Times).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-1">4. No reemplaza el criterio del periodista</h4>
                <p className="text-xs text-slate-600">
                  Los resultados arrojados por los modelos de PLN son herramientas de asistencia al análisis heurístico, nunca un sustituto del juicio crítico profesional y académico.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-1">5. No redacta ni reescribe noticias para su publicación</h4>
                <p className="text-xs text-slate-600">
                  El propósito es puramente investigativo. Genera resúmenes analíticos de encuadres y divergencias, pero no produce noticias sintéticas ni altera los contenidos originales.
                </p>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
