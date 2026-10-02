'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CmsLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/cms/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) router.push('/cms/dashboard');
      else setError(data.message || 'Login failed');
    } catch {
      setError('Network error');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#002664] border-2 border-[#F7A81B] flex items-center justify-center">
              <span className="text-[#F7A81B] font-bold">R</span>
            </div>
            <div className="text-left">
              <p className="text-[#F7A81B] font-bold text-lg leading-none">RCNV</p>
              <p className="text-slate-400 text-xs">CMS</p>
            </div>
          </div>
          <h1 className="text-white text-2xl font-bold">Content Management</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to manage website content</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-2xl space-y-4">
          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002664]"
              placeholder="cms@rcnv.in"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002664]"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#F7A81B] text-[#1f2a37] font-bold py-2.5 rounded-lg hover:bg-[#e09810] transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-slate-500 text-xs text-center mt-4">
          Separate from the member portal login
        </p>
      </div>
    </div>
  );
}
