'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
};

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createPageURL = (page: number) => {
    // Copia segura de los params actuales
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  };

  const go = (page: number) => router.push(createPageURL(page));

  if (totalPages <= 1) return null;

  // Ventana simple de páginas (máx 5)
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav aria-label="Pagination" className="flex items-center gap-2">
      <button
        type="button"
        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
        disabled={currentPage <= 1}
        aria-label="Previous page"
        aria-disabled={currentPage <= 1 || undefined}
        onClick={() => go(Math.max(1, currentPage - 1))}
      >
        Prev
      </button>

      {pages.map((p) => {
        const isCurrent = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            className={`rounded border px-3 py-1 text-sm ${isCurrent ? 'bg-gray-900 text-white' : ''}`}
            onClick={() => go(p)}
            aria-label={`Page ${p}`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        aria-disabled={currentPage >= totalPages || undefined}
        onClick={() => go(Math.min(totalPages, currentPage + 1))}
      >
        Next
      </button>
    </nav>
  );
}
