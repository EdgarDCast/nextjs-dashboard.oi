// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <main className="p-6 space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="h-5 w-20 m-4 bg-gray-200 rounded" />
            <div className="h-20 mx-4 mb-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-8 gap-6">
        <div className="md:col-span-4 rounded-xl bg-gray-50 p-4">
          <div className="h-6 w-40 mb-4 bg-gray-200 rounded" />
          <div className="h-72 bg-gray-200 rounded" />
        </div>
        <div className="md:col-span-4 rounded-xl bg-gray-50 p-4">
          <div className="h-6 w-48 mb-4 bg-gray-200 rounded" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded mb-2" />
          ))}
        </div>
      </section>

      <section>
        <div className="h-6 w-48 mb-4 bg-gray-200 rounded" />
        <div className="h-56 bg-gray-200 rounded" />
      </section>
    </main>
  );
}
