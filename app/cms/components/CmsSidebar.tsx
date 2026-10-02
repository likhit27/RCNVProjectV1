'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const nav = [
  { href: '/cms/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/cms/banners', icon: '🖼️', label: 'Hero Banners' },
  { href: '/cms/counters', icon: '🔢', label: 'Counters' },
  { href: '/cms/projects', icon: '📝', label: 'Projects' },
  { href: '/cms/events', icon: '📅', label: 'Events' },
  { href: '/cms/directors', icon: '👤', label: 'Directors' },
  { href: '/cms/past-presidents', icon: '🏆', label: 'Past Presidents' },
  { href: '/cms/newsletters', icon: '📰', label: 'Newsletters' },
  { href: '/cms/gallery', icon: '🖼️', label: 'Gallery' },
  { href: '/cms/pages', icon: '📄', label: 'Page Content' },
];

export function CmsSidebar({ admin }: { admin: { email: string; name: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch('/api/cms/auth/logout', { method: 'POST' });
    router.push('/cms/login');
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0f172a] flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#002664] border-2 border-[#F7A81B] flex items-center justify-center flex-shrink-0">
            <span className="text-[#F7A81B] font-bold text-sm">R</span>
          </div>
          <div>
            <p className="text-[#F7A81B] font-bold text-base leading-none">RCNV CMS</p>
            <p className="text-slate-500 text-xs mt-0.5">Content Manager</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#1e3a5f] text-[#F7A81B]'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-800">
        <p className="text-slate-500 text-xs px-3 mb-2 truncate">{admin.email}</p>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
