'use client';

import { useEffect, useRef, useState, useCallback, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type Props = {
  placeholder?: string;
  defaultValue?: string;
};

export default function Search({ placeholder = 'Search…', defaultValue = '' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(defaultValue ?? '');
  const lastPushedRef = useRef(defaultValue ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  // Sincroniza cuando cambia defaultValue (ej. al navegar)
  useEffect(() => {
    setValue(defaultValue ?? '');
    lastPushedRef.current = defaultValue ?? '';
  }, [defaultValue]);

  const pushQuery = useCallback(
    (q: string) => {
      const params = new URLSearchParams(window.location.search);
      if (q) params.set('query', q);
      else params.delete('query');

      // reset page si cambió el término
      if (q !== lastPushedRef.current) params.delete('page');

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
      lastPushedRef.current = q;
    },
    [pathname, router]
  );

  // Debounce 300ms al tipear
  useEffect(() => {
    const id = setTimeout(() => {
      if (value !== lastPushedRef.current) pushQuery(value);
    }, 300);
    return () => clearTimeout(id);
  }, [value, pushQuery]);

  // Submit inmediato con Enter
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value !== lastPushedRef.current) pushQuery(value);
  };

  const clear = () => {
    setValue('');
    pushQuery('');
    inputRef.current?.focus();
  };

  return (
    <form
      role="search"
      aria-label="Search invoices and customers"
      onSubmit={onSubmit}
      className="relative flex flex-1 items-center gap-2"
    >
      <label htmlFor="search" className="sr-only">
        Search invoices and customers
      </label>

      <div className="relative flex-1">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id="search"
          name="query"
          type="search"
          inputMode="search"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 pr-8 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-busy={pending}
        />

        {/* Botón Clear (no envía el form) */}
        {value ? (
          <button
            type="button"
            onClick={clear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label="Clear search"
            title="Clear"
          >
            ×
          </button>
        ) : null}
      </div>

      {/* Botón submit accesible (Enter hace lo mismo) */}
      <button
        type="submit"
        className="hidden rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:inline-block disabled:opacity-50"
        disabled={pending}
      >
        Search
      </button>
    </form>
  );
}
