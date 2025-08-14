// app/dashboard/loading.tsx
import {
  CardsSkeleton,
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
} from '@/app/ui/skeletons';

function TopCustomersSkeleton() {
  return (
    <section>
      <div className="h-7 w-48 mb-4 rounded animate-pulse bg-gray-200" />
      <div className="border rounded">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-12 border-b last:border-0 animate-pulse bg-gray-100"
          />
        ))}
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <main className="p-6 space-y-6">
      {/* Cards */}
      <CardsSkeleton />

      {/* Revenue + Latest Invoices */}
      <section className="grid grid-cols-1 md:grid-cols-8 gap-6">
        <RevenueChartSkeleton />
        <LatestInvoicesSkeleton />
      </section>

      {/* TopCustomers */}
      <TopCustomersSkeleton />
    </main>
  );
}

