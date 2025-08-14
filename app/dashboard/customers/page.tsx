import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-600">
        Página de ejemplo del curso. Desde aquí luego conectaremos la base de datos.
      </p>

      <nav className="space-x-3">
        <Link className="px-3 py-2 rounded bg-gray-200" href="/invoices">Invoices</Link>
        <Link className="px-3 py-2 rounded bg-gray-200" href="/customers">Customers</Link>
      </nav>
    </main>
  );
}
