// app/dashboard/invoices/[id]/edit/page.tsx
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import EditForm from './edit-form';

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  return (
    <main className="p-6 space-y-6">
      <h1 className="mb-2 text-2xl font-bold">Edit Invoice</h1>
      <EditForm invoice={invoice} customers={customers} />
    </main>
  );
}
