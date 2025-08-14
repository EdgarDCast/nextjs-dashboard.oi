// app/dashboard/page.tsx
import { sql } from '@/app/lib/db';
import Cards from '@/app/dashboard/cards';
import RevenueChart from '@/app/dashboard/revenue-chart';
import LatestInvoices from '@/app/dashboard/latest-invoices';
import { formatCurrency } from '@/app/lib/utils';
import type { Revenue as RevenueType, LatestInvoice as LatestInvoiceType } from '@/app/lib/definitions';

export default async function DashboardPage() {
  // Cards (conteos)
  const { rows: totalPaidInvoices } = await sql<{ count: number }>`
    SELECT COUNT(*)::int AS count FROM invoices WHERE status = 'paid';
  `;
  const { rows: totalPendingInvoices } = await sql<{ count: number }>`
    SELECT COUNT(*)::int AS count FROM invoices WHERE status = 'pending';
  `;
  const { rows: numberOfInvoices } = await sql<{ count: number }>`
    SELECT COUNT(*)::int AS count FROM invoices;
  `;
  const { rows: numberOfCustomers } = await sql<{ count: number }>`
    SELECT COUNT(*)::int AS count FROM customers;
  `;

  // Revenue (TYPED como RevenueType)
  const { rows: revenue } = await sql<RevenueType>`
    SELECT month, revenue
    FROM revenue
    ORDER BY month ASC
    LIMIT 12;
  `;

  // Latest invoices: la query devuelve amount:number -> lo convertimos a string formateado
  const { rows: latestInvoicesRows } = await sql<
    Omit<LatestInvoiceType, 'amount'> & { amount: number }
  >`
    SELECT invoices.id,
           customers.name,
           customers.email,
           customers.image_url,
           invoices.amount
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    ORDER BY invoices.date DESC
    LIMIT 5;
  `;

  const latestInvoices: LatestInvoiceType[] = latestInvoicesRows.map((r) => ({
    ...r,
    amount: formatCurrency(r.amount),
  }));

  // Top 5 customers
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
    <main className="p-6 space-y-6">
      {/* Cards */}
      <section>
        <Cards
          totalPaidInvoices={totalPaidInvoices[0]?.count ?? 0}
          totalPendingInvoices={totalPendingInvoices[0]?.count ?? 0}
          numberOfInvoices={numberOfInvoices[0]?.count ?? 0}
          numberOfCustomers={numberOfCustomers[0]?.count ?? 0}
        />
      </section>

      {/* Revenue y Latest Invoices */}
      <section className="grid grid-cols-1 md:grid-cols-8 gap-6">
        {/* revenue ya es RevenueType[] */}
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </section>

      {/* Top 5 Customers */}
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
    </main>
  );
}
