'use client';

import Link from 'next/link';
import NavLinks from '@/app/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
  return (
    <aside
      className="flex h-full flex-col px-3 py-4 md:px-2"
      aria-label="Sidebar navigation"
    >
      <Link
        href="/"
        title="Go to Home"
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 outline-none ring-offset-2 focus:ring-2 focus:ring-blue-400 md:h-40"
      >
        <span className="sr-only">Acme Home</span>
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <nav aria-label="Primary">
          <NavLinks />
        </nav>

        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block" />

        {/* Botón de salida (por ahora sin acción de servidor) */}
        <button
          type="button" // evita submit mientras no tengamos server action
          className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium outline-none ring-offset-2 hover:bg-sky-100 hover:text-blue-600 focus:ring-2 focus:ring-blue-400 md:justify-start md:p-2 md:px-3"
          aria-label="Sign out"
        >
          <PowerIcon className="w-6" aria-hidden="true" />
          <span className="hidden md:block">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
