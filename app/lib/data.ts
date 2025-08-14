// app/lib/data.ts
import { sql } from '@/app/lib/db';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  LatestInvoice,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import { notFound } from 'next/navigation';

// Utilidad para simular latencia
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


export async function fetchRevenue() {
  noStore();
  try {
    console.log('[fetchRevenue] start');
    await pause(3000); // Simulación de 3s
    const result = await sql<Revenue>`
      SELECT month, revenue
      FROM revenue
      ORDER BY month ASC
    `;
    console.log('[fetchRevenue] done');
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}


export async function fetchLatestInvoices() {
  noStore();
  try {
    console.log('[fetchLatestInvoices] start');
    await pause(6000); // Simulación de 6s
    const result = await sql<LatestInvoiceRaw>`
      SELECT
        invoices.amount::float8 AS amount,
        customers.name,
        customers.image_url,
        customers.email,
        invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5
    `;

    const latestInvoices: LatestInvoice[] = result.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    console.log('[fetchLatestInvoices] done');
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}


export async function fetchCardData() {
  noStore();
  try {
    console.log('[fetchCardData] start');

    const invoiceCountPromise = sql<{ count: number }>`
      SELECT COUNT(*)::int AS count FROM invoices
    `;
    const customerCountPromise = sql<{ count: number }>`
      SELECT COUNT(*)::int AS count FROM customers
    `;
  
    const invoiceStatusPromise = sql<{ paid: number; pending: number }>`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0)::float8   AS paid,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0)::float8 AS pending
      FROM invoices
    `;

    const [invCountRes, custCountRes, statusRes] = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = invCountRes.rows[0]?.count ?? 0;
    const numberOfCustomers = custCountRes.rows[0]?.count ?? 0;
    const totalPaidInvoices = formatCurrency(statusRes.rows[0]?.paid ?? 0);
    const totalPendingInvoices = formatCurrency(statusRes.rows[0]?.pending ?? 0);

    console.log('[fetchCardData] done');
    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;


export async function fetchFilteredInvoices(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const result = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount::float8 AS amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const result = await sql<{ count: number }>`
      SELECT COUNT(*)::int AS count
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `;
    const total = result.rows[0]?.count ?? 0;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}


export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const result = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount::float8 AS amount,
        invoices.status,
        invoices.date
      FROM invoices
      WHERE invoices.id = ${id}
      LIMIT 1
    `;

    const invoice = result.rows[0];
    if (!invoice) notFound(); // dispara app/dashboard/invoices/[id]/edit/not-found.tsx

    return invoice;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}


export async function fetchCustomers() {
  noStore();
  try {
    const result = await sql<CustomerField>`
      SELECT id, name
      FROM customers
      ORDER BY name ASC
    `;
    return result.rows;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const result = await sql<CustomersTableType>`
      SELECT
        customers.id,
        customers.name,
        customers.email,
        customers.image_url,
        COUNT(invoices.id)::int AS total_invoices,
        COALESCE(SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END), 0)::float8 AS total_pending,
        COALESCE(SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END), 0)::float8 AS total_paid
      FROM customers
      LEFT JOIN invoices ON customers.id = invoices.customer_id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
      GROUP BY customers.id, customers.name, customers.email, customers.image_url
      ORDER BY customers.name ASC
    `;

    const customers = result.rows.map((c) => ({
      ...c,
      total_pending: Number(c.total_pending),
      total_paid: Number(c.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
