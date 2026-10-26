import '@/styles/globals.css';
import AppShell from '@/components/layout/AppShell';

export const metadata = {
  title: 'FOQUÉ - Tu radar de noticias & agenda setting',
  description: 'Observatorio de cobertura y contraste de encuadres mediáticos en 10 medios de Colombia y el mundo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-surface-container-lowest font-body-md text-on-surface antialiased min-h-screen">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
