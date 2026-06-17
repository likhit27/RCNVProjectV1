'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ── Types ─────────────────────────────────────────────────────────────────────
type Child = { id?: string; name: string; dateOfBirth?: string | null };
type Member = {
  id: string; name: string; rotaryId?: string | null; email?: string | null; phone?: string | null;
  classification?: string | null; occupation?: string | null; principalActivity?: string | null;
  inductionDate?: string | null; proposedBy?: string | null;
  dateOfBirth?: string | null; anniversary?: string | null;
  address?: string | null; businessName?: string | null; businessTagline?: string | null;
  businessAddress?: string | null; photoUrl?: string | null;
  spouseName?: string | null; spouseEmail?: string | null; spousePhone?: string | null;
  spouseDob?: string | null; children: Child[];
};
type News = { id: string; title: string; body: string; pinned: boolean | null; createdAt?: string | null };
type Project = { id: string; title: string; avenue: string; description?: string | null; status?: string | null };
type Due = { id: string; amount: string | number; paid: boolean | null; dueDate?: string | null };
type Club = { id: string; name: string; slug: string };
type CurrentUser = { id: string; email: string; role: string | null; memberId: string | null; member: { id: string; name: string } | null };
type Tab = 'dashboard' | 'directory' | 'projects' | 'news' | 'birthdays' | 'promotions' | 'dues';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Home', icon: '⬡' },
  { id: 'directory', label: 'Directory', icon: '👥' },
  { id: 'projects', label: 'Projects', icon: '🌱' },
  { id: 'news', label: 'News', icon: '📢' },
  { id: 'birthdays', label: 'Birthdays', icon: '🎂' },
  { id: 'promotions', label: 'Promotions', icon: '🏢' },
  { id: 'dues', label: 'My Dues', icon: '💰' },
];

