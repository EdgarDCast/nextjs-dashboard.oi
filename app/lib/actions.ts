// app/lib/actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@/app/lib/db';

// Si customer_id es INTEGER, cambia por regex(/^\d+$/)
const InvoiceSchema = z.object({
  customerId: z.string().uuid({ message: 'Cliente inválido' }),
  amount: z.coerce.number().min(0.01, 'Monto mínimo 0.01'),
  status: z.enum(['pending', 'paid']),
  // input type="date" => 'YYYY-MM-DD'
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Fecha inválida (YYYY-MM-DD)' })
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export type InvoiceFormState = {
  errors?: Record<string, string[]>;
  message?: string | null;
};

export async function createInvoice(
  _prevState: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  const parsed = InvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
    date: formData.get('date'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Revisa los campos',
    };
  }

  const { customerId, amount, status, date } = parsed.data;
  const amount2 = Math.round(amount * 100) / 100; // asegura 2 decimales

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (
        ${customerId},
        ${amount2},
        ${status},
        COALESCE(${date ?? null}::date, CURRENT_DATE)
      )
    `;
  } catch (err) {
    console.error('DB error (createInvoice):', err);
    return { message: 'Error de base de datos al crear la factura.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  formData: FormData
): Promise<InvoiceFormState> {
  const parsed = InvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
    date: formData.get('date'),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Revisa los campos',
    };
  }

  const { customerId, amount, status, date } = parsed.data;
  const amount2 = Math.round(amount * 100) / 100;

  try {
    await sql`
      UPDATE invoices
      SET
        customer_id = ${customerId},
        amount = ${amount2},
        status = ${status},
        date = COALESCE(${date ?? null}::date, CURRENT_DATE)
      WHERE id = ${id}
    `;
  } catch (err) {
    console.error('DB error (updateInvoice):', err);
    return { message: 'Error de base de datos al actualizar la factura.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (err) {
    console.error('DB error (deleteInvoice):', err);
    // Lanzamos para que lo capture app/dashboard/error.tsx
    throw new Error('Failed to delete invoice.');
  }
  revalidatePath('/dashboard/invoices');
}
