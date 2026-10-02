'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/events', label: 'Events' },
  { href: '/directors', label: 'Directors' },
  { href: '/past-presidents', label: 'Past Presidents' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/newsletters', label: 'Newsletters' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/contact', label: 'Contact' },
];

export function PublicNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center" aria-label="Main navigation">
        {navItems.map(({ href, label }) => {
          const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href} href={href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                active ? 'text-[#F7A81B] bg-[#002664]/10' : 'text-slate-700 hover:text-[#002664] hover:bg-slate-100'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile hamburger */}
      <button
        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        onClick={() => setOpen(o => !o)}
        aria-label="Menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-lg z-50 py-2">
          {navItems.map(({ href, label }) => {
            const active = href === '/' ? pathname === '/' : pathname === href;
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`block px-5 py-2.5 text-sm font-medium ${active ? 'text-[#F7A81B] bg-slate-50' : 'text-slate-700 hover:bg-slate-50'}`}>
                {label}
              </Link>
            );
          })}
          <div className="mx-4 mt-2 mb-1 pt-2 border-t">
            <Link href="/login" onClick={() => setOpen(false)}
              className="block bg-[#002664] text-white text-sm font-bold text-center py-2.5 rounded-full">
              Member Login
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
