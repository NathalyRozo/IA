'use client';

import React from 'react';

interface ScopeDisclaimerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScopeDisclaimer({ isOpen, onClose }: ScopeDisclaimerProps) {
  if (!isOpen) return null;

  const limits = [
    {
      title: 'No determina si una noticia es verdadera o falsa',
      desc: 'Analiza contenidos, frecuencias y encuadres discursivos (framing), no es un verificador forense de hechos.',
      icon: 'gavel',
      color: 'text-secondary-container',
      border: 'border-secondary-container/30',
      bg: 'bg-secondary-container/10'
    },
    {
      title: 'No mide directamente la opinión pública',
      desc: 'La frecuencia de publicación refleja la agenda editorial de los medios (media agenda setting), no el sentir ciudadano ni las audiencias.',
      icon: 'groups',
      color: 'text-tertiary-container',
      border: 'border-tertiary-container/30',
      bg: 'bg-tertiary-container/10'
    },
    {
      title: 'No abarca la totalidad de internet',
      desc: 'Se limita estrictamente a los 10 medios seleccionados (5 nacionales y 5 internacionales) para garantizar rigurosidad y estabilidad jurídica.',
      icon: 'language',
      color: 'text-primary-fixed',
      border: 'border-primary-fixed/30',
      bg: 'bg-primary-fixed/10'
    },
    {
      title: 'No sustituye el juicio del periodista',
      desc: 'Funciona como un instrumento de inteligencia asistida y síntesis crítica. El criterio editorial y la comprobación final pertenecen a la persona comunicadora.',
      icon: 'psychology',
      color: 'text-primary',
      border: 'border-outline-variant',
      bg: 'bg-surface-container-high'
    },
    {
      title: 'No redacta ni reescribe noticias para publicación',
      desc: 'No genera notas informativas sintéticas ni altera los textos originales; únicamente resume encuadres, citas y sesgos para facilitar la comparación.',
      icon: 'edit_off',
      color: 'text-secondary-fixed',
      border: 'border-secondary-fixed/30',
      bg: 'bg-secondary-fixed/10'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface-container rounded-2xl max-w-2xl w-full border border-outline-variant shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-space-lg bg-surface-container-low border-b border-outline-variant/50 flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary-fixed text-[26px]">verified_user</span>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
                Límites de Alcance y Principios Éticos
              </h2>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Qué NO hace FOQUÉ y por qué metodológicamente
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body list */}
        <div className="p-space-lg overflow-y-auto space-y-space-md">
          {limits.map((limit, idx) => (
            <div key={idx} className={`p-space-md rounded-xl ${limit.bg} border ${limit.border} flex items-start gap-space-md`}>
              <div className={`p-2 rounded-lg bg-surface-container-lowest shrink-0 ${limit.color}`}>
                <span className="material-symbols-outlined text-[20px]">{limit.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className={`font-label-md text-label-md font-bold uppercase tracking-wide mb-1 ${limit.color}`}>
                  {limit.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {limit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-space-md bg-surface-container-low border-t border-outline-variant/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-space-lg py-space-xs rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md uppercase font-bold shadow-[0_0_12px_rgba(253,228,0,0.35)] hover:scale-105 transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
