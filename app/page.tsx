import Link from 'next/link';
import { getClubBySlug } from '@/lib/db';

export default async function Home() {
  const club = await getClubBySlug('rotary-navi-mumbai');

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold">RCNV Rotary Club Management</h1>
          <p className="text-lg text-slate-600">
            Multi-tenant Rotary club platform for members, projects, news, and dues.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/login" className="rounded-2xl border border-slate-200 bg-slate-100 px-6 py-5 text-left hover:bg-slate-50">
              <h2 className="text-xl font-semibold">Admin login</h2>
              <p className="mt-2 text-slate-600">Manage members, news, projects, and club settings.</p>
            </Link>
            <Link href="/club/rotary-navi-mumbai" className="rounded-2xl border border-slate-200 bg-slate-100 px-6 py-5 text-left hover:bg-slate-50">
              <h2 className="text-xl font-semibold">Club dashboard</h2>
              <p className="mt-2 text-slate-600">Browse members, announcements, projects, and dues.</p>
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold">Demo credentials</h2>
            <p className="mt-2 text-slate-600">Club slug: <strong>rotary-navi-mumbai</strong></p>
            <p className="text-slate-600">Email: <strong>admin@rotary.local</strong></p>
            <p className="text-slate-600">Password: <strong>admin123</strong></p>
          </div>
        </div>
      </div>
    </main>
  );
}
