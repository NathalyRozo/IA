'use client';

import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import ArticleAnalysisModal from '@/components/layout/ArticleAnalysisModal';
import ScopeDisclaimer from '@/components/layout/ScopeDisclaimer';

export interface MainLayoutProps {
  children?: React.ReactNode;
  currentView?: string;
  onSelectView?: (view: string) => void;
  // Soportar también alias activos
  activeView?: string;
  onViewChange?: (view: string) => void;
  activeScope?: 'all' | 'nacional' | 'internacional';
  onScopeChange?: (scope: 'all' | 'nacional' | 'internacional') => void;
  selectedTerritory?: 'all' | 'nacional' | 'internacional';
  onTerritoryChange?: (scope: 'all' | 'nacional' | 'internacional') => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isSyncing?: boolean;
  onSyncGemini?: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  favoritesCount?: number;
  selectedArticleModal?: any;
  onCloseArticleModal?: () => void;
  isDisclaimerOpen?: boolean;
  onOpenDisclaimer?: () => void;
  onCloseDisclaimer?: () => void;
  isFavoriteArticle?: boolean;
  onToggleFavorite?: (article: any) => void;
}

export default function MainLayout({
  children,
  currentView = 'inicio',
  onSelectView,
  activeView,
  onViewChange,
  activeScope = 'nacional',
  onScopeChange,
  selectedTerritory,
  onTerritoryChange,
  searchQuery = '',
  onSearchChange,
  isSyncing = false,
  onSyncGemini,
  isSidebarOpen = true,
  onToggleSidebar,
  favoritesCount = 0,
  selectedArticleModal = null,
  onCloseArticleModal,
  isDisclaimerOpen = false,
  onOpenDisclaimer,
  onCloseDisclaimer,
  isFavoriteArticle = false,
  onToggleFavorite,
}: MainLayoutProps) {
  // Manejo de compatibilidad entre props con nombres alternativos
  const effectiveView = activeView || currentView;
  const effectiveOnSelectView = onViewChange || onSelectView;
  const effectiveScope = selectedTerritory || activeScope;
  const effectiveOnScopeChange = onTerritoryChange || onScopeChange;

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans antialiased overflow-hidden">
      {/* 1. SIDEBAR COLAPSABLE CON ONCLICK REACTIVADO */}
      <Sidebar
        currentView={effectiveView}
        onSelectView={effectiveOnSelectView}
        isCollapsed={!isSidebarOpen}
        onToggleCollapse={onToggleSidebar}
        onOpenDisclaimer={onOpenDisclaimer}
        favoritesCount={favoritesCount}
      />

      {/* 2. ÁREA DE CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
        {/* HEADER NAVBAR */}
        <Navbar
          activeScope={effectiveScope}
          onScopeChange={effectiveOnScopeChange}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          isSyncing={isSyncing}
          onSyncGemini={onSyncGemini}
          onToggleSidebar={onToggleSidebar}
          onOpenDisclaimer={onOpenDisclaimer}
        />

        {/* CONTENEDOR PRINCIPAL */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900">
          {children}
        </main>
      </div>

      {/* 3. MODAL DE DESGLOSE DE ANÁLISIS DE GEMINI 3.5 */}
      {selectedArticleModal && (
        <ArticleAnalysisModal
          article={selectedArticleModal}
          isOpen={Boolean(selectedArticleModal)}
          onClose={onCloseArticleModal || (() => {})}
          isFavorite={isFavoriteArticle}
          onToggleFavorite={onToggleFavorite}
        />
      )}

      {/* 4. MODAL DE ENFOQUE CRÍTICO / LÍMITES ÉTICOS */}
      <ScopeDisclaimer
        isOpen={Boolean(isDisclaimerOpen)}
        onClose={onCloseDisclaimer || (() => {})}
      />
    </div>
  );
}
