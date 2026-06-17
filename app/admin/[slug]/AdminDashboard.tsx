'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ── Types ─────────────────────────────────────────────────────────────────────
type Child = { id?: string; name: string; dateOfBirth?: string | null };
type Member = {
  id: string; name: string; email?: string | null; phone?: string | null;
  classification?: string | null; dateOfBirth?: string | null; anniversary?: string | null;
  address?: string | null; businessName?: string | null; businessTagline?: string | null;
  spouseName?: string | null; spouseDob?: string | null; children: Child[];
};
type NewsItem = { id: string; title: string; body: string; pinned: boolean | null; createdAt?: string | null };
type Project = { id: string; title: string; avenue: string; description?: string | null; status?: string | null; startedAt?: string | null };
type Due = { id: string; memberId: string; amount: string | number; paid: boolean | null; dueDate?: string | null; member: { name: string } };
type Club = { id: string; name: string; slug: string };
type Tab = 'overview' | 'members' | 'news' | 'projects' | 'dues' | 'birthdays';

const AVENUES = ['Community Service', 'Vocational Service', 'Club Service', 'International Service', 'Youth Service'];

function fmt(iso: string | null | undefined) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtMD(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso);
  return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── Empty forms ────────────────────────────────────────────────────────────────
const EMPTY_MEMBER: Omit<Member, 'id'> = {
  name:'', email:'', phone:'', classification:'', dateOfBirth:'', anniversary:'',
  address:'', businessName:'', businessTagline:'', spouseName:'', spouseDob:'', children:[]
};
const EMPTY_NEWS: Omit<NewsItem, 'id'> = { title:'', body:'', pinned:false };
const EMPTY_PROJECT: Omit<Project, 'id'> = { title:'', avenue: AVENUES[0], description:'', status:'active' };
const EMPTY_DUE = { memberId:'', amount:'', dueDate:'', paid: false };

// ── Button helpers ─────────────────────────────────────────────────────────────
function Btn({ onClick, variant='primary', size='sm', children, disabled }:
  { onClick?:()=>void; variant?:'primary'|'ghost'|'danger'|'gold'; size?:'sm'|'md'; children:React.ReactNode; disabled?:boolean }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all disabled:opacity-50';
  const sz = size === 'md' ? 'px-5 py-2.5 text-sm' : 'px-3 py-1.5 text-xs';
  const v = {
    primary: 'bg-[#002664] text-white hover:bg-[#001a4a]',
    gold: 'bg-[#F7A81B] text-[#002664] hover:bg-[#e09810]',
    ghost: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
  }[variant];
  return <button onClick={onClick} disabled={disabled} className={`${base} ${sz} ${v}`}>{children}</button>;
}

