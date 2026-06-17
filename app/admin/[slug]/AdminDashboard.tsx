'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ── Types ─────────────────────────────────────────────────────────────────────
type Child = { id?: string; name: string; dateOfBirth?: string | null };
type Member = {
  id: string; name: string; rotaryId?: string|null; email?: string|null; phone?: string|null;
  classification?: string|null; occupation?: string|null; principalActivity?: string|null;
  inductionDate?: string|null; proposedBy?: string|null;
  dateOfBirth?: string|null; anniversary?: string|null;
  address?: string|null; businessName?: string|null; businessTagline?: string|null;
  businessAddress?: string|null; photoUrl?: string|null;
  spouseName?: string|null; spouseEmail?: string|null; spousePhone?: string|null;
  spouseDob?: string|null; children: Child[];
};
type News = { id: string; title: string; body: string; pinned: boolean|null; createdAt?: string|null };
type Project = { id: string; title: string; avenue: string; description?: string|null; status?: string|null; startedAt?: string|null };
type Due = { id: string; memberId: string; amount: string|number; paid: boolean|null; dueDate?: string|null; member: { id: string; name: string } };
type ClubUser = { id: string; email: string; role: string|null; memberId: string|null; member: { id: string; name: string }|null };
type Club = { id: string; name: string; slug: string };
type Role = 'super_admin'|'secretary'|'treasurer'|'president'|'member';
type Tab = 'overview'|'members'|'news'|'projects'|'dues'|'birthdays'|'users';

const AVENUES = ['Community Service','Vocational Service','Club Service','International Service','Youth Service'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const ROLES: { value: Role; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'secretary', label: 'Club Secretary' },
  { value: 'treasurer', label: 'Treasurer' },
  { value: 'president', label: 'President' },
  { value: 'member', label: 'Member' },
];

