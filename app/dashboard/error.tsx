// app/dashboard/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log del error (puedes cambiar console.error por tu servicio: Sentry, LogRocket, etc.)
  useEffect(() => {
    console.error('Dashboard error boundary:', error);
  }, [error]);

  const details =
    (error?.message ? `Message: ${error.message}\n` : '') +
    (error?.stack ? `\nStack:\n${error.stack}\n` : '') +
    (error?.digest ? `\nDigest: ${error.digest}` : '');

  async function copyDetails() {
    try {
      await navigator.clipboard.writeText(details || 'No details');
      alert('Error details copied to clipboard');
    } catch {
      alert('Could not copy details');
    }
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>

      <p className="text-gray-600">
        {error?.message || 'Unexpected error while loading the dashboard.'}
      </p>

      {/* Solo mostrar detalles en desarrollo */}
      {process.env.NODE_ENV === 'development' && details && (
        <pre className="max-h-64 overflow-auto rounded bg-gray-100 p-3 text-xs text-gray-800">
{details}
        </pre>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => reset()}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
        >
          Try again
        </button>

        <button
          onClick={() => history.back()}
          className="rounded border px-4 py-2 hover:bg-gray-50"
        >
          Go back
        </button>

        <Link
          href="/dashboard"
          className="rounded border px-4 py-2 hover:bg-gray-50"
        >
          Dashboard
        </Link>

        <button
          onClick={copyDetails}
          className="rounded border px-4 py-2 hover:bg-gray-50"
          title="Copy error details"
        >
          Copy details
        </button>
      </div>
    </main>
  );
}
