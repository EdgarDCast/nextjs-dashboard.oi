// app/dashboard/invoices/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import Search from '@/app/ui/search';
import Pagination from '@/app/ui/pagination';
import InvoicesTable from './table';
import { fetchInvoicesPages } from '@/app/lib/data';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

type SearchParams = {
  query?: string | string[];
  page?: string | string[];
};

export default async function Page({
  searchParams,
}: {
  // Next 15 canary: searchParams es Promise
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const queryParam = Array.isArray(sp.query) ? sp.query[0] : sp.query;
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;

  const query = (queryParam ?? '').toString();
  const parsed = Number(pageParam ?? '1');
  const requestedPage = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;

  const totalPages = await fetchInvoicesPages(query);
  const safeTotal = Math.max(1, totalPages);
  const currentPage = Math.min(requestedPage, safeTotal);

  return (
    // No anidar <main>: el layout ya tiene <main id="main-content">
    <section aria-labelledby="invoices-heading" className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 id="invoices-heading" className="text-2xl font-bold">
          Invoices
        </h1>

        {/* derecha: botón + buscador + paginación compacta */}
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Link
            href="/dashboard/invoices/create"
            className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            aria-label="Create invoice"
          >
            Create invoice
          </Link>

          <Search
            placeholder="Search invoices, customers, status…"
            defaultValue={query}
          />

          <Pagination totalPages={safeTotal} currentPage={currentPage} />
        </div>
      </div>

      {/* Tabla */}
      <Suspense
        key={`${query}-${currentPage}`}
        fallback={<InvoicesTableSkeleton />}
      >
        <InvoicesTable query={query} currentPage={currentPage} />
      </Suspense>

      {/* Paginación inferior */}
      <div className="flex justify-end">
        <Pagination totalPages={safeTotal} currentPage={currentPage} />
      </div>
    </section>
  );
}
