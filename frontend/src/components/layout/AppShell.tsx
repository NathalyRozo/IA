'use client';

import React from 'react';

export default function AppShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased font-sans">
      {children}
    </div>
  );
}
