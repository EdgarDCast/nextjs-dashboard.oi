// app/dashboard/page.tsx
import { Suspense } from 'react';
import Cards from '@/app/dashboard/cards';
import RevenueChart from '@/app/dashboard/revenue-chart';
import LatestInvoices from '@/app/dashboard/latest-invoices';
import {
  CardsSkeleton,
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
} from '@/app/ui/skeletons';
import { sql } from '@/app/lib/db';

// --- (Opcional) TopCustomers como sub-componente async en esta misma página ---
async function TopCustomers() {
  const { rows: customers } = await sql<{
    id: string;
    name: string;
    email: string;
    image_url: string | null;
  }>`
    SELECT id, name, email, image_url
    FROM customers
    ORDER BY name ASC
    LIMIT 5;
  `;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Top 5 Customers</h1>
      <div className="overflow-x-auto">
        <table className="min-w-[480px] w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border-r">Name</th>
              <th className="text-left p-2 border-r">Email</th>
              <th className="text-left p-2">Avatar</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2 border-r">{c.name}</td>
                <td className="p-2 border-r">{c.email}</td>
                <td className="p-2">
                  {c.image_url ? (
                    // En Next/Image ponlo si quieres optimizar; aquí basta <img/>
                    <img
                      src={c.image_url}
                      alt={c.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// Skeleton muy simple para TopCustomers
function TopCustomersSkeleton() {
  return (
    <section>
      <div className="h-7 w-48 mb-4 rounded animate-pulse bg-gray-200" />
      <div className="border rounded">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 border-b last:border-0 animate-pulse bg-gray-100" />
        ))}
      </div>
    </section>
  );
}

export default async function DashboardPage() {
  return (
    <main className="p-6 space-y-6">
      {/* Cards */}
      <Suspense fallback={<CardsSkeleton />}>
        <Cards />
      </Suspense>

      {/* Revenue + Latest Invoices */}
      <section className="grid grid-cols-1 md:grid-cols-8 gap-6">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>

        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </section>

      {/* TopCustomers (opcional) */}
      <Suspense fallback={<TopCustomersSkeleton />}>
        <TopCustomers />
      </Suspense>
    </main>
  );
}
