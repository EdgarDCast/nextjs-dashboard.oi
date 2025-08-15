// app/dashboard/layout.tsx
import SideNav from './sidenav';
import type { ReactNode } from 'react';

export const experimental_ppr = true;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      {/* Skip link (visible al enfocar con teclado) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to main content
      </a>

      {/* Menú lateral (landmark complementaria) */}
      <aside className="border-r bg-gray-50" aria-label="Primary sidebar">
        <SideNav />
      </aside>

      {/* Contenido de la página (destino del skip link) */}
      <main
        id="main-content"
        tabIndex={-1}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        {children}
      </main>
    </div>
  );
}
