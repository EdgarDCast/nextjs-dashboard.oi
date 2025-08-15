// app/dashboard/invoices/buttons.tsx
'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteInvoice } from '@/app/lib/actions';

// Botón para crear factura
export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      aria-label="Create invoice"
      title="Create invoice"
    >
      {/* En móviles no hay texto visible: añade texto accesible */}
      <span className="hidden md:block">Create Invoice</span>
      <span className="sr-only md:not-sr-only md:hidden">Create Invoice</span>
      <PlusIcon className="h-5 md:ml-4" aria-hidden="true" />
    </Link>
  );
}

// Botón para editar factura
export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded border px-2 py-1 text-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      aria-label="Edit invoice"
      title="Edit invoice"
    >
      <PencilIcon className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">Edit</span>
    </Link>
  );
}

// Botón para eliminar factura con confirmación y transición
export function DeleteInvoice({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      title="Delete invoice"
      aria-label="Delete invoice"
      className="rounded border px-2 py-1 text-sm hover:bg-red-50 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      disabled={pending}
      aria-busy={pending || undefined}
      onClick={() => {
        if (confirm('Delete this invoice?')) {
          startTransition(async () => {
            await deleteInvoice(id);
          });
        }
      }}
    >
      <TrashIcon className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">Delete</span>
    </button>
  );
}
