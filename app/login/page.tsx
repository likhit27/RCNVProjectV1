'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@rotary.local');
  const [password, setPassword] = useState('admin123');
  const [slug, setSlug] = useState('rotary-navi-mumbai');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, slug })
    });

    if (response.ok) {
      router.push(`/admin/${slug}`);
    } else {
      const body = await response.json();
      setError(body?.message || 'Login failed');
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Club Admin Sign In</h1>
        <p className="mt-2 text-slate-600">Use your club slug and admin credentials.</p>
        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Club Slug</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-slate-400"
            />
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-700">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
