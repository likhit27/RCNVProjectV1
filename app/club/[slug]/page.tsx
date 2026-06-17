export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getClubBySlug, getFullMembers, getNews, getProjects, getDuesSummary } from '@/lib/db';

function fmt(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso);
  return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default async function ClubPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const club = await getClubBySlug(slug);
  const members = await getFullMembers(club.id);
  const news = await getNews(club.id);
  const projects = await getProjects(club.id);
  const dues = await getDuesSummary(club.id);

  const now = new Date();
  const thisMonth = now.getMonth();

  // Birthdays this month
  type BdayEntry = { name: string; label: string; day: number };
  const bdayEntries: BdayEntry[] = [];
  for (const m of members) {
    if (m.dateOfBirth && new Date(m.dateOfBirth).getMonth() === thisMonth)
      bdayEntries.push({ name: m.name, label: 'Birthday', day: new Date(m.dateOfBirth).getDate() });
    if (m.anniversary && new Date(m.anniversary).getMonth() === thisMonth)
      bdayEntries.push({ name: m.name, label: 'Anniversary', day: new Date(m.anniversary).getDate() });
    if (m.spouseName && m.spouseDob && new Date(m.spouseDob).getMonth() === thisMonth)
      bdayEntries.push({ name: `${m.spouseName}`, label: `Spouse of ${m.name}`, day: new Date(m.spouseDob).getDate() });
    for (const c of m.children) {
      if (c.dateOfBirth && new Date(c.dateOfBirth).getMonth() === thisMonth)
        bdayEntries.push({ name: c.name, label: `Child of ${m.name}`, day: new Date(c.dateOfBirth).getDate() });
    }
  }
  bdayEntries.sort((a, b) => a.day - b.day);

  // Business listings
  const businesses = members.filter(m => m.businessName);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#002664] text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F7A81B]">Rotary Club</p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-1">{club.name}</h1>
          </div>
          <Link href="/login" className="self-start sm:self-auto rounded-full border border-white/30 px-5 py-2.5 text-sm text-white hover:bg-white/10 transition-colors">
            Admin login
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Members', value: members.length, icon: '👥' },
            { label: 'Projects', value: projects.filter(p => p.status === 'active' || !p.status).length, icon: '🌱' },
            { label: 'Announcements', value: news.length, icon: '📢' },
            { label: 'Open dues', value: dues.unpaidCount, icon: '💰' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center">
              <div className="text-2xl">{s.icon}</div>
              <div className="text-3xl font-bold text-[#002664] mt-1">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Announcements */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#002664] mb-4">Announcements</h2>
            {news.length === 0 && <p className="text-sm text-slate-500">No announcements yet.</p>}
            <div className="space-y-3">
              {news.map(item => (
                <article key={item.id} className={`rounded-xl p-4 ${item.pinned ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {item.pinned && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Pinned</span>
                    )}
                    <h3 className="font-semibold text-[#002664]">{item.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          {/* This month */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#002664] mb-4">
              {MONTH_NAMES[thisMonth]} Celebrations
            </h2>
            {bdayEntries.length === 0
              ? <p className="text-sm text-slate-500">No celebrations this month.</p>
              : (
                <div className="space-y-2">
                  {bdayEntries.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0 border-slate-100">
                      <span className="text-xl shrink-0">{b.label === 'Anniversary' ? '💍' : '🎂'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{b.name}</p>
                        <p className="text-xs text-slate-500">{b.label}</p>
                      </div>
                      <span className="text-sm font-bold text-[#F7A81B] shrink-0">{MONTH_NAMES[thisMonth]} {b.day}</span>
                    </div>
                  ))}
                </div>
              )
            }
          </section>
        </div>

        {/* Active projects */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#002664] mb-4">Active Projects</h2>
          {projects.filter(p => p.status !== 'completed').length === 0
            ? <p className="text-sm text-slate-500">No active projects.</p>
            : (
              <div className="grid gap-3 sm:grid-cols-2">
                {projects.filter(p => p.status !== 'completed').map(p => (
                  <div key={p.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#009CDE]">{p.avenue}</span>
                    <h3 className="font-semibold text-[#002664] mt-1">{p.title}</h3>
                    {p.description && <p className="text-sm text-slate-600 mt-1">{p.description}</p>}
                  </div>
                ))}
              </div>
            )
          }
        </section>

        {/* Member directory */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#002664] mb-4">Member Directory</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.map(m => (
              <div key={m.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-[#002664]">{m.name}</p>
                {m.classification && <p className="text-xs text-slate-500 mt-0.5">{m.classification}</p>}
                {m.phone && <p className="text-xs text-slate-500 mt-1">📞 {m.phone}</p>}
                {m.email && <p className="text-xs text-slate-500">✉ {m.email}</p>}
                {m.spouseName && (
                  <p className="text-xs text-slate-400 mt-1">Spouse: {m.spouseName}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Business / Promotions */}
        {businesses.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#002664] mb-1">Member Businesses</h2>
            <p className="text-sm text-slate-500 mb-4">Support fellow Rotarians.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {businesses.map(m => (
                <div key={m.id} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="font-bold text-[#002664]">{m.businessName}</p>
                  {m.businessTagline && <p className="text-xs text-slate-600 mt-0.5 italic">{m.businessTagline}</p>}
                  <p className="text-xs text-slate-500 mt-2">— {m.name}</p>
                  {m.phone && <p className="text-xs text-slate-500">📞 {m.phone}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="bg-[#002664] text-white/60 text-xs text-center py-6 mt-8">
        {club.name} · Powered by RCNV Platform
      </footer>
    </main>
  );
}
