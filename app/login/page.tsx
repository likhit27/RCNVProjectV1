'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ADMIN_ROLES = ['super_admin', 'secretary', 'treasurer', 'president'];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slug, setSlug] = useState('rotary-nagpur-vision');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, slug })
      });
      const data = await res.json();
      if (res.ok) {
        const dest = ADMIN_ROLES.includes(data.role) ? `/admin/${slug}` : `/portal/${slug}`;
        router.push(dest);
      } else {
        setError(data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#002664] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#F7A81B] mb-1">RCNV · Rotary Club Of Nagpur Vision</p>
          <h1 className="text-3xl font-bold text-white">Sign in</h1>
          <p className="mt-1 text-white/50 text-sm">Enter your club credentials</p>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Club Slug</span>
              <input value={slug} onChange={e => setSlug(e.target.value)} required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#002664]" />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#002664]" />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#002664]" />
            </label>
            {error && <p className="text-xs text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{error}</p>}
            <button disabled={loading}
              className="w-full rounded-xl bg-[#002664] px-5 py-3 text-white font-semibold text-sm hover:bg-[#001a4a] disabled:opacity-60 transition-colors mt-2">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-white/40 text-xs">
          <Link href="/" className="hover:text-white/70">← Back to home</Link>
        </p>
      </div>
    </main>
  );
}
