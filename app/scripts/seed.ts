
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { sql } from '@vercel/postgres';
import { randomUUID } from 'crypto';
import { customers, invoices, revenue } from '../lib/placeholder-data';

// Validar que exista la URL de Postgres
if (!process.env.POSTGRES_URL) {
  console.error(' Error: No se encontró POSTGRES_URL en .env.local');
  process.exit(1);
}

async function createTables() {
  await sql/* sql */`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      image_url TEXT
    );
  `;

  await sql/* sql */`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY,
      customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('paid','pending')),
      date DATE NOT NULL
    );
  `;

  await sql/* sql */`
    CREATE TABLE IF NOT EXISTS revenue (
      month TEXT PRIMARY KEY,
      revenue INTEGER NOT NULL
    );
  `;
}

async function clearData() {
  await sql`DELETE FROM invoices;`;
  await sql`DELETE FROM customers;`;
  await sql`DELETE FROM revenue;`;
}

async function insertData() {
  for (const c of customers) {
    await sql/* sql */`
      INSERT INTO customers (id, name, email, image_url)
      VALUES (${c.id}, ${c.name}, ${c.email}, ${c.image_url})
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  for (const inv of invoices) {
    const id = randomUUID();
    await sql/* sql */`
      INSERT INTO invoices (id, customer_id, amount, status, date)
      VALUES (${id}, ${inv.customer_id}, ${inv.amount}, ${inv.status}, ${inv.date})
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  for (const r of revenue) {
    await sql/* sql */`
      INSERT INTO revenue (month, revenue)
      VALUES (${r.month}, ${r.revenue})
      ON CONFLICT (month) DO NOTHING;
    `;
  }
}

async function main() {
  console.log('Creating tables...');
  await createTables();

  console.log('Clearing data...');
  await clearData();

  console.log('Inserting seed data...');
  await insertData();

  console.log(' Seed completed.');
  process.exit(0);
}

main().catch((err) => {
  console.error(' Seed failed:', err);
  process.exit(1);
});
