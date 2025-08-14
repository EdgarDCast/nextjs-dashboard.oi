// app/lib/definitions.ts


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

export type Status = 'pending' | 'paid';

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number; // valor decimal 
  date: string;  
  status: Status;
};

// === Para métricas de revenue ===
export type Revenue = {
  month: string;
  revenue: number;
};

// === Para últimas facturas ===
export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;   // formateado con formatCurrency()
};

// La BD devuelve number, luego lo formateamos a string
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;   // viene como float8 en SQL
};

// === Tablas y listados ===

// id, amount, date, status, customers.name/email/image_url
export type InvoicesTable = {
  id: string;
  amount: number;
  date: string;
  status: Status;
  name: string;
  email: string;
  image_url: string;
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number; // ya convertido a number en data.ts
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

// Usado por fetchInvoiceById (incluye date)
export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: Status;
  date: string;
};

// === Extra para fetchCardData ===
export type CountRow = {
  count: number;
};
