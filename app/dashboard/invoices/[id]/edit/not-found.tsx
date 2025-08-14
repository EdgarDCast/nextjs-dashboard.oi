// app/dashboard/invoices/[id]/edit/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="p-6 space-y-3">
      <h2 className="text-xl font-semibold">Invoice not found</h2>
      <p className="text-gray-600">
        The invoice you’re looking for doesn’t exist or was removed.
      </p>
      <Link
        href="/dashboard/invoices"
        className="inline-block rounded border px-4 py-2 hover:bg-gray-50"
      >
        Back to Invoices
      </Link>
    </main>
  );
}