function Input({ label, value, onChange, type='text', placeholder='', required=false, className='' }:
  { label?:string; value:string; onChange:(v:string)=>void; type?:string; placeholder?:string; required?:boolean; className?:string }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-xs font-medium text-slate-600 mb-1">{label}</span>}
      <input
        type={type} value={value} placeholder={placeholder} required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#002664] focus:ring-1 focus:ring-[#002664]/20"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }:
  { label?:string; value:string; onChange:(v:string)=>void }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-slate-600 mb-1">{label}</span>}
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#002664] resize-none"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }:
  { label?:string; value:string; onChange:(v:string)=>void; options:{value:string;label:string}[] }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-slate-600 mb-1">{label}</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#002664]">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function Card({ children, className='' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function Badge({ label, color='slate' }: { label: string; color?: 'slate'|'gold'|'green'|'red'|'blue' }) {
  const c = { slate:'bg-slate-100 text-slate-700', gold:'bg-amber-100 text-amber-700',
    green:'bg-green-100 text-green-700', red:'bg-red-100 text-red-700', blue:'bg-blue-100 text-blue-700' }[color];
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c}`}>{label}</span>;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard({
  slug, club,
  initialMembers, initialNews, initialProjects, initialDues
}: {
  slug: string; club: Club;
  initialMembers: Member[]; initialNews: NewsItem[];
  initialProjects: Project[]; initialDues: Due[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [dues, setDues] = useState<Due[]>(initialDues);
  const [busy, setBusy] = useState(false);

  const api = (path: string, method='GET', body?: unknown) =>
    fetch(`/api/${slug}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  // ── Nav ────────────────────────────────────────────────────────────────────
  const navItems: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '⬡' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'news', label: 'News', icon: '📢' },
    { id: 'projects', label: 'Projects', icon: '🌱' },
    { id: 'dues', label: 'Dues', icon: '💰' },
    { id: 'birthdays', label: 'Birthdays', icon: '🎂' },
  ];

  // ── Overview Tab ───────────────────────────────────────────────────────────
  const unpaid = dues.filter(d => !d.paid).length;
  const thisMonth = new Date().getMonth();
  const upcomingBdays = members.filter(m => m.dateOfBirth && new Date(m.dateOfBirth).getMonth() === thisMonth);

  // ── Members Tab ────────────────────────────────────────────────────────────
  const [memberSearch, setMemberSearch] = useState('');
  const [memberForm, setMemberForm] = useState<(Omit<Member,'id'> & { id?: string }) | null>(null);
  const [memberChildren, setMemberChildren] = useState<Child[]>([]);
  const csvRef = useRef<HTMLInputElement>(null);
  const [csvStatus, setCsvStatus] = useState('');

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(memberSearch.toLowerCase()) ||
    (m.classification || '').toLowerCase().includes(memberSearch.toLowerCase())
  );

  function openMemberForm(m?: Member) {
    if (m) {
      setMemberForm({ ...m });
      setMemberChildren(m.children.map(c => ({ ...c, dateOfBirth: c.dateOfBirth ? c.dateOfBirth.slice(0,10) : '' })));
    } else {
      setMemberForm({ ...EMPTY_MEMBER });
      setMemberChildren([]);
    }
  }

  async function saveMember() {
    if (!memberForm) return;
    setBusy(true);
    const payload = {
      ...memberForm,
      children: memberChildren.filter(c => c.name),
      dateOfBirth: memberForm.dateOfBirth || undefined,
      anniversary: memberForm.anniversary || undefined,
      spouseDob: memberForm.spouseDob || undefined,
    };
    const res = memberForm.id
      ? await api(`/members/${memberForm.id}`, 'PUT', payload)
      : await api('/members', 'POST', payload);
    if (res.ok) {
      const saved = await res.json();
      setMembers(prev => memberForm.id
        ? prev.map(m => m.id === memberForm.id ? saved : m)
        : [...prev, saved]
      );
      setMemberForm(null);
    } else {
      alert('Error saving member');
    }
    setBusy(false);
  }

  async function deleteMemberById(id: string) {
    if (!confirm('Delete this member?')) return;
    const res = await api(`/members/${id}`, 'DELETE');
    if (res.ok) setMembers(prev => prev.filter(m => m.id !== id));
  }

  async function uploadCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvStatus('Uploading...');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`/api/${slug}/members/csv`, { method: 'POST', body: fd });
    const data = await res.json();
    if (res.ok) {
      setCsvStatus(`Imported ${data.imported} members.${data.errors?.length ? ` ${data.errors.length} errors.` : ''}`);
      const fresh = await api('/members');
      if (fresh.ok) setMembers(await fresh.json());
    } else {
      setCsvStatus('Upload failed: ' + data.message);
    }
    e.target.value = '';
  }

  // ── News Tab ───────────────────────────────────────────────────────────────
  const [newsForm, setNewsForm] = useState<(Omit<NewsItem,'id'> & { id?: string }) | null>(null);

  async function saveNews() {
    if (!newsForm) return;
    setBusy(true);
    const res = newsForm.id
      ? await api(`/news/${newsForm.id}`, 'PUT', newsForm)
      : await api('/news', 'POST', newsForm);
    if (res.ok) {
      const saved = await res.json();
      setNews(prev => newsForm.id ? prev.map(n => n.id === newsForm.id ? saved : n) : [saved, ...prev]);
      setNewsForm(null);
    } else { alert('Error saving news'); }
    setBusy(false);
  }

  async function deleteNewsById(id: string) {
    if (!confirm('Delete this announcement?')) return;
    const res = await api(`/news/${id}`, 'DELETE');
    if (res.ok) setNews(prev => prev.filter(n => n.id !== id));
  }

  async function togglePin(item: NewsItem) {
    const res = await api(`/news/${item.id}`, 'PUT', { ...item, pinned: !item.pinned });
    if (res.ok) {
      const saved = await res.json();
      setNews(prev => prev.map(n => n.id === item.id ? saved : n));
    }
  }

  // ── Projects Tab ───────────────────────────────────────────────────────────
  const [projectForm, setProjectForm] = useState<(Omit<Project,'id'> & { id?: string }) | null>(null);

  async function saveProject() {
    if (!projectForm) return;
    setBusy(true);
    const res = projectForm.id
      ? await api(`/projects/${projectForm.id}`, 'PUT', projectForm)
      : await api('/projects', 'POST', projectForm);
    if (res.ok) {
      const saved = await res.json();
      setProjects(prev => projectForm.id ? prev.map(p => p.id === projectForm.id ? saved : p) : [saved, ...prev]);
      setProjectForm(null);
    } else { alert('Error saving project'); }
    setBusy(false);
  }

  async function deleteProjectById(id: string) {
    if (!confirm('Delete this project?')) return;
    const res = await api(`/projects/${id}`, 'DELETE');
    if (res.ok) setProjects(prev => prev.filter(p => p.id !== id));
  }

  // ── Dues Tab ───────────────────────────────────────────────────────────────
  const [dueForm, setDueForm] = useState<typeof EMPTY_DUE | null>(null);
  const [dueFilter, setDueFilter] = useState<'all'|'paid'|'unpaid'>('all');

  async function saveDue() {
    if (!dueForm) return;
    setBusy(true);
    const res = await api('/dues', 'POST', dueForm);
    if (res.ok) {
      const saved = await res.json();
      setDues(prev => [saved, ...prev]);
      setDueForm(null);
    } else { alert('Error saving due'); }
    setBusy(false);
  }

  async function toggleDue(due: Due) {
    const res = await api(`/dues/${due.id}`, 'PUT', { paid: !due.paid });
    if (res.ok) {
      const saved = await res.json();
      setDues(prev => prev.map(d => d.id === due.id ? saved : d));
    }
  }

  async function deleteDueById(id: string) {
    if (!confirm('Delete this due entry?')) return;
    const res = await api(`/dues/${id}`, 'DELETE');
    if (res.ok) setDues(prev => prev.filter(d => d.id !== id));
  }

  const filteredDues = dues.filter(d =>
    dueFilter === 'all' ? true : dueFilter === 'paid' ? d.paid : !d.paid
  );

  // ── Birthdays Tab ──────────────────────────────────────────────────────────
  const [bmonth, setBmonth] = useState(new Date().getMonth());

  type BdayEntry = { name: string; label: string; date: string };
  const bdays: BdayEntry[] = [];
  for (const m of members) {
    if (m.dateOfBirth && new Date(m.dateOfBirth).getMonth() === bmonth)
      bdays.push({ name: m.name, label: 'Birthday', date: m.dateOfBirth });
    if (m.anniversary && new Date(m.anniversary).getMonth() === bmonth)
      bdays.push({ name: m.name, label: 'Anniversary', date: m.anniversary });
    if (m.spouseName && m.spouseDob && new Date(m.spouseDob).getMonth() === bmonth)
      bdays.push({ name: `${m.spouseName} (spouse of ${m.name})`, label: 'Birthday', date: m.spouseDob });
    for (const c of m.children) {
      if (c.dateOfBirth && new Date(c.dateOfBirth).getMonth() === bmonth)
        bdays.push({ name: `${c.name} (child of ${m.name})`, label: 'Birthday', date: c.dateOfBirth });
    }
  }
  bdays.sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate());

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-[#002664] text-white shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#F7A81B] mb-1">Rotary Admin</div>
          <div className="text-sm font-semibold leading-tight text-white">{club.name}</div>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-left
                ${tab === item.id ? 'bg-white/15 text-white font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2">
          <a href={`/club/${slug}`} className="flex items-center gap-2 px-4 py-2 text-xs text-white/60 hover:text-white rounded-lg hover:bg-white/10">
            ↗ View club page
          </a>
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-white/60 hover:text-white rounded-lg hover:bg-white/10">
            ← Logout
          </button>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex bg-[#002664] text-white border-t border-white/10">
        {navItems.map(item => (
          <button key={item.id} onClick={() => setTab(item.id)}
            className={`flex-1 flex flex-col items-center py-2 text-[10px] gap-0.5
              ${tab === item.id ? 'text-[#F7A81B]' : 'text-white/60'}`}>
            <span className="text-base">{item.icon}</span>{item.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <>
              <h1 className="text-2xl font-bold text-[#002664]">Dashboard</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Members', value: members.length, color: 'bg-blue-50 text-[#002664]' },
                  { label: 'Projects', value: projects.length, color: 'bg-amber-50 text-amber-700' },
                  { label: 'News', value: news.length, color: 'bg-emerald-50 text-emerald-700' },
                  { label: 'Open Dues', value: unpaid, color: 'bg-rose-50 text-rose-700' },
                ].map(s => (
                  <Card key={s.label} className={`p-6 ${s.color}`}>
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-60">{s.label}</p>
                    <p className="mt-2 text-4xl font-bold">{s.value}</p>
                  </Card>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="p-6">
                  <h2 className="font-semibold text-[#002664] mb-4">Birthdays this month</h2>
                  {upcomingBdays.length === 0
                    ? <p className="text-sm text-slate-500">No birthdays this month.</p>
                    : upcomingBdays.map(m => (
                      <div key={m.id} className="flex items-center gap-3 py-2 border-b last:border-0 border-slate-100">
                        <span className="text-[#F7A81B]">🎂</span>
                        <span className="text-sm font-medium">{m.name}</span>
                        <span className="ml-auto text-xs text-slate-500">{fmtMD(m.dateOfBirth)}</span>
                      </div>
                    ))
                  }
                </Card>
                <Card className="p-6">
                  <h2 className="font-semibold text-[#002664] mb-4">Pinned announcements</h2>
                  {news.filter(n => n.pinned).length === 0
                    ? <p className="text-sm text-slate-500">No pinned news.</p>
                    : news.filter(n => n.pinned).slice(0, 3).map(n => (
                      <div key={n.id} className="py-2 border-b last:border-0 border-slate-100">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.body}</p>
                      </div>
                    ))
                  }
                </Card>
              </div>
            </>
          )}

          {/* ── Members ── */}
          {tab === 'members' && (
            <>
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-[#002664]">Members <span className="text-slate-400 font-normal text-lg">({members.length})</span></h1>
                <div className="flex gap-2">
                  <Btn variant="ghost" onClick={() => csvRef.current?.click()}>Upload CSV</Btn>
                  <Btn variant="gold" onClick={() => openMemberForm()}>+ Add member</Btn>
                </div>
              </div>
              <input ref={csvRef} type="file" accept=".csv" className="hidden" onChange={uploadCsv} />
              {csvStatus && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-4 py-2">{csvStatus}</p>}

              <Input placeholder="Search by name, email, or classification…" value={memberSearch} onChange={setMemberSearch} />

              {/* Add/edit form */}
              {memberForm && (
                <Card className="p-6 space-y-4 border-[#002664]/30 border-2">
                  <h2 className="font-semibold text-[#002664]">{memberForm.id ? 'Edit member' : 'New member'}</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input label="Full name *" value={memberForm.name} onChange={v => setMemberForm(f => f && ({ ...f, name: v }))} required />
                    <Input label="Email" type="email" value={memberForm.email || ''} onChange={v => setMemberForm(f => f && ({ ...f, email: v }))} />
                    <Input label="Phone" value={memberForm.phone || ''} onChange={v => setMemberForm(f => f && ({ ...f, phone: v }))} />
                    <Input label="Classification" value={memberForm.classification || ''} onChange={v => setMemberForm(f => f && ({ ...f, classification: v }))} />
                    <Input label="Date of birth" type="date" value={memberForm.dateOfBirth?.slice(0,10) || ''} onChange={v => setMemberForm(f => f && ({ ...f, dateOfBirth: v }))} />
                    <Input label="Anniversary" type="date" value={memberForm.anniversary?.slice(0,10) || ''} onChange={v => setMemberForm(f => f && ({ ...f, anniversary: v }))} />
                    <Input label="Address" value={memberForm.address || ''} onChange={v => setMemberForm(f => f && ({ ...f, address: v }))} className="sm:col-span-2" />
                    <Input label="Business name" value={memberForm.businessName || ''} onChange={v => setMemberForm(f => f && ({ ...f, businessName: v }))} />
                    <Input label="Business tagline" value={memberForm.businessTagline || ''} onChange={v => setMemberForm(f => f && ({ ...f, businessTagline: v }))} />
                    <Input label="Spouse name" value={memberForm.spouseName || ''} onChange={v => setMemberForm(f => f && ({ ...f, spouseName: v }))} />
                    <Input label="Spouse date of birth" type="date" value={memberForm.spouseDob?.slice(0,10) || ''} onChange={v => setMemberForm(f => f && ({ ...f, spouseDob: v }))} />
                  </div>
                  {/* Children */}
                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-2">Children</p>
                    {memberChildren.map((c, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <Input placeholder="Child name" value={c.name} onChange={v => setMemberChildren(cs => cs.map((ch, j) => j === i ? { ...ch, name: v } : ch))} />
                        <Input type="date" placeholder="DOB" value={c.dateOfBirth?.slice(0,10) || ''} onChange={v => setMemberChildren(cs => cs.map((ch, j) => j === i ? { ...ch, dateOfBirth: v } : ch))} />
                        <button onClick={() => setMemberChildren(cs => cs.filter((_, j) => j !== i))} className="text-rose-500 px-2">✕</button>
                      </div>
                    ))}
                    <Btn variant="ghost" onClick={() => setMemberChildren(cs => [...cs, { name: '', dateOfBirth: '' }])}>+ Add child</Btn>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Btn variant="primary" size="md" onClick={saveMember} disabled={busy || !memberForm.name}>Save</Btn>
                    <Btn variant="ghost" size="md" onClick={() => setMemberForm(null)}>Cancel</Btn>
                  </div>
                </Card>
              )}

              <div className="space-y-2">
                {filteredMembers.map(m => (
                  <Card key={m.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#002664]">{m.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{m.email || 'No email'} · {m.phone || 'No phone'}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {m.classification && <Badge label={m.classification} />}
                          {m.businessName && <Badge label={m.businessName} color="gold" />}
                          {m.spouseName && <Badge label={`Spouse: ${m.spouseName}`} color="blue" />}
                          {m.children.length > 0 && <Badge label={`${m.children.length} child${m.children.length > 1 ? 'ren' : ''}`} color="green" />}
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Btn variant="ghost" onClick={() => openMemberForm(m)}>Edit</Btn>
                        <Btn variant="danger" onClick={() => deleteMemberById(m.id)}>Del</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
                {filteredMembers.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">No members found.</p>}
              </div>
            </>
          )}

          {/* ── News ── */}
          {tab === 'news' && (
            <>
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-[#002664]">News & Announcements</h1>
                <Btn variant="gold" onClick={() => setNewsForm({ ...EMPTY_NEWS })}>+ Add news</Btn>
              </div>

              {newsForm && (
                <Card className="p-6 space-y-4 border-[#002664]/30 border-2">
                  <h2 className="font-semibold text-[#002664]">{newsForm.id ? 'Edit announcement' : 'New announcement'}</h2>
                  <Input label="Title *" value={newsForm.title} onChange={v => setNewsForm(f => f && ({ ...f, title: v }))} />
                  <TextArea label="Body *" value={newsForm.body} onChange={v => setNewsForm(f => f && ({ ...f, body: v }))} />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={!!newsForm.pinned} onChange={e => setNewsForm(f => f && ({ ...f, pinned: e.target.checked }))} className="rounded" />
                    Pin to top
                  </label>
                  <div className="flex gap-2 pt-2">
                    <Btn variant="primary" size="md" onClick={saveNews} disabled={busy || !newsForm.title || !newsForm.body}>Save</Btn>
                    <Btn variant="ghost" size="md" onClick={() => setNewsForm(null)}>Cancel</Btn>
                  </div>
                </Card>
              )}

              <div className="space-y-3">
                {news.map(n => (
                  <Card key={n.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {n.pinned && <Badge label="Pinned" color="gold" />}
                          <p className="font-semibold text-[#002664]">{n.title}</p>
                        </div>
                        <p className="text-sm text-slate-600">{n.body}</p>
                        <p className="text-xs text-slate-400 mt-2">{fmt(n.createdAt)}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Btn variant="ghost" onClick={() => togglePin(n)}>{n.pinned ? 'Unpin' : 'Pin'}</Btn>
                        <Btn variant="ghost" onClick={() => setNewsForm({ ...n })}>Edit</Btn>
                        <Btn variant="danger" onClick={() => deleteNewsById(n.id)}>Del</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
                {news.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">No announcements yet.</p>}
              </div>
            </>
          )}

          {/* ── Projects ── */}
          {tab === 'projects' && (
            <>
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-[#002664]">Projects <span className="text-slate-400 font-normal text-lg">({projects.length})</span></h1>
                <Btn variant="gold" onClick={() => setProjectForm({ ...EMPTY_PROJECT })}>+ Add project</Btn>
              </div>

              {projectForm && (
                <Card className="p-6 space-y-4 border-[#002664]/30 border-2">
                  <h2 className="font-semibold text-[#002664]">{projectForm.id ? 'Edit project' : 'New project'}</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input label="Title *" value={projectForm.title} onChange={v => setProjectForm(f => f && ({ ...f, title: v }))} className="sm:col-span-2" />
                    <Select label="Avenue" value={projectForm.avenue || AVENUES[0]} onChange={v => setProjectForm(f => f && ({ ...f, avenue: v }))}
                      options={AVENUES.map(a => ({ value: a, label: a }))} />
                    <Select label="Status" value={projectForm.status || 'active'} onChange={v => setProjectForm(f => f && ({ ...f, status: v }))}
                      options={[{value:'active',label:'Active'},{value:'completed',label:'Completed'},{value:'paused',label:'Paused'}]} />
                    <TextArea label="Description" value={projectForm.description || ''} onChange={v => setProjectForm(f => f && ({ ...f, description: v }))} />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Btn variant="primary" size="md" onClick={saveProject} disabled={busy || !projectForm.title}>Save</Btn>
                    <Btn variant="ghost" size="md" onClick={() => setProjectForm(null)}>Cancel</Btn>
                  </div>
                </Card>
              )}

              <div className="space-y-3">
                {projects.map(p => (
                  <Card key={p.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge label={p.avenue} color="blue" />
                          <Badge label={p.status || 'active'} color={p.status === 'completed' ? 'green' : p.status === 'paused' ? 'slate' : 'gold'} />
                        </div>
                        <p className="font-semibold text-[#002664]">{p.title}</p>
                        {p.description && <p className="text-sm text-slate-600 mt-1">{p.description}</p>}
                        <p className="text-xs text-slate-400 mt-2">Started {fmt(p.startedAt)}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Btn variant="ghost" onClick={() => setProjectForm({ ...p })}>Edit</Btn>
                        <Btn variant="danger" onClick={() => deleteProjectById(p.id)}>Del</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
                {projects.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">No projects yet.</p>}
              </div>
            </>
          )}

          {/* ── Dues ── */}
          {tab === 'dues' && (
            <>
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-[#002664]">Dues <span className="text-rose-500 text-base font-normal">{unpaid} unpaid</span></h1>
                <Btn variant="gold" onClick={() => setDueForm({ ...EMPTY_DUE })}>+ Add due</Btn>
              </div>

              {dueForm && (
                <Card className="p-6 space-y-4 border-[#002664]/30 border-2">
                  <h2 className="font-semibold text-[#002664]">New due entry</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Select label="Member *" value={dueForm.memberId} onChange={v => setDueForm(f => f && ({ ...f, memberId: v }))}
                      options={[{value:'',label:'Select member…'}, ...members.map(m => ({value:m.id, label:m.name}))]} />
                    <Input label="Amount (₹) *" type="number" value={dueForm.amount} onChange={v => setDueForm(f => f && ({ ...f, amount: v }))} />
                    <Input label="Due date" type="date" value={dueForm.dueDate} onChange={v => setDueForm(f => f && ({ ...f, dueDate: v }))} />
                    <label className="flex items-center gap-2 text-sm self-end pb-2">
                      <input type="checkbox" checked={dueForm.paid} onChange={e => setDueForm(f => f && ({ ...f, paid: e.target.checked }))} />
                      Already paid
                    </label>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Btn variant="primary" size="md" onClick={saveDue} disabled={busy || !dueForm.memberId || !dueForm.amount}>Save</Btn>
                    <Btn variant="ghost" size="md" onClick={() => setDueForm(null)}>Cancel</Btn>
                  </div>
                </Card>
              )}

              <div className="flex gap-2">
                {(['all','unpaid','paid'] as const).map(f => (
                  <button key={f} onClick={() => setDueFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-sm capitalize transition-all
                      ${dueFilter === f ? 'bg-[#002664] text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                    {f}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {filteredDues.map(d => (
                  <Card key={d.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <button onClick={() => toggleDue(d)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                          ${d.paid ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 hover:border-green-400'}`}>
                        {d.paid && '✓'}
                      </button>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{d.member.name}</p>
                        <p className="text-xs text-slate-500">{d.dueDate ? `Due ${fmt(d.dueDate)}` : 'No due date'}</p>
                      </div>
                      <span className={`font-semibold text-sm ${d.paid ? 'text-green-600' : 'text-rose-600'}`}>
                        ₹{Number(d.amount).toLocaleString('en-IN')}
                      </span>
                      <Badge label={d.paid ? 'Paid' : 'Unpaid'} color={d.paid ? 'green' : 'red'} />
                      <Btn variant="danger" onClick={() => deleteDueById(d.id)}>Del</Btn>
                    </div>
                  </Card>
                ))}
                {filteredDues.length === 0 && <p className="text-sm text-slate-500 py-4 text-center">No dues found.</p>}
              </div>
            </>
          )}

          {/* ── Birthdays ── */}
          {tab === 'birthdays' && (
            <>
              <h1 className="text-2xl font-bold text-[#002664]">Birthdays & Anniversaries</h1>
              <div className="flex flex-wrap gap-2">
                {MONTHS.map((m, i) => (
                  <button key={m} onClick={() => setBmonth(i)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all
                      ${bmonth === i ? 'bg-[#F7A81B] text-[#002664] font-semibold' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                    {m}
                  </button>
                ))}
              </div>
              <Card className="p-4">
                {bdays.length === 0
                  ? <p className="text-sm text-slate-500 py-4 text-center">No birthdays or anniversaries in {MONTHS[bmonth]}.</p>
                  : bdays.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 py-3 border-b last:border-0 border-slate-100">
                      <span className="text-xl">{b.label === 'Anniversary' ? '💍' : '🎂'}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{b.name}</p>
                        <p className="text-xs text-slate-500">{b.label}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#002664]">{fmtMD(b.date)}</span>
                    </div>
                  ))
                }
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
