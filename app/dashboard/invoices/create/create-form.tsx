// app/dashboard/invoices/create/create-form.tsx
'use client';

import { useActionState } from 'react';
import { createInvoice, type InvoiceFormState } from '@/app/lib/actions';

type Props = { customers: Array<{ id: string; name: string }> };

const initialState: InvoiceFormState = { message: null, errors: {} };

export default function CreateForm({ customers }: Props) {
  // React 19: useActionState reemplaza a useFormState
  const [state, formAction] = useActionState(createInvoice, initialState);

  return (
    <form action={formAction} className="space-y-4 max-w-xl">
      <div>
        <label htmlFor="customerId" className="block text-sm font-medium">Customer</label>
        <select id="customerId" name="customerId" className="mt-1 w-full rounded border p-2" defaultValue="" required>
          <option value="" disabled>Select…</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {state.errors?.customerId && <p className="text-sm text-red-600">{state.errors.customerId.join(', ')}</p>}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium">Amount</label>
        <input id="amount" name="amount" type="number" step="0.01" className="mt-1 w-full rounded border p-2" placeholder="0.00" inputMode="decimal" required />
        {state.errors?.amount && <p className="text-sm text-red-600">{state.errors.amount.join(', ')}</p>}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium">Status</label>
        <select id="status" name="status" className="mt-1 w-full rounded border p-2" defaultValue="pending" required>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
        {state.errors?.status && <p className="text-sm text-red-600">{state.errors.status.join(', ')}</p>}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium">Date</label>
        <input id="date" name="date" type="date" className="mt-1 w-full rounded border p-2" />
      </div>

      {state.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">Save</button>
    </form>
  );
}
