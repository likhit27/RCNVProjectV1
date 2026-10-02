'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/directors', label: 'Directors' },
  { href: '/projects', label: 'Projects' },
  { href: '/events', label: 'Events & Newsletters' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/contact', label: 'Contact' },
  { href: '/what-is-rotary', label: 'What Is Rotary?' },
];

export function PublicNav() {
  const pathname = usePathname();
  return (
    <nav
      className="bg-[#f3f6fa] border-y border-[#dfe4e8] sticky top-0 z-10"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-5 flex overflow-x-auto">
        {navItems.map(({ href, label }) => {
          const isActive = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center min-h-[48px] px-3 text-[15px] font-semibold whitespace-nowrap transition-colors no-underline border-b-2 ${
                isActive
                  ? 'text-[#17458f] border-[#f7a81b]'
                  : 'text-[#3a4654] border-transparent hover:text-[#17458f]'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
