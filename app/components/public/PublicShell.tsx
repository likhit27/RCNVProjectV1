import Link from 'next/link';
import { PublicNav } from './PublicNav';

const footerExplore: [string, string][] = [
  ['About', '/about'], ['Projects', '/projects'], ['Directors', '/directors'],
  ['Events', '/events'], ['Get Involved', '/get-involved'],
];

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#1f2a37]" style={{ fontFamily: "'Open Sans', Arial, sans-serif" }}>

      {/* Utility bar */}
      <div className="bg-[#17458f] text-white">
        <div className="max-w-6xl mx-auto px-5 flex justify-between items-center gap-3 flex-wrap py-1">
          <div className="flex flex-wrap">
            <a href="https://rid3030.rotaryindia.org/" target="_blank" rel="noreferrer"
              className="text-white hover:underline py-2 text-sm mr-5 no-underline">
              Rotary District 3030
            </a>
            <a href="https://www.rotary.org/" target="_blank" rel="noreferrer"
              className="text-white hover:underline py-2 text-sm mr-5 no-underline">
              Rotary.org
            </a>
            <a href="https://my.rotary.org/" target="_blank" rel="noreferrer"
              className="text-white hover:underline py-2 text-sm no-underline">
              My Rotary
            </a>
          </div>
          <Link
            href="/login"
            className="bg-[#f7a81b] text-[#1f2a37] font-bold px-4 py-1.5 rounded-full text-sm hover:bg-[#e09810] transition-colors no-underline"
          >
            Member Login
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center gap-4 flex-wrap">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label="Rotary Club Nagpur Vision, home">
          <div className="w-12 h-12 rounded-full bg-[#17458f] border-2 border-[#f7a81b] flex items-center justify-center flex-shrink-0">
            <span className="text-[#f7a81b] font-bold text-xl">R</span>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#f7a81b] m-0 leading-none">Rotary District 3030</p>
            <p className="text-xl font-bold text-[#17458f] m-0 leading-tight mt-0.5">Club of Nagpur Vision</p>
          </div>
        </Link>
        <div className="flex gap-2.5 flex-wrap">
          <Link
            href="/get-involved"
            className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full font-bold text-sm bg-[#c10042] text-white border-2 border-[#c10042] hover:bg-white hover:text-[#c10042] transition-colors no-underline"
          >
            Join or Volunteer
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full font-bold text-sm bg-white text-[#17458f] border-2 border-[#019fcb] hover:bg-[#019fcb] hover:text-white transition-colors no-underline"
          >
            Contact Us
          </Link>
        </div>
      </header>

      <PublicNav />

      <main className="max-w-6xl mx-auto px-5 pb-12">{children}</main>

      {/* Footer */}
      <footer className="bg-[#17458f] text-[#e6eefb] mt-6 pt-9">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 pb-7">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-3 no-underline">
              <div className="w-9 h-9 rounded-full bg-white/20 border border-[#9db6dc] flex items-center justify-center flex-shrink-0">
                <span className="text-[#f7a81b] font-bold">R</span>
              </div>
              <p className="text-base font-bold text-white m-0 leading-tight">Club of Nagpur Vision</p>
            </Link>
            <p className="text-[#cfdcf2] text-sm m-0">
              Neighbours, professionals and friends taking action on health, the environment and opportunity in Nagpur.
            </p>
          </div>
          <div>
            <h4 className="text-[#f7a81b] uppercase tracking-wide text-xs font-bold mb-3">Explore</h4>
            <ul className="list-none p-0 m-0">
              {footerExplore.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-white hover:underline py-1 inline-block text-sm no-underline">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[#f7a81b] uppercase tracking-wide text-xs font-bold mb-3">Rotary</h4>
            <ul className="list-none p-0 m-0">
              <li><a href="https://rid3030.rotaryindia.org/" target="_blank" rel="noreferrer" className="text-white hover:underline py-1 inline-block text-sm no-underline">District 3030</a></li>
              <li><a href="https://www.rotary.org/" target="_blank" rel="noreferrer" className="text-white hover:underline py-1 inline-block text-sm no-underline">Rotary International</a></li>
              <li><a href="https://my.rotary.org/" target="_blank" rel="noreferrer" className="text-white hover:underline py-1 inline-block text-sm no-underline">My Rotary</a></li>
              <li><Link href="/what-is-rotary" className="text-white hover:underline py-1 inline-block text-sm no-underline">What Is Rotary?</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#f7a81b] uppercase tracking-wide text-xs font-bold mb-3">Club</h4>
            <ul className="list-none p-0 m-0">
              <li><Link href="/get-involved" className="text-white hover:underline py-1 inline-block text-sm no-underline">Join or Volunteer</Link></li>
              <li><Link href="/contact" className="text-white hover:underline py-1 inline-block text-sm no-underline">Contact</Link></li>
              <li><Link href="/login" className="text-white hover:underline py-1 inline-block text-sm no-underline">Member Login</Link></li>
              <li><a href="https://rcnv.in/" target="_blank" rel="noreferrer" className="text-white hover:underline py-1 inline-block text-sm no-underline">rcnv.in</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-5 border-t border-white/20 py-4">
          <p className="text-[#cfdcf2] text-xs m-0">
            Rotary and the Rotary wheel are marks of Rotary International. © Rotary Club Nagpur Vision.
          </p>
        </div>
      </footer>
    </div>
  );
}
