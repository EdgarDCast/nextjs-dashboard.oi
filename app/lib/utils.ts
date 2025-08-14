// app/lib/utils.ts
import type { Revenue } from './definitions';

/**
 * Formatea un monto en centavos a USD. Si ya usas unidades, elimina la división por 100.
 */
export function formatCurrency(amountInCents: number | null | undefined) {
  const cents = typeof amountInCents === 'number' ? amountInCents : 0;
  const value = cents / 100; // <- tu seed usa centavos
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formatea una fecha ISO/SQL a una cadena local.
 */
export function formatDateToLocal(dateStr: string, locale: string = 'en-US') {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
}

/**
 * Genera etiquetas del eje Y y el valor máximo usado para escalar la gráfica.
 * Tolera dataset vacío y normaliza a “múltiplos bonitos”.
 */
export function generateYAxis(revenue: Revenue[]) {
  if (!revenue || revenue.length === 0) {
    // Grilla por defecto para que el componente no falle
    const yAxisLabels = ['$4K', '$3K', '$2K', '$1K', '$0K'];
    const topLabel = 4000;
    return { yAxisLabels, topLabel };
  }

  const highestRecord = Math.max(...revenue.map((m) => m.revenue), 0);
  // Redondea hacia arriba al millar más cercano (mínimo 1000 para que se vea algo)
  const topLabel = Math.max(1000, Math.ceil(highestRecord / 1000) * 1000);

  const yAxisLabels: string[] = [];
  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
}

/**
 * Genera elementos de paginación con elipsis.
 */
export type PaginationItem = number | '...';

export function generatePagination(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  // Normaliza entradas
  const curr = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (curr <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  if (curr >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, '...', curr - 1, curr, curr + 1, '...', totalPages];
}
