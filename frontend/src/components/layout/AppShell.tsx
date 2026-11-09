'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/components/Dashboard';

export default function AppShell({ children }: { children?: React.ReactNode }) {
  const [currentView, setCurrentView] = useState('inicio');
  const [territory, setTerritory] = useState<'all' | 'nacional' | 'internacional'>('nacional');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <MainLayout
      activeView={currentView}
      onViewChange={setCurrentView}
      selectedTerritory={territory}
      onTerritoryChange={setTerritory}
      onSearchChange={setSearchQuery}
    >
      <Dashboard
        currentView={currentView}
        selectedTerritory={territory}
        searchQuery={searchQuery}
        onNavigate={setCurrentView}
      />
      {children}
    </MainLayout>
  );
}
