// app/dashboard/invoices/[id]/edit/edit-form.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateInvoice, type InvoiceFormState } from '@/app/lib/actions';

type Customer = { id: string; name: string };
type InvoiceDTO = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
  date?: string | null;
};

type Props = { customers: Customer[]; invoice: InvoiceDTO };

// Botón con estado de envío 
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
    >
      {pending ? 'Saving…' : 'Update'}
    </button>
  );
}

export default function EditForm({ customers, invoice }: Props) {
  const initial: InvoiceFormState = { message: null, errors: {} };

  // Fija el id en la server action
  const updateWithId = async (_s: InvoiceFormState, fd: FormData) =>
    updateInvoice(invoice.id, fd);

  
  const [state, formAction] = useActionState(updateWithId, initial);

  const amountStr = invoice.amount != null ? String(invoice.amount) : '';
  const statusStr = invoice.status ?? 'pending';
  const dateStr = invoice.date ? invoice.date.slice(0, 10) : '';

  return (
    <form action={formAction} className="space-y-4 max-w-xl">
      {/* Mensaje general */}
      {state.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      {/* Customer */}
      <div>
        <label htmlFor="customerId" className="block text-sm font-medium">
          Customer
        </label>
        <select
          id="customerId"
          name="customerId"
          defaultValue={invoice.customer_id || ''}
          className="mt-1 w-full rounded border p-2"
          required
        >
          <option value="" disabled>
            Select…
          </option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {state.errors?.['customerId'] && (
          <p className="text-sm text-red-600">
            {state.errors['customerId'].join(', ')}
          </p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium">
          Amount
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          defaultValue={amountStr}
          className="mt-1 w-full rounded border p-2"
          required
        />
        {state.errors?.['amount'] && (
          <p className="text-sm text-red-600">
            {state.errors['amount'].join(', ')}
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={statusStr}
          className="mt-1 w-full rounded border p-2"
          required
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
        {state.errors?.['status'] && (
          <p className="text-sm text-red-600">
            {state.errors['status'].join(', ')}
          </p>
        )}
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          defaultValue={dateStr}
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
