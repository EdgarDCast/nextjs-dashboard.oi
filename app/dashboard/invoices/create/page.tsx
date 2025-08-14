// app/dashboard/invoices/create/page.tsx
import { fetchCustomers } from '@/app/lib/data';
import CreateForm from './create-form';

export default async function CreateInvoicePage() {
  const customers = await fetchCustomers();
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Invoice</h1>
      <CreateForm customers={customers} />
    </main>
  );
}
