import Link from 'next/link';
import { PublicNav } from './PublicNav';

const footerExplore: [string, string][] = [
  ['About', '/about'], ['Projects', '/projects'], ['Events', '/events'],
  ['Directors', '/directors'], ['Gallery', '/gallery'], ['Newsletters', '/newsletters'],
];

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#1f2a37]" style={{ fontFamily: "'Open Sans', ui-sans-serif, system-ui, sans-serif" }}>

      {/* Sticky glass navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline" aria-label="Rotary Club Nagpur Vision home">
            <div className="w-10 h-10 rounded-full bg-[#002664] border-2 border-[#F7A81B] flex items-center justify-center">
              <span className="text-[#F7A81B] font-bold text-lg leading-none">R</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#F7A81B] leading-none">Rotary District 3030</p>
              <p className="text-[15px] font-bold text-[#002664] leading-tight">Club of Nagpur Vision</p>
            </div>
          </Link>

          {/* Nav (desktop inside, mobile hamburger inside) */}
          <PublicNav />

          {/* Member Login (desktop) */}
          <Link
            href="/login"
            className="hidden md:inline-flex flex-shrink-0 items-center justify-center h-9 px-4 rounded-full bg-[#002664] text-white text-sm font-bold hover:bg-[#001d4f] transition-colors no-underline"
          >
            Member Login
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#002664] text-[#e6eefb]">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 no-underline">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-[#9db6dc] flex items-center justify-center">
                <span className="text-[#F7A81B] font-bold">R</span>
              </div>
              <p className="text-base font-bold text-white leading-tight">Club of Nagpur Vision</p>
            </Link>
            <p className="text-[#cfdcf2] text-sm leading-relaxed">Neighbours, professionals and friends taking action on health, the environment and opportunity in Nagpur.</p>
          </div>
          <div>
            <h4 className="text-[#F7A81B] uppercase tracking-wider text-xs font-bold mb-4">Explore</h4>
            <ul className="space-y-1 list-none p-0 m-0">
              {footerExplore.map(([label, href]) => (
                <li key={href}><Link href={href} className="text-[#cfdcf2] hover:text-white text-sm py-0.5 inline-block no-underline hover:underline">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[#F7A81B] uppercase tracking-wider text-xs font-bold mb-4">Rotary</h4>
            <ul className="space-y-1 list-none p-0 m-0">
              <li><a href="https://rid3030.rotaryindia.org/" target="_blank" rel="noreferrer" className="text-[#cfdcf2] hover:text-white text-sm py-0.5 inline-block no-underline hover:underline">District 3030</a></li>
              <li><a href="https://www.rotary.org/" target="_blank" rel="noreferrer" className="text-[#cfdcf2] hover:text-white text-sm py-0.5 inline-block no-underline hover:underline">Rotary International</a></li>
              <li><a href="https://my.rotary.org/" target="_blank" rel="noreferrer" className="text-[#cfdcf2] hover:text-white text-sm py-0.5 inline-block no-underline hover:underline">My Rotary</a></li>
              <li><Link href="/what-is-rotary" className="text-[#cfdcf2] hover:text-white text-sm py-0.5 inline-block no-underline hover:underline">What Is Rotary?</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#F7A81B] uppercase tracking-wider text-xs font-bold mb-4">Club</h4>
            <ul className="space-y-1 list-none p-0 m-0">
              <li><Link href="/get-involved" className="text-[#cfdcf2] hover:text-white text-sm py-0.5 inline-block no-underline hover:underline">Join or Volunteer</Link></li>
              <li><Link href="/contact" className="text-[#cfdcf2] hover:text-white text-sm py-0.5 inline-block no-underline hover:underline">Contact</Link></li>
              <li><Link href="/login" className="text-[#cfdcf2] hover:text-white text-sm py-0.5 inline-block no-underline hover:underline">Member Login</Link></li>
              <li><a href="https://rcnv.in/" target="_blank" rel="noreferrer" className="text-[#cfdcf2] hover:text-white text-sm py-0.5 inline-block no-underline hover:underline">rcnv.in</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-2 justify-between items-center">
            <p className="text-[#cfdcf2] text-xs">Rotary and the Rotary wheel are marks of Rotary International. © Rotary Club Nagpur Vision.</p>
            <div className="flex gap-4">
              <a href="https://rid3030.rotaryindia.org/" target="_blank" rel="noreferrer" className="text-[#cfdcf2] hover:text-white text-xs no-underline">District 3030</a>
              <a href="https://www.rotary.org/" target="_blank" rel="noreferrer" className="text-[#cfdcf2] hover:text-white text-xs no-underline">Rotary.org</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
