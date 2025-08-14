import AcmeLogo from '@/app/ui/acme-logo'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="p-4 bg-blue-500 text-white rounded-md">
        Hola desde Tailwind
      </div>

      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        {/* Columna izquierda */}
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <AcmeLogo />
          <p className="text-xl text-gray-800 md:text-3xl md:leading-normal">
            <strong>Welcome to Acme.</strong> This is the example for the{' '}
            <a href="https://nextjs.org/learn/" className="text-blue-500">
              Next.js Learn Course
            </a>
            , brought to you by Vercel.
          </p>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Log in</span>
              <ArrowRightIcon className="w-5 md:w-6" />
            </Link>

            <Link
              href="/dashboard"
              className="rounded-lg border border-blue-500 px-6 py-3 text-sm font-medium text-blue-600 hover:bg-sky-50 md:text-base"
            >
              Ir al Dashboard →
            </Link>
          </div>
        </div>

        {/* Columna derecha: imágenes optimizadas */}
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <div className="w-full max-w-lg">
            <Image
              src="/nextjs-icon.webp"
              alt="Next.js Icon"
              width={320}
              height={70}
              priority
            />
            <div className="h-6" />
            <Image
              src="/next-js-logo-png_seeklogo-321806.png"
              alt="Next.js Logo"
              width={900}
              height={200}
              sizes="(min-width: 768px) 600px, 90vw"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
