// app/dashboard/invoices/table.tsx
import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/dashboard/invoices/buttons';
import InvoiceStatus from '@/app/dashboard/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';
import type { InvoicesTable as InvoicesTableType } from '@/app/lib/definitions';

const FALLBACK_AVATAR = '/nextjs-icon.webp';

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices: InvoicesTableType[] = await fetchFilteredInvoices(query, currentPage);

  // Empty state (móvil y desktop) con región viva
  if (!invoices || invoices.length === 0) {
    return (
      <div className="mt-6 rounded-lg bg-gray-50 p-6 text-sm text-gray-500" aria-live="polite" role="status">
        {query ? (
          <>No results for <span className="font-medium">“{query}”</span>.</>
        ) : (
          'No invoices yet.'
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile list (semántica de lista) */}
          <ul className="md:hidden" role="list" aria-label="Invoices">
            {invoices.map((invoice) => {
              const avatar = invoice.image_url || FALLBACK_AVATAR;
              return (
                <li
                  key={invoice.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <Image
                          src={avatar}
                          className="mr-2 rounded-full"
                          width={28}
                          height={28}
                          alt={`${invoice.name}'s profile picture`}
                        />
                        <p className="font-medium">{invoice.name}</p>
                      </div>
                      <p className="text-sm text-gray-500">{invoice.email}</p>
                    </div>
                    <InvoiceStatus status={invoice.status} />
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">
                        {formatCurrency(invoice.amount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <time dateTime={invoice.date}>
                          {formatDateToLocal(invoice.date)}
                        </time>
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Desktop table */}
          <table
            className="hidden min-w-full text-gray-900 md:table"
            aria-label="Invoices table"
          >
            <caption className="sr-only">Invoices</caption>
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices.map((invoice) => {
                const avatar = invoice.image_url || FALLBACK_AVATAR;
                return (
                  <tr
                    key={invoice.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none
                               [&:first-child>td:first-child]:rounded-tl-lg
                               [&:first-child>td:last-child]:rounded-tr-lg
                               [&:last-child>td:first-child]:rounded-bl-lg
                               [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    {/* Customer como encabezado de fila */}
                    <th scope="row" className="whitespace-nowrap py-3 pl-6 pr-3 font-medium">
                      <div className="flex items-center gap-3">
                        <Image
                          src={avatar}
                          className="rounded-full"
                          width={28}
                          height={28}
                          alt={`${invoice.name}'s profile picture`}
                        />
                        <span>{invoice.name}</span>
                      </div>
                    </th>
                    <td className="whitespace-nowrap px-3 py-3">{invoice.email}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <time dateTime={invoice.date}>
                        {formatDateToLocal(invoice.date)}
                      </time>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <InvoiceStatus status={invoice.status} />
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateInvoice id={invoice.id} />
                        <DeleteInvoice id={invoice.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
