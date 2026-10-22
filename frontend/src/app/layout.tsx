import '@/styles/globals.css';
import AppShell from '@/components/layout/AppShell';

export const metadata = {
  title: 'PRISMA - Radar de Medios & Cobertura Informativa',
  description: 'Observatorio dinámico y análisis de encuadres de 10 medios de comunicación nacionales e internacionales.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
