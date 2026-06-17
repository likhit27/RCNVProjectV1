export const dynamic = 'force-dynamic';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#002664] flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#F7A81B] mb-2">Rotary Club Platform</p>
          <h1 className="text-4xl font-bold">RCNV</h1>
          <p className="mt-2 text-white/60 text-sm">Rotary Club Of Nagpur Vision — Club Management</p>
        </div>

        <div className="grid gap-3">
          <Link href="/club/rotary-navi-mumbai"
            className="block rounded-2xl bg-[#F7A81B] text-[#002664] font-semibold px-6 py-4 hover:bg-[#e09810] transition-colors">
            View Club Dashboard
          </Link>
          <Link href="/login"
            className="block rounded-2xl border border-white/20 bg-white/10 text-white font-semibold px-6 py-4 hover:bg-white/20 transition-colors">
            Admin Login
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-sm space-y-1">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Demo credentials</p>
          <p><span className="text-white/50">Club:</span> rotary-navi-mumbai</p>
          <p><span className="text-white/50">Email:</span> admin@rotary.local</p>
          <p><span className="text-white/50">Password:</span> admin123</p>
        </div>
      </div>
    </main>
  );
}
