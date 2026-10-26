'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import ScopeDisclaimer from '@/components/layout/ScopeDisclaimer';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  return (
    <div className="bg-surface-container-lowest min-h-screen text-on-surface antialiased font-body-md">
      {/* Sidebar Navigation */}
      <Sidebar onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />

      {/* Main Content Area */}
      <div className="pl-72 flex flex-col min-h-screen">
        <Navbar onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />
        <main className="relative pt-20 w-full px-space-lg bg-surface-container-lowest min-h-screen">
          {children}
        </main>
      </div>

      {/* Scope Disclaimer / PRD Ethics Modal */}
      <ScopeDisclaimer 
        isOpen={isDisclaimerOpen} 
        onClose={() => setIsDisclaimerOpen(false)} 
      />
    </div>
  );
}
