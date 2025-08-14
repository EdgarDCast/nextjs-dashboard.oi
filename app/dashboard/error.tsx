// app/dashboard/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
      <p className="text-gray-600">
        {error.message || 'Unexpected error while loading the dashboard.'}
      </p>
      <button
        onClick={() => reset()}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Try again
      </button>
    </main>
  );
}