function fmt(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtMD(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso); return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function Avatar({ name, photo, size = 'md' }: { name: string; photo?: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const sz = { sm: 'w-8 h-8 text-xs', md: 'w-12 h-12 text-sm', lg: 'w-16 h-16 text-xl' }[size];
  if (photo) return <img src={photo} alt={name} className={`${sz} rounded-full object-cover border-2 border-white shadow`} />;
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return <div className={`${sz} rounded-full bg-[#002664] text-white flex items-center justify-center font-bold shrink-0`}>{initials}</div>;
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function Badge({ label, color = 'slate' }: { label: string; color?: 'slate'|'gold'|'green'|'red'|'blue' }) {
  const c = { slate:'bg-slate-100 text-slate-700', gold:'bg-amber-100 text-amber-700', green:'bg-green-100 text-green-700', red:'bg-rose-100 text-rose-600', blue:'bg-blue-100 text-blue-700' }[color];
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c}`}>{label}</span>;
}

export default function MemberPortal({
  slug, club, currentUser,
  initialMembers, initialNews, initialProjects, initialMyDues
}: {
  slug: string; club: Club; currentUser: CurrentUser;
  initialMembers: Member[]; initialNews: News[];
  initialProjects: Project[]; initialMyDues: Due[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [search, setSearch] = useState('');
  const [bMonth, setBMonth] = useState(new Date().getMonth());

  const myMemberData = currentUser.memberId
    ? initialMembers.find(m => m.id === currentUser.memberId) ?? null
    : null;

  const myName = myMemberData?.name ?? currentUser.email;
  const thisMonth = new Date().getMonth();

  // Birthdays
  type BdayEntry = { name: string; label: string; date: string };
  const bdays: BdayEntry[] = [];
  for (const m of initialMembers) {
    if (m.dateOfBirth && new Date(m.dateOfBirth).getMonth() === bMonth)
      bdays.push({ name: m.name, label: 'Birthday', date: m.dateOfBirth });
    if (m.anniversary && new Date(m.anniversary).getMonth() === bMonth)
      bdays.push({ name: m.name, label: 'Anniversary', date: m.anniversary });
    if (m.spouseName && m.spouseDob && new Date(m.spouseDob).getMonth() === bMonth)
      bdays.push({ name: `${m.spouseName}`, label: `Spouse of ${m.name}`, date: m.spouseDob });
    for (const c of m.children)
      if (c.dateOfBirth && new Date(c.dateOfBirth).getMonth() === bMonth)
        bdays.push({ name: c.name, label: `Child of ${m.name}`, date: c.dateOfBirth });
  }
  bdays.sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate());

  const thisMonthBdays = bdays.filter(() => bMonth === thisMonth);
  const businesses = initialMembers.filter(m => m.businessName || m.principalActivity);
  const filteredMembers = initialMembers.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.classification || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(search.toLowerCase())
  );

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  // ── Sidebar nav ────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-[#002664] text-white shrink-0">
        <div className="p-6 border-b border-white/10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#F7A81B] mb-1">Member Portal</p>
          <p className="text-sm font-semibold">{club.name}</p>
        </div>
        {myMemberData && (
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            <Avatar name={myMemberData.name} photo={myMemberData.photoUrl} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{myMemberData.name}</p>
              <p className="text-xs text-white/50 truncate">{myMemberData.classification || 'Rotarian'}</p>
            </div>
          </div>
        )}
        <nav className="flex-1 py-4">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm text-left transition-colors
                ${tab === t.id ? 'bg-white/15 text-white font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-1">
          <p className="text-xs text-white/40 px-2 truncate">{currentUser.email}</p>
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-white/60 hover:text-white rounded-lg hover:bg-white/10">
            ← Logout
          </button>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex bg-[#002664] text-white border-t border-white/10">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center py-2 text-[9px] gap-0.5 ${tab === t.id ? 'text-[#F7A81B]' : 'text-white/60'}`}>
            <span className="text-base">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-5">

          {/* ── Dashboard ── */}
          {tab === 'dashboard' && (
            <>
              <div className="rounded-2xl bg-gradient-to-br from-[#002664] to-[#004ab5] text-white p-6">
                <div className="flex items-center gap-4">
                  <Avatar name={myName} photo={myMemberData?.photoUrl} size="lg" />
                  <div>
                    <p className="text-sm text-white/60">Welcome back,</p>
                    <h1 className="text-2xl font-bold">{myName}</h1>
                    {myMemberData?.classification && <p className="text-sm text-white/70 mt-0.5">{myMemberData.classification}</p>}
                  </div>
                </div>
                {myMemberData && (
                  <div className="grid grid-cols-3 gap-3 mt-5">
                    {myMemberData.rotaryId && <div className="bg-white/10 rounded-xl p-3 text-center"><p className="text-[10px] text-white/50 uppercase tracking-wide">Rotary ID</p><p className="font-bold text-sm mt-0.5">{myMemberData.rotaryId}</p></div>}
                    {myMemberData.inductionDate && <div className="bg-white/10 rounded-xl p-3 text-center"><p className="text-[10px] text-white/50 uppercase tracking-wide">Inducted</p><p className="font-bold text-sm mt-0.5">{fmt(myMemberData.inductionDate)}</p></div>}
                    {myMemberData.proposedBy && <div className="bg-white/10 rounded-xl p-3 text-center"><p className="text-[10px] text-white/50 uppercase tracking-wide">Proposed By</p><p className="font-bold text-sm mt-0.5">{myMemberData.proposedBy}</p></div>}
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-5">
                  <h2 className="font-semibold text-[#002664] mb-3">🎂 Birthdays this month</h2>
                  {bdays.filter(() => bMonth === thisMonth).length === 0
                    ? <p className="text-sm text-slate-400">None this month.</p>
                    : bdays.filter(() => bMonth === thisMonth).slice(0,5).map((b,i) => (
                      <div key={i} className="flex items-center gap-2 py-2 border-b last:border-0 border-slate-100">
                        <span className="text-lg">{b.label === 'Anniversary' ? '💍' : '🎂'}</span>
                        <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{b.name}</p><p className="text-xs text-slate-400">{b.label}</p></div>
                        <span className="text-xs font-bold text-[#F7A81B]">{fmtMD(b.date)}</span>
                      </div>
                    ))
                  }
                </Card>
                <Card className="p-5">
                  <h2 className="font-semibold text-[#002664] mb-3">📢 Latest news</h2>
                  {initialNews.slice(0,4).map(n => (
                    <div key={n.id} className="py-2 border-b last:border-0 border-slate-100">
                      <div className="flex items-center gap-1.5 mb-0.5">{n.pinned && <Badge label="Pinned" color="gold" />}<p className="text-sm font-medium">{n.title}</p></div>
                      <p className="text-xs text-slate-500 line-clamp-1">{n.body}</p>
                    </div>
                  ))}
                </Card>
              </div>

              {initialMyDues.length > 0 && (
                <Card className="p-5">
                  <h2 className="font-semibold text-[#002664] mb-3">💰 My upcoming dues</h2>
                  <div className="space-y-2">
                    {initialMyDues.filter(d => !d.paid).slice(0,3).map(d => (
                      <div key={d.id} className="flex items-center gap-3 py-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                        <p className="text-sm flex-1">{d.dueDate ? fmt(d.dueDate) : 'No due date'}</p>
                        <span className="font-bold text-rose-600">₹{Number(d.amount).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}

          {/* ── Directory ── */}
          {tab === 'directory' && (
            <>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#002664]">Directory</h1>
                <span className="text-slate-400 text-sm">({initialMembers.length} members)</span>
              </div>
              <input
                placeholder="Search by name, classification, email…"
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#002664]"
              />
              <div className="space-y-3">
                {filteredMembers.map(m => (
                  <Card key={m.id} className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar name={m.name} photo={m.photoUrl} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-[#002664]">{m.name}</p>
                          {m.rotaryId && <Badge label={`ID: ${m.rotaryId}`} color="blue" />}
                          {m.classification && <Badge label={m.classification} />}
                        </div>
                        {m.occupation && <p className="text-xs text-slate-500 mt-0.5">{m.occupation}</p>}
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                          {m.phone && <span>📞 {m.phone}</span>}
                          {m.email && <span>✉ {m.email}</span>}
                        </div>
                        {(m.spouseName || m.children.length > 0) && (
                          <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-0.5">
                            {m.spouseName && <p>💍 Spouse: <span className="font-medium text-slate-700">{m.spouseName}</span>{m.spouseDob ? ` · DOB: ${fmtMD(m.spouseDob)}` : ''}</p>}
                            {m.children.map((c,i) => <p key={i}>👶 {c.name}{c.dateOfBirth ? ` · ${fmtMD(c.dateOfBirth)}` : ''}</p>)}
                          </div>
                        )}
                        {m.address && <p className="text-xs text-slate-400 mt-1.5">📍 {m.address}</p>}
                      </div>
                    </div>
                  </Card>
                ))}
                {filteredMembers.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No members found.</p>}
              </div>
            </>
          )}

          {/* ── Projects ── */}
          {tab === 'projects' && (
            <>
              <h1 className="text-2xl font-bold text-[#002664]">Projects</h1>
              <div className="space-y-3">
                {initialProjects.map(p => (
                  <Card key={p.id} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-1">
                          <Badge label={p.avenue} color="blue" />
                          <Badge label={p.status || 'active'} color={p.status === 'completed' ? 'green' : p.status === 'paused' ? 'slate' : 'gold'} />
                        </div>
                        <p className="font-semibold text-[#002664]">{p.title}</p>
                        {p.description && <p className="text-sm text-slate-600 mt-1">{p.description}</p>}
                      </div>
                    </div>
                  </Card>
                ))}
                {initialProjects.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No projects yet.</p>}
              </div>
            </>
          )}

          {/* ── News ── */}
          {tab === 'news' && (
            <>
              <h1 className="text-2xl font-bold text-[#002664]">Rotary News</h1>
              <div className="space-y-3">
                {initialNews.map(n => (
                  <Card key={n.id} className={`p-5 ${n.pinned ? 'border-amber-300' : ''}`}>
                    <div className="flex items-start gap-2 mb-1">
                      {n.pinned && <Badge label="Pinned" color="gold" />}
                      <p className="font-semibold text-[#002664]">{n.title}</p>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-line">{n.body}</p>
                    <p className="text-xs text-slate-400 mt-3">{fmt(n.createdAt)}</p>
                  </Card>
                ))}
                {initialNews.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No announcements yet.</p>}
              </div>
            </>
          )}

          {/* ── Birthdays ── */}
          {tab === 'birthdays' && (
            <>
              <h1 className="text-2xl font-bold text-[#002664]">Birthdays & Anniversaries</h1>
              <div className="flex flex-wrap gap-2">
                {MONTHS.map((m, i) => (
                  <button key={m} onClick={() => setBMonth(i)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${bMonth === i ? 'bg-[#F7A81B] text-[#002664] font-semibold' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                    {m}
                  </button>
                ))}
              </div>
              <Card className="p-4">
                {bdays.length === 0
                  ? <p className="text-sm text-slate-400 py-4 text-center">No celebrations in {MONTHS[bMonth]}.</p>
                  : bdays.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 py-3 border-b last:border-0 border-slate-100">
                      <span className="text-2xl">{b.label === 'Anniversary' ? '💍' : '🎂'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{b.name}</p>
                        <p className="text-xs text-slate-400">{b.label}</p>
                      </div>
                      <span className="text-sm font-bold text-[#F7A81B]">{fmtMD(b.date)}</span>
                    </div>
                  ))
                }
              </Card>
            </>
          )}

          {/* ── Promotions ── */}
          {tab === 'promotions' && (
            <>
              <h1 className="text-2xl font-bold text-[#002664]">Branding & Promotions</h1>
              <p className="text-sm text-slate-500">Support your fellow Rotarians' businesses.</p>
              {businesses.length === 0
                ? <p className="text-sm text-slate-400 text-center py-8">No business listings yet.</p>
                : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {businesses.map(m => (
                      <Card key={m.id} className="p-5 border-amber-200">
                        <div className="flex items-start gap-3">
                          <Avatar name={m.name} photo={m.photoUrl} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#002664]">{m.businessName || m.principalActivity}</p>
                            {m.businessTagline && <p className="text-xs text-slate-500 italic mt-0.5">{m.businessTagline}</p>}
                            {m.occupation && <p className="text-xs text-slate-500 mt-1">{m.occupation}</p>}
                            <p className="text-xs text-slate-400 mt-2">— {m.name}</p>
                            <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-500">
                              {m.phone && <span>📞 {m.phone}</span>}
                              {m.email && <span>✉ {m.email}</span>}
                            </div>
                            {m.businessAddress && <p className="text-xs text-slate-400 mt-1">📍 {m.businessAddress}</p>}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )
              }
            </>
          )}

          {/* ── My Dues ── */}
          {tab === 'dues' && (
            <>
              <h1 className="text-2xl font-bold text-[#002664]">My Dues</h1>
              {!currentUser.memberId
                ? <Card className="p-6 text-center"><p className="text-slate-500">Your account is not linked to a member record. Contact the admin.</p></Card>
                : initialMyDues.length === 0
                  ? <Card className="p-6 text-center"><p className="text-slate-500">No dues on record. You&apos;re all clear! ✅</p></Card>
                  : (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <Card className="p-4 text-center bg-rose-50 border-rose-200">
                          <p className="text-xs uppercase tracking-wide text-rose-500 font-semibold">Unpaid</p>
                          <p className="text-3xl font-bold text-rose-600 mt-1">₹{initialMyDues.filter(d=>!d.paid).reduce((s,d)=>s+Number(d.amount),0).toLocaleString('en-IN')}</p>
                        </Card>
                        <Card className="p-4 text-center bg-green-50 border-green-200">
                          <p className="text-xs uppercase tracking-wide text-green-600 font-semibold">Paid</p>
                          <p className="text-3xl font-bold text-green-600 mt-1">₹{initialMyDues.filter(d=>d.paid).reduce((s,d)=>s+Number(d.amount),0).toLocaleString('en-IN')}</p>
                        </Card>
                      </div>
                      <div className="space-y-2">
                        {initialMyDues.map(d => (
                          <Card key={d.id} className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full shrink-0 ${d.paid ? 'bg-green-500' : 'bg-rose-400'}`} />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{d.dueDate ? fmt(d.dueDate) : 'No due date'}</p>
                              </div>
                              <span className={`font-bold ${d.paid ? 'text-green-600' : 'text-rose-600'}`}>₹{Number(d.amount).toLocaleString('en-IN')}</span>
                              <Badge label={d.paid ? 'Paid' : 'Unpaid'} color={d.paid ? 'green' : 'red'} />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </>
                  )
              }
            </>
          )}

        </div>
      </main>
    </div>
  );
}
