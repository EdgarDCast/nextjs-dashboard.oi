// app/dashboard/cards.tsx
import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

type CardType = 'invoices' | 'customers' | 'pending' | 'collected';

const iconMap: Record<CardType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function Cards() {
  // 🔹 Carga de datos aquí (sin props)
  const {
    numberOfCustomers,
    numberOfInvoices,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  const items: Array<{ title: string; value: number | string; type: CardType }> = [
    { title: 'Collected',        value: totalPaidInvoices,   type: 'collected' },
    { title: 'Pending',          value: totalPendingInvoices, type: 'pending' },
    { title: 'Total Invoices',   value: numberOfInvoices,     type: 'invoices' },
    { title: 'Total Customers',  value: numberOfCustomers,    type: 'customers' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <Card key={it.title} title={it.title} value={it.value} type={it.type} />
      ))}
    </div>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: CardType;
}) {
  const Icon = iconMap[type];
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
