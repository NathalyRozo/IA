'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/components/Dashboard';
import { fetchDailyCache, triggerDailyUpdate } from '@/lib/api';

export default function HomePage() {
  // 1. Estados de Navegación y Filtros
  const [currentView, setCurrentView] = useState<'inicio' | 'cobertura' | 'contraste' | 'tendencias' | 'informes' | 'favoritos' | 'enfoque'>('inicio');
  const [activeScope, setActiveScope] = useState<'all' | 'nacional' | 'internacional'>('nacional');
  const [activeTopic, setActiveTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 2. Estados de Interfaz y Datos
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // 3. Carga Inicial de Caché de Datos
  const loadArticles = useCallback(async () => {
    try {
      const data = await fetchDailyCache();
      if (data?.feed?.all_articles?.length) {
        setArticles(data.feed.all_articles);
      }
    } catch (e) {
      // Respaldo de carga directa si fetchDailyCache falla
      try {
        const res = await fetch('/data/daily_cache.json');
        if (res.ok) {
          const d = await res.json();
          if (d?.feed?.all_articles?.length) {
            setArticles(d.feed.all_articles);
          }
        }
      } catch (err) {
        console.warn('No se pudo cargar la caché local:', err);
      }
    }
  }, []);

  useEffect(() => {
    loadArticles();

    // Recuperar favoritos de localStorage
    try {
      const saved = localStorage.getItem('foque_favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Error leyendo localStorage:', e);
    }
  }, [loadArticles]);

  // 4. Función de Sincronización con Gemini (Botón SINCRONIZAR GEMINI)
  const handleSyncGemini = async () => {
    setIsSyncing(true);
    showToast('Sincronizando noticias de los 10 medios con Gemini 3.5...');
    try {
      await triggerDailyUpdate(true);
      await loadArticles();
      showToast('Caché de noticias actualizada con éxito.');
    } catch (e) {
      // Si la API backend no está disponible localmente, recargar caché estática
      await loadArticles();
      showToast('Caché de noticias recargada correctamente.');
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
      }, 1000);
    }
  };

  // 5. Gestión de Favoritos
  const toggleFavorite = (article: any) => {
    if (!article) return;
    const exists = favorites.some((f) => f.id === article.id);
    let updated: any[];
    if (exists) {
      updated = favorites.filter((f) => f.id !== article.id);
      showToast('Artículo eliminado de Favoritos.');
    } else {
      updated = [...favorites, article];
      showToast('Artículo guardado en Favoritos.');
    }
    setFavorites(updated);
    try {
      localStorage.setItem('foque_favorites', JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <>
      <MainLayout
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v as any)}
        activeScope={activeScope}
        onScopeChange={setActiveScope}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSyncing={isSyncing}
        onSyncGemini={handleSyncGemini}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        favoritesCount={favorites.length}
        selectedArticleModal={selectedArticle}
        onCloseArticleModal={() => setSelectedArticle(null)}
        isDisclaimerOpen={isDisclaimerOpen}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onCloseDisclaimer={() => setIsDisclaimerOpen(false)}
        isFavoriteArticle={selectedArticle ? favorites.some((f) => f.id === selectedArticle.id) : false}
        onToggleFavorite={toggleFavorite}
      >
        <Dashboard
          currentView={currentView}
          activeScope={activeScope}
          activeTopic={activeTopic}
          onTopicChange={setActiveTopic}
          searchQuery={searchQuery}
          onNavigate={(v) => setCurrentView(v as any)}
          onSelectArticle={(art) => setSelectedArticle(art)}
          articles={articles}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
          onSyncGemini={handleSyncGemini}
          isSyncing={isSyncing}
        />
      </MainLayout>

      {/* Notificación Toast Flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-950 border border-yellow-400 text-yellow-400 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
