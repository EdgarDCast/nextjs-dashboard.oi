// app/dashboard/invoices/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import Search from '@/app/ui/search';
import Pagination from '@/app/ui/pagination';
import InvoicesTable from './table';
import { fetchInvoicesPages } from '@/app/lib/data';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { CreateInvoice } from './buttons'; 

type SearchParams = {
  query?: string;
  page?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: SearchParams; //  corregido (no Promise)
}) {
  const sp = searchParams ?? {};
  const query = (sp.query ?? '').toString();

  const parsed = Number(sp.page ?? '1');
  const requestedPage = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;

  const totalPages = await fetchInvoicesPages(query);
  const safeTotal = Math.max(1, totalPages);
  const currentPage = Math.min(requestedPage, safeTotal);

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>

        {/* derecha: botón + buscador + paginación compacta */}
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <CreateInvoice /> {/* lleva a /dashboard/invoices/create */}
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
    </main>
  );
}
