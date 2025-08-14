// app/lib/db.ts
import { sql } from '@vercel/postgres';
export { sql } from '@vercel/postgres';


async function seed() {
  try {
    // Crear tabla de ejemplo
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255)
      );
    `;

    // Insertar datos de ejemplo
    await sql`
      INSERT INTO customers (name, email)
      VALUES ('Juan Pérez', 'juan@example.com'),
             ('María Gómez', 'maria@example.com')
      ON CONFLICT DO NOTHING;
    `;

    console.log('Base de datos inicializada ✅');
  } catch (error) {
    console.error('Error al inicializar la base de datos ❌', error);
  }
}

seed();

