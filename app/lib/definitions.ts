// app/lib/definitions.ts

// Tipos base
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number; // Guardado en centavos si usas Stripe-like, o en valor normal si no
  date: string;
  status: 'pending' | 'paid';
};

// === Para métricas de revenue ===
export type Revenue = {
  month: string;
  revenue: number; // numérico en la BD
};

// === Para últimas facturas ===
export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string; // formateado con formatCurrency()
};

// La BD devuelve number, luego lo formateamos a string
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

// === Tablas y listados ===
export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

// === Extra para fetchCardData ===
export type CountRow = {
  count: number;
};
