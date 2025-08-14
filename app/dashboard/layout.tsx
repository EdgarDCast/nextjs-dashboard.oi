import SideNav from './sidenav';
export const experimental_ppr = true;
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      {/* Menú lateral */}
      <aside className="border-r bg-gray-50">
        <SideNav />
      </aside>

      {/* Contenido de la página */}
      <main>{children}</main>
    </div>
  );
}
