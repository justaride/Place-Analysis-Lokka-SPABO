'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Forside' },
  { href: '/eiendommer', label: 'Eiendommer' },
  { href: '/om-prosjektet', label: 'Om Prosjektet' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/' && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-lokka-primary text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-lokka-primary'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