function fmt(iso: string|null|undefined) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtMD(iso: string|null|undefined) {
  if (!iso) return null;
  const d = new Date(iso); return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

// ── Small reusable UI ─────────────────────────────────────────────────────────
function Btn({ onClick, variant='primary', size='sm', children, disabled, type='button' }:
  { onClick?:()=>void; variant?:'primary'|'ghost'|'danger'|'gold'; size?:'sm'|'md'; children:React.ReactNode; disabled?:boolean; type?:'button'|'submit' }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all disabled:opacity-50 cursor-pointer';
  const sz = size==='md' ? 'px-5 py-2.5 text-sm' : 'px-3 py-1.5 text-xs';
  const v = { primary:'bg-[#002664] text-white hover:bg-[#001a4a]', gold:'bg-[#F7A81B] text-[#002664] hover:bg-[#e09810]', ghost:'border border-slate-300 text-slate-700 hover:bg-slate-50', danger:'bg-rose-600 text-white hover:bg-rose-700' }[variant];
  return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sz} ${v}`}>{children}</button>;
}
function Inp({ label, value, onChange, type='text', placeholder='', className='', required=false }:
  { label?:string; value:string; onChange:(v:string)=>void; type?:string; placeholder?:string; className?:string; required?:boolean }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-xs font-medium text-slate-600 mb-1">{label}</span>}
      <input type={type} value={value} placeholder={placeholder} required={required} onChange={e=>onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#002664] focus:ring-1 focus:ring-[#002664]/20" />
    </label>
  );
}
function Sel({ label, value, onChange, options }:
  { label?:string; value:string; onChange:(v:string)=>void; options:{value:string;label:string}[] }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-slate-600 mb-1">{label}</span>}
      <select value={value} onChange={e=>onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#002664]">
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
function Txt({ label, value, onChange }:{ label?:string; value:string; onChange:(v:string)=>void }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-slate-600 mb-1">{label}</span>}
      <textarea value={value} onChange={e=>onChange(e.target.value)} rows={3}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#002664] resize-none" />
    </label>
  );
}
function Card({ children, className='' }:{ children:React.ReactNode; className?:string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}
function Badge({ label, color='slate' }:{ label:string; color?:'slate'|'gold'|'green'|'red'|'blue'|'purple' }) {
  const c = { slate:'bg-slate-100 text-slate-700', gold:'bg-amber-100 text-amber-700', green:'bg-green-100 text-green-700', red:'bg-rose-100 text-rose-600', blue:'bg-blue-100 text-blue-700', purple:'bg-purple-100 text-purple-700' }[color];
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c}`}>{label}</span>;
}
function Avatar({ name, photo }:{ name:string; photo?:string|null }) {
  if (photo) return <img src={photo} alt={name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow shrink-0" />;
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return <div className="w-10 h-10 rounded-full bg-[#002664] text-white flex items-center justify-center font-bold text-sm shrink-0">{initials}</div>;
}

function roleBadge(role: string|null) {
  const map: Record<string, { label: string; color: 'blue'|'purple'|'gold'|'green'|'slate' }> = {
    super_admin: { label: 'Super Admin', color: 'purple' }, secretary: { label: 'Secretary', color: 'blue' },
    treasurer: { label: 'Treasurer', color: 'gold' }, president: { label: 'President', color: 'green' },
    member: { label: 'Member', color: 'slate' }
  };
  const r = map[role || 'member'] || { label: role || 'member', color: 'slate' };
  return <Badge label={r.label} color={r.color} />;
}

// ── Empty forms ───────────────────────────────────────────────────────────────
const EMPTY_MEMBER: Omit<Member,'id'> = {
  name:'', rotaryId:'', email:'', phone:'', classification:'', occupation:'', principalActivity:'',
  inductionDate:'', proposedBy:'', dateOfBirth:'', anniversary:'',
  address:'', businessName:'', businessTagline:'', businessAddress:'', photoUrl:'',
  spouseName:'', spouseEmail:'', spousePhone:'', spouseDob:'', children:[]
};

export default function AdminDashboard({
  slug, club, currentRole,
  initialMembers, initialNews, initialProjects, initialDues, initialUsers
}: {
  slug: string; club: Club; currentRole: Role;
  initialMembers: Member[]; initialNews: News[]; initialProjects: Project[];
  initialDues: Due[]; initialUsers: ClubUser[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [members, setMembers] = useState(initialMembers);
  const [news, setNews] = useState(initialNews);
  const [projects, setProjects] = useState(initialProjects);
  const [dues, setDues] = useState(initialDues);
  const [users, setUsers] = useState(initialUsers);
  const [busy, setBusy] = useState(false);

  // Role permissions
  const can = {
    members: ['super_admin','secretary'].includes(currentRole),
    news: ['super_admin','secretary'].includes(currentRole),
    projects: ['super_admin'].includes(currentRole),
    dues: ['super_admin','treasurer'].includes(currentRole),
    users: ['super_admin'].includes(currentRole),
    overview: true,
    birthdays: true,
  };

  type NavItem = { id: Tab; label: string; icon: string; allowed: boolean };
  const navItems: NavItem[] = ([
    { id:'overview', label:'Overview', icon:'⬡', allowed: true },
    { id:'members', label:'Members', icon:'👥', allowed: can.members },
    { id:'news', label:'News', icon:'📢', allowed: can.news },
    { id:'projects', label:'Projects', icon:'🌱', allowed: can.projects },
    { id:'dues', label:'Dues', icon:'💰', allowed: can.dues },
    { id:'birthdays', label:'Birthdays', icon:'🎂', allowed: true },
    { id:'users', label:'Users', icon:'🔑', allowed: can.users },
  ] satisfies NavItem[]).filter(n => n.allowed);

  const api = (path: string, method='GET', body?: unknown) =>
    fetch(`/api/${slug}${path}`, { method, headers: body ? {'Content-Type':'application/json'} : undefined, body: body ? JSON.stringify(body) : undefined });

  async function logout() { await fetch('/api/auth/logout',{method:'POST'}); router.push('/login'); }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const unpaid = dues.filter(d=>!d.paid).length;
  const thisMonth = new Date().getMonth();
  const upcomingBdays = members.filter(m=>m.dateOfBirth && new Date(m.dateOfBirth).getMonth()===thisMonth);

  // ── Members state ──────────────────────────────────────────────────────────
  const [memberSearch, setMemberSearch] = useState('');
  const [memberForm, setMemberForm] = useState<(Omit<Member,'id'>&{id?:string})|null>(null);
  const [memberChildren, setMemberChildren] = useState<Child[]>([]);
  const [memberTab, setMemberTab] = useState<'basic'|'family'|'business'>('basic');
  const fileRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState('');

  const filteredMembers = members.filter(m =>
    !memberSearch || m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    (m.email||'').toLowerCase().includes(memberSearch.toLowerCase()) ||
    (m.rotaryId||'').includes(memberSearch)
  );

  function openMemberForm(m?: Member) {
    if (m) { setMemberForm({...m}); setMemberChildren(m.children.map(c=>({...c, dateOfBirth: c.dateOfBirth?.slice(0,10)||''}))); }
    else { setMemberForm({...EMPTY_MEMBER}); setMemberChildren([]); }
    setMemberTab('basic');
  }

  async function saveMember() {
    if (!memberForm) return;
    setBusy(true);
    const payload = { ...memberForm, children: memberChildren.filter(c=>c.name) };
    const res = memberForm.id ? await api(`/members/${memberForm.id}`,'PUT',payload) : await api('/members','POST',payload);
    if (res.ok) { const saved=await res.json(); setMembers(prev=>memberForm.id?prev.map(m=>m.id===memberForm.id?saved:m):[...prev,saved]); setMemberForm(null); }
    else alert('Error saving member');
    setBusy(false);
  }

  async function deleteMemberById(id: string) {
    if (!confirm('Delete this member and all their data?')) return;
    const res = await api(`/members/${id}`,'DELETE');
    if (res.ok) setMembers(prev=>prev.filter(m=>m.id!==id));
  }

  async function importFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setImportStatus('Importing…');
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch(`/api/${slug}/members/csv`,{method:'POST',body:fd});
    const data = await res.json();
    if (res.ok) {
      setImportStatus(`✅ Imported ${data.imported} members · ${data.loginsCreated} new logins created (password = mobile number)${data.loginsSkipped?` · ${data.loginsSkipped} logins already existed`:''}${data.errors?.length?` · ${data.errors.length} skipped`:''}`)
      const fresh = await api('/members'); if(fresh.ok) setMembers(await fresh.json());
    } else { setImportStatus('❌ Import failed: '+data.message); }
    e.target.value='';
  }

  // ── News state ─────────────────────────────────────────────────────────────
  const [newsForm, setNewsForm] = useState<(Omit<News,'id'>&{id?:string})|null>(null);

  async function saveNews() {
    if (!newsForm) return; setBusy(true);
    const res = newsForm.id ? await api(`/news/${newsForm.id}`,'PUT',newsForm) : await api('/news','POST',newsForm);
    if (res.ok) { const s=await res.json(); setNews(prev=>newsForm.id?prev.map(n=>n.id===newsForm.id?s:n):[s,...prev]); setNewsForm(null); }
    else alert('Error saving news');
    setBusy(false);
  }

  async function togglePin(item: News) {
    const res = await api(`/news/${item.id}`,'PUT',{...item,pinned:!item.pinned});
    if (res.ok) { const s=await res.json(); setNews(prev=>prev.map(n=>n.id===item.id?s:n)); }
  }

  // ── Projects state ─────────────────────────────────────────────────────────
  const [projectForm, setProjectForm] = useState<(Omit<Project,'id'>&{id?:string})|null>(null);

  async function saveProject() {
    if (!projectForm) return; setBusy(true);
    const res = projectForm.id ? await api(`/projects/${projectForm.id}`,'PUT',projectForm) : await api('/projects','POST',projectForm);
    if (res.ok) { const s=await res.json(); setProjects(prev=>projectForm.id?prev.map(p=>p.id===projectForm.id?s:p):[s,...prev]); setProjectForm(null); }
    else alert('Error saving project');
    setBusy(false);
  }

  // ── Dues state ─────────────────────────────────────────────────────────────
  const [dueForm, setDueForm] = useState<{memberId:string;amount:string;dueDate:string;paid:boolean}|null>(null);
  const [dueFilter, setDueFilter] = useState<'all'|'paid'|'unpaid'>('unpaid');

  async function saveDue() {
    if (!dueForm) return; setBusy(true);
    const res = await api('/dues','POST',dueForm);
    if (res.ok) { const s=await res.json(); setDues(prev=>[s,...prev]); setDueForm(null); }
    else alert('Error saving due');
    setBusy(false);
  }

  async function toggleDue(d: Due) {
    const res = await api(`/dues/${d.id}`,'PUT',{paid:!d.paid});
    if (res.ok) { const s=await res.json(); setDues(prev=>prev.map(x=>x.id===d.id?s:x)); }
  }

  // ── Users state ────────────────────────────────────────────────────────────
  const [userForm, setUserForm] = useState<{id?:string;email:string;password:string;role:string;memberId:string}|null>(null);

  async function saveUser() {
    if (!userForm) return; setBusy(true);
    const payload = { email: userForm.email, password: userForm.password||undefined, role: userForm.role, memberId: userForm.memberId||null };
    const res = userForm.id ? await api(`/users/${userForm.id}`,'PUT',payload) : await api('/users','POST',payload);
    if (res.ok) { const s=await res.json(); setUsers(prev=>userForm.id?prev.map(u=>u.id===userForm.id?s:u):[s,...prev]); setUserForm(null); }
    else { const e=await res.json(); alert('Error: '+e.message); }
    setBusy(false);
  }

  async function deleteUser(id: string) {
    if (!confirm('Delete this user account?')) return;
    const res = await api(`/users/${id}`,'DELETE');
    if (res.ok) setUsers(prev=>prev.filter(u=>u.id!==id));
  }

  // ── Birthdays ──────────────────────────────────────────────────────────────
  const [bmonth, setBmonth] = useState(thisMonth);
  type BdayEntry = { name:string; label:string; date:string };
  const bdays: BdayEntry[] = [];
  for (const m of members) {
    if (m.dateOfBirth && new Date(m.dateOfBirth).getMonth()===bmonth) bdays.push({name:m.name,label:'Birthday',date:m.dateOfBirth});
    if (m.anniversary && new Date(m.anniversary).getMonth()===bmonth) bdays.push({name:m.name,label:'Anniversary',date:m.anniversary});
    if (m.spouseName && m.spouseDob && new Date(m.spouseDob).getMonth()===bmonth) bdays.push({name:`${m.spouseName} (spouse of ${m.name})`,label:'Birthday',date:m.spouseDob});
    for (const c of m.children) if (c.dateOfBirth && new Date(c.dateOfBirth).getMonth()===bmonth) bdays.push({name:`${c.name} (child of ${m.name})`,label:'Birthday',date:c.dateOfBirth});
  }
  bdays.sort((a,b)=>new Date(a.date).getDate()-new Date(b.date).getDate());

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-[#002664] text-white shrink-0">
        <div className="p-6 border-b border-white/10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#F7A81B] mb-1">Admin Panel</p>
          <p className="text-sm font-semibold leading-tight">{club.name}</p>
          <div className="mt-2">{roleBadge(currentRole)}</div>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(item=>(
            <button key={item.id} onClick={()=>setTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm text-left transition-colors ${tab===item.id?'bg-white/15 text-white font-semibold':'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 space-y-1">
          <a href={`/portal/${slug}`} className="flex items-center gap-2 px-4 py-2 text-xs text-white/60 hover:text-white rounded-lg hover:bg-white/10">↗ Member portal</a>
          <a href={`/club/${slug}`} className="flex items-center gap-2 px-4 py-2 text-xs text-white/60 hover:text-white rounded-lg hover:bg-white/10">↗ Public page</a>
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-white/60 hover:text-white rounded-lg hover:bg-white/10">← Logout</button>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex bg-[#002664] text-white border-t border-white/10">
        {navItems.map(item=>(
          <button key={item.id} onClick={()=>setTab(item.id)}
            className={`flex-1 flex flex-col items-center py-2 text-[9px] gap-0.5 ${tab===item.id?'text-[#F7A81B]':'text-white/60'}`}>
            <span className="text-base">{item.icon}</span>{item.label}
          </button>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 pb-24 lg:pb-0">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-5">

          {/* ── Overview ── */}
          {tab==='overview' && (
            <>
              <h1 className="text-2xl font-bold text-[#002664]">Dashboard</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[{label:'Members',value:members.length,color:'bg-blue-50 text-[#002664]'},{label:'Projects',value:projects.length,color:'bg-amber-50 text-amber-700'},{label:'News',value:news.length,color:'bg-emerald-50 text-emerald-700'},{label:'Open Dues',value:unpaid,color:'bg-rose-50 text-rose-700'}].map(s=>(
                  <Card key={s.label} className={`p-6 ${s.color}`}>
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-60">{s.label}</p>
                    <p className="mt-2 text-4xl font-bold">{s.value}</p>
                  </Card>
                ))}
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="p-5">
                  <h2 className="font-semibold text-[#002664] mb-3">🎂 Birthdays this month</h2>
                  {upcomingBdays.length===0?<p className="text-sm text-slate-400">None this month.</p>:upcomingBdays.slice(0,5).map(m=>(
                    <div key={m.id} className="flex items-center gap-3 py-2 border-b last:border-0 border-slate-100">
                      <Avatar name={m.name} photo={m.photoUrl} />
                      <span className="text-sm font-medium flex-1">{m.name}</span>
                      <span className="text-xs font-bold text-[#F7A81B]">{fmtMD(m.dateOfBirth)}</span>
                    </div>
                  ))}
                </Card>
                <Card className="p-5">
                  <h2 className="font-semibold text-[#002664] mb-3">📢 Pinned announcements</h2>
                  {news.filter(n=>n.pinned).length===0?<p className="text-sm text-slate-400">None pinned.</p>:news.filter(n=>n.pinned).slice(0,3).map(n=>(
                    <div key={n.id} className="py-2 border-b last:border-0 border-slate-100">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{n.body}</p>
                    </div>
                  ))}
                </Card>
              </div>
            </>
          )}

          {/* ── Members ── */}
          {tab==='members' && (
            <>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[#002664]">Members <span className="text-slate-400 font-normal text-lg">({members.length})</span></h1>
                <div className="flex gap-2 flex-wrap">
                  <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={importFile} />
                  <Btn variant="ghost" onClick={()=>fileRef.current?.click()}>📥 Import Excel/CSV</Btn>
                  <Btn variant="gold" onClick={()=>openMemberForm()}>+ Add member</Btn>
                </div>
              </div>
              {importStatus && <p className={`text-sm rounded-xl px-4 py-2 ${importStatus.startsWith('✅')?'bg-green-50 text-green-700':'bg-rose-50 text-rose-700'}`}>{importStatus}</p>}
              <Inp placeholder="Search by name, email, Rotary ID…" value={memberSearch} onChange={setMemberSearch} />

              {/* Add/edit form */}
              {memberForm && (
                <Card className="p-6 border-2 border-[#002664]/20">
                  <h2 className="font-semibold text-[#002664] mb-4">{memberForm.id?'Edit member':'Add new member'}</h2>
                  {/* Sub-tabs */}
                  <div className="flex gap-1 mb-4 bg-slate-100 rounded-xl p-1">
                    {(['basic','family','business'] as const).map(t=>(
                      <button key={t} onClick={()=>setMemberTab(t)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${memberTab===t?'bg-white shadow text-[#002664]':'text-slate-500'}`}>{t}</button>
                    ))}
                  </div>

                  {memberTab==='basic' && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Inp label="Full Name *" value={memberForm.name} onChange={v=>setMemberForm(f=>f&&({...f,name:v}))} required className="sm:col-span-2" />
                      <Inp label="Rotary ID" value={memberForm.rotaryId||''} onChange={v=>setMemberForm(f=>f&&({...f,rotaryId:v}))} />
                      <Inp label="Classification" value={memberForm.classification||''} onChange={v=>setMemberForm(f=>f&&({...f,classification:v}))} />
                      <Inp label="Email" type="email" value={memberForm.email||''} onChange={v=>setMemberForm(f=>f&&({...f,email:v}))} />
                      <Inp label="Mobile" value={memberForm.phone||''} onChange={v=>setMemberForm(f=>f&&({...f,phone:v}))} />
                      <Inp label="Date of Birth" type="date" value={memberForm.dateOfBirth?.slice(0,10)||''} onChange={v=>setMemberForm(f=>f&&({...f,dateOfBirth:v}))} />
                      <Inp label="Induction Date" type="date" value={memberForm.inductionDate?.slice(0,10)||''} onChange={v=>setMemberForm(f=>f&&({...f,inductionDate:v}))} />
                      <Inp label="Proposed By" value={memberForm.proposedBy||''} onChange={v=>setMemberForm(f=>f&&({...f,proposedBy:v}))} />
                      <Inp label="Home Address" value={memberForm.address||''} onChange={v=>setMemberForm(f=>f&&({...f,address:v}))} className="sm:col-span-2" />
                      <Inp label="Photo URL" value={memberForm.photoUrl||''} onChange={v=>setMemberForm(f=>f&&({...f,photoUrl:v}))} placeholder="https://…" className="sm:col-span-2" />
                    </div>
                  )}

                  {memberTab==='family' && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Inp label="Spouse Name" value={memberForm.spouseName||''} onChange={v=>setMemberForm(f=>f&&({...f,spouseName:v}))} />
                      <Inp label="Spouse DOB" type="date" value={memberForm.spouseDob?.slice(0,10)||''} onChange={v=>setMemberForm(f=>f&&({...f,spouseDob:v}))} />
                      <Inp label="Spouse Email" type="email" value={memberForm.spouseEmail||''} onChange={v=>setMemberForm(f=>f&&({...f,spouseEmail:v}))} />
                      <Inp label="Spouse Mobile" value={memberForm.spousePhone||''} onChange={v=>setMemberForm(f=>f&&({...f,spousePhone:v}))} />
                      <Inp label="Anniversary Date" type="date" value={memberForm.anniversary?.slice(0,10)||''} onChange={v=>setMemberForm(f=>f&&({...f,anniversary:v}))} className="sm:col-span-2" />
                      <div className="sm:col-span-2">
                        <p className="text-xs font-medium text-slate-600 mb-2">Children</p>
                        {memberChildren.map((c,i)=>(
                          <div key={i} className="flex gap-2 mb-2">
                            <Inp placeholder="Child name" value={c.name} onChange={v=>setMemberChildren(cs=>cs.map((ch,j)=>j===i?{...ch,name:v}:ch))} />
                            <Inp type="date" placeholder="DOB" value={c.dateOfBirth?.slice(0,10)||''} onChange={v=>setMemberChildren(cs=>cs.map((ch,j)=>j===i?{...ch,dateOfBirth:v}:ch))} />
                            <button onClick={()=>setMemberChildren(cs=>cs.filter((_,j)=>j!==i))} className="text-rose-500 px-2 text-lg">✕</button>
                          </div>
                        ))}
                        <Btn variant="ghost" onClick={()=>setMemberChildren(cs=>[...cs,{name:'',dateOfBirth:''}])}>+ Add child</Btn>
                      </div>
                    </div>
                  )}

                  {memberTab==='business' && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Inp label="Principal Activity" value={memberForm.principalActivity||''} onChange={v=>setMemberForm(f=>f&&({...f,principalActivity:v}))} className="sm:col-span-2" />
                      <Inp label="Occupation" value={memberForm.occupation||''} onChange={v=>setMemberForm(f=>f&&({...f,occupation:v}))} className="sm:col-span-2" />
                      <Inp label="Business Name" value={memberForm.businessName||''} onChange={v=>setMemberForm(f=>f&&({...f,businessName:v}))} />
                      <Inp label="Business Tagline" value={memberForm.businessTagline||''} onChange={v=>setMemberForm(f=>f&&({...f,businessTagline:v}))} />
                      <Inp label="Business Address" value={memberForm.businessAddress||''} onChange={v=>setMemberForm(f=>f&&({...f,businessAddress:v}))} className="sm:col-span-2" />
                    </div>
                  )}

                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                    <Btn variant="primary" size="md" onClick={saveMember} disabled={busy||!memberForm.name}>Save member</Btn>
                    <Btn variant="ghost" size="md" onClick={()=>setMemberForm(null)}>Cancel</Btn>
                  </div>
                </Card>
              )}

              <div className="space-y-2">
                {filteredMembers.map(m=>(
                  <Card key={m.id} className="p-4 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar name={m.name} photo={m.photoUrl} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-[#002664]">{m.name}</p>
                          {m.rotaryId && <Badge label={`#${m.rotaryId}`} color="blue" />}
                          {m.classification && <Badge label={m.classification} />}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{m.email||'No email'} · {m.phone||'No phone'}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {m.spouseName && <Badge label={`💍 ${m.spouseName}`} color="gold" />}
                          {m.children.length>0 && <Badge label={`${m.children.length} child${m.children.length>1?'ren':''}`} color="green" />}
                          {(m.businessName||m.principalActivity) && <Badge label={m.businessName||m.principalActivity||''} color="slate" />}
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Btn variant="ghost" onClick={()=>openMemberForm(m)}>Edit</Btn>
                        <Btn variant="danger" onClick={()=>deleteMemberById(m.id)}>Del</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
                {filteredMembers.length===0 && <p className="text-sm text-slate-400 py-8 text-center">No members found.</p>}
              </div>
            </>
          )}

          {/* ── News ── */}
          {tab==='news' && (
            <>
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-[#002664]">News & Announcements</h1>
                <Btn variant="gold" onClick={()=>setNewsForm({title:'',body:'',pinned:false})}>+ Add</Btn>
              </div>
              {newsForm && (
                <Card className="p-6 border-2 border-[#002664]/20 space-y-3">
                  <h2 className="font-semibold text-[#002664]">{newsForm.id?'Edit':'New'} announcement</h2>
                  <Inp label="Title *" value={newsForm.title} onChange={v=>setNewsForm(f=>f&&({...f,title:v}))} />
                  <Txt label="Body *" value={newsForm.body} onChange={v=>setNewsForm(f=>f&&({...f,body:v}))} />
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!newsForm.pinned} onChange={e=>setNewsForm(f=>f&&({...f,pinned:e.target.checked}))} className="rounded" /> Pin to top</label>
                  <div className="flex gap-2"><Btn variant="primary" size="md" onClick={saveNews} disabled={busy||!newsForm.title||!newsForm.body}>Save</Btn><Btn variant="ghost" size="md" onClick={()=>setNewsForm(null)}>Cancel</Btn></div>
                </Card>
              )}
              <div className="space-y-3">
                {news.map(n=>(
                  <Card key={n.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">{n.pinned&&<Badge label="Pinned" color="gold" />}<p className="font-semibold text-[#002664]">{n.title}</p></div>
                        <p className="text-sm text-slate-600">{n.body}</p>
                        <p className="text-xs text-slate-400 mt-2">{fmt(n.createdAt)}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Btn variant="ghost" onClick={()=>togglePin(n)}>{n.pinned?'Unpin':'Pin'}</Btn>
                        <Btn variant="ghost" onClick={()=>setNewsForm({...n})}>Edit</Btn>
                        <Btn variant="danger" onClick={async()=>{if(!confirm('Delete?'))return;const r=await api(`/news/${n.id}`,'DELETE');if(r.ok)setNews(p=>p.filter(x=>x.id!==n.id));}}>Del</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ── Projects ── */}
          {tab==='projects' && (
            <>
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-[#002664]">Projects <span className="text-slate-400 font-normal text-lg">({projects.length})</span></h1>
                <Btn variant="gold" onClick={()=>setProjectForm({title:'',avenue:AVENUES[0],description:'',status:'active'})}>+ Add</Btn>
              </div>
              {projectForm && (
                <Card className="p-6 border-2 border-[#002664]/20 space-y-3">
                  <h2 className="font-semibold text-[#002664]">{projectForm.id?'Edit':'New'} project</h2>
                  <Inp label="Title *" value={projectForm.title} onChange={v=>setProjectForm(f=>f&&({...f,title:v}))} />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Sel label="Avenue" value={projectForm.avenue||AVENUES[0]} onChange={v=>setProjectForm(f=>f&&({...f,avenue:v}))} options={AVENUES.map(a=>({value:a,label:a}))} />
                    <Sel label="Status" value={projectForm.status||'active'} onChange={v=>setProjectForm(f=>f&&({...f,status:v}))} options={[{value:'active',label:'Active'},{value:'completed',label:'Completed'},{value:'paused',label:'Paused'}]} />
                  </div>
                  <Txt label="Description" value={projectForm.description||''} onChange={v=>setProjectForm(f=>f&&({...f,description:v}))} />
                  <div className="flex gap-2"><Btn variant="primary" size="md" onClick={saveProject} disabled={busy||!projectForm.title}>Save</Btn><Btn variant="ghost" size="md" onClick={()=>setProjectForm(null)}>Cancel</Btn></div>
                </Card>
              )}
              <div className="space-y-3">
                {projects.map(p=>(
                  <Card key={p.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex gap-2 mb-1"><Badge label={p.avenue} color="blue" /><Badge label={p.status||'active'} color={p.status==='completed'?'green':p.status==='paused'?'slate':'gold'} /></div>
                        <p className="font-semibold text-[#002664]">{p.title}</p>
                        {p.description&&<p className="text-sm text-slate-600 mt-1">{p.description}</p>}
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Btn variant="ghost" onClick={()=>setProjectForm({...p})}>Edit</Btn>
                        <Btn variant="danger" onClick={async()=>{if(!confirm('Delete?'))return;const r=await api(`/projects/${p.id}`,'DELETE');if(r.ok)setProjects(prev=>prev.filter(x=>x.id!==p.id));}}>Del</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ── Dues ── */}
          {tab==='dues' && (
            <>
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-[#002664]">Dues <span className="text-rose-500 text-base font-normal">{unpaid} unpaid</span></h1>
                <Btn variant="gold" onClick={()=>setDueForm({memberId:'',amount:'',dueDate:'',paid:false})}>+ Add due</Btn>
              </div>
              {dueForm && (
                <Card className="p-6 border-2 border-[#002664]/20 space-y-3">
                  <h2 className="font-semibold text-[#002664]">New due entry</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Sel label="Member *" value={dueForm.memberId} onChange={v=>setDueForm(f=>f&&({...f,memberId:v}))} options={[{value:'',label:'Select member…'},...members.map(m=>({value:m.id,label:m.name}))]} />
                    <Inp label="Amount (₹) *" type="number" value={dueForm.amount} onChange={v=>setDueForm(f=>f&&({...f,amount:v}))} />
                    <Inp label="Due date" type="date" value={dueForm.dueDate} onChange={v=>setDueForm(f=>f&&({...f,dueDate:v}))} />
                    <label className="flex items-center gap-2 text-sm self-end pb-2"><input type="checkbox" checked={dueForm.paid} onChange={e=>setDueForm(f=>f&&({...f,paid:e.target.checked}))} /> Already paid</label>
                  </div>
                  <div className="flex gap-2"><Btn variant="primary" size="md" onClick={saveDue} disabled={busy||!dueForm.memberId||!dueForm.amount}>Save</Btn><Btn variant="ghost" size="md" onClick={()=>setDueForm(null)}>Cancel</Btn></div>
                </Card>
              )}
              <div className="flex gap-2">
                {(['all','unpaid','paid'] as const).map(f=>(
                  <button key={f} onClick={()=>setDueFilter(f)} className={`px-4 py-1.5 rounded-full text-sm capitalize transition-all ${dueFilter===f?'bg-[#002664] text-white':'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>{f}</button>
                ))}
              </div>
              <div className="space-y-2">
                {dues.filter(d=>dueFilter==='all'?true:dueFilter==='paid'?d.paid:!d.paid).map(d=>(
                  <Card key={d.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <button onClick={()=>toggleDue(d)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${d.paid?'bg-green-500 border-green-500 text-white':'border-slate-300 hover:border-green-400'}`}>{d.paid&&'✓'}</button>
                      <Avatar name={d.member.name} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{d.member.name}</p>
                        <p className="text-xs text-slate-400">{d.dueDate?`Due ${fmt(d.dueDate)}`:'No due date'}</p>
                      </div>
                      <span className={`font-bold text-sm ${d.paid?'text-green-600':'text-rose-600'}`}>₹{Number(d.amount).toLocaleString('en-IN')}</span>
                      <Badge label={d.paid?'Paid':'Unpaid'} color={d.paid?'green':'red'} />
                      <Btn variant="danger" onClick={async()=>{if(!confirm('Delete?'))return;const r=await api(`/dues/${d.id}`,'DELETE');if(r.ok)setDues(p=>p.filter(x=>x.id!==d.id));}}>Del</Btn>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* ── Birthdays ── */}
          {tab==='birthdays' && (
            <>
              <h1 className="text-2xl font-bold text-[#002664]">Birthdays & Anniversaries</h1>
              <div className="flex flex-wrap gap-2">
                {MONTHS.map((m,i)=>(
                  <button key={m} onClick={()=>setBmonth(i)} className={`px-3 py-1.5 rounded-full text-sm transition-all ${bmonth===i?'bg-[#F7A81B] text-[#002664] font-semibold':'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>{m}</button>
                ))}
              </div>
              <Card className="p-4">
                {bdays.length===0
                  ?<p className="text-sm text-slate-400 py-4 text-center">No celebrations in {MONTHS[bmonth]}.</p>
                  :bdays.map((b,i)=>(
                    <div key={i} className="flex items-center gap-3 py-3 border-b last:border-0 border-slate-100">
                      <span className="text-2xl">{b.label==='Anniversary'?'💍':'🎂'}</span>
                      <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{b.name}</p><p className="text-xs text-slate-400">{b.label}</p></div>
                      <span className="text-sm font-bold text-[#F7A81B]">{fmtMD(b.date)}</span>
                    </div>
                  ))
                }
              </Card>
            </>
          )}

          {/* ── Users ── */}
          {tab==='users' && (
            <>
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-[#002664]">User Accounts <span className="text-slate-400 font-normal text-lg">({users.length})</span></h1>
                <Btn variant="gold" onClick={()=>setUserForm({email:'',password:'',role:'member',memberId:''})}>+ Add user</Btn>
              </div>
              {userForm && (
                <Card className="p-6 border-2 border-[#002664]/20 space-y-3">
                  <h2 className="font-semibold text-[#002664]">{userForm.id?'Edit user':'New user account'}</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Inp label="Email *" type="email" value={userForm.email} onChange={v=>setUserForm(f=>f&&({...f,email:v}))} required />
                    <Inp label={userForm.id?'New password (leave blank to keep)':'Password *'} type="password" value={userForm.password} onChange={v=>setUserForm(f=>f&&({...f,password:v}))} />
                    <Sel label="Role" value={userForm.role} onChange={v=>setUserForm(f=>f&&({...f,role:v}))} options={ROLES.map(r=>({value:r.value,label:r.label}))} />
                    <Sel label="Linked member (for member role)" value={userForm.memberId} onChange={v=>setUserForm(f=>f&&({...f,memberId:v}))}
                      options={[{value:'',label:'None (admin only)'},...members.map(m=>({value:m.id,label:m.name}))]} />
                  </div>
                  <div className="flex gap-2"><Btn variant="primary" size="md" onClick={saveUser} disabled={busy||!userForm.email||(!userForm.id&&!userForm.password)}>Save</Btn><Btn variant="ghost" size="md" onClick={()=>setUserForm(null)}>Cancel</Btn></div>
                </Card>
              )}
              <div className="space-y-2">
                {users.map(u=>(
                  <Card key={u.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                        {u.email[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-[#002664] text-sm">{u.email}</p>
                          {roleBadge(u.role)}
                        </div>
                        {u.member&&<p className="text-xs text-slate-400 mt-0.5">Linked: {u.member.name}</p>}
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Btn variant="ghost" onClick={()=>setUserForm({id:u.id,email:u.email,password:'',role:u.role||'member',memberId:u.memberId||''})}>Edit</Btn>
                        <Btn variant="danger" onClick={()=>deleteUser(u.id)}>Del</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
                {users.length===0&&<p className="text-sm text-slate-400 py-4 text-center">No users yet.</p>}
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
