'use client';
import { useState, useEffect, useCallback } from 'react';

type Project = { id: string; title: string; avenue: string; date: string; year: string; description: string; imageUrl: string | null; newsUrl: string | null; published: boolean; order: number };

const AVENUES = ['Club Service', 'Vocational Service', 'Community Service', 'International Service', 'Youth Service'];
const blank = { title: '', avenue: 'Community Service', date: '', year: '2025-26', description: '', imageUrl: '', newsUrl: '', impact: '', published: true, order: 0 };

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<typeof blank>(blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/cms/projects'); if (r.ok) setItems(await r.json()); setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  function openAdd() { setForm(blank); setEditing(null); setErr(''); setShow(true); }
  function openEdit(p: Project) {
    setForm({ title: p.title, avenue: p.avenue, date: p.date, year: p.year, description: p.description, imageUrl: p.imageUrl ?? '', newsUrl: p.newsUrl ?? '', impact: '', published: p.published, order: p.order });
    setEditing(p); setErr(''); setShow(true);
  }
  async function save() {
    setSaving(true); setErr('');
    const body = { ...form, imageUrl: form.imageUrl || null, newsUrl: form.newsUrl || null };
    const url = editing ? `/api/cms/projects/${editing.id}` : '/api/cms/projects';
    const r = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.ok) { setShow(false); load(); } else { const d = await r.json(); setErr(d.message || 'Error'); }
    setSaving(false);
  }
  async function remove(id: string) {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/cms/projects/${id}`, { method: 'DELETE' }); load();
  }

  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002664]';
  const lbl = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-slate-900">Projects</h1><p className="text-slate-500 text-sm">Community service projects shown on the website</p></div>
        <button onClick={openAdd} className="bg-[#002664] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#001d4f]">+ Add Project</button>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg my-8 shadow-xl">
            <h2 className="text-lg font-bold mb-4">{editing ? 'Edit' : 'Add'} Project</h2>
            {err && <p className="text-red-600 text-sm bg-red-50 rounded px-3 py-2 mb-3">{err}</p>}
            <div className="space-y-3">
              <div><label className={lbl}>Title</label><input className={inp} value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} /></div>
              <div><label className={lbl}>Avenue</label>
                <select className={inp} value={form.avenue} onChange={e => setForm(f => ({...f, avenue: e.target.value}))}>
                  {AVENUES.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Date</label><input className={inp} value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} placeholder="July 2025" /></div>
                <div><label className={lbl}>Year</label><input className={inp} value={form.year} onChange={e => setForm(f => ({...f, year: e.target.value}))} placeholder="2025-26" /></div>
              </div>
              <div><label className={lbl}>Description</label><textarea rows={3} className={inp} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} /></div>
              <div><label className={lbl}>Image URL (optional)</label><input className={inp} value={form.imageUrl} onChange={e => setForm(f => ({...f, imageUrl: e.target.value}))} /></div>
              <div><label className={lbl}>News URL (optional)</label><input className={inp} value={form.newsUrl} onChange={e => setForm(f => ({...f, newsUrl: e.target.value}))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={form.order} onChange={e => setForm(f => ({...f, order: +e.target.value}))} /></div>
                <div className="flex items-center gap-2 pt-6"><input type="checkbox" id="pub" checked={form.published} onChange={e => setForm(f => ({...f, published: e.target.checked}))} /><label htmlFor="pub" className="text-sm text-gray-700">Published</label></div>
              </div>
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button onClick={() => setShow(false)} className="px-4 py-2 rounded-lg border text-sm text-gray-600">Cancel</button>
              <button onClick={save} disabled={saving} className="bg-[#002664] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <p className="text-slate-400 text-sm">Loading…</p> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-left">
              <tr><th className="px-4 py-3 font-semibold text-slate-600">Title</th><th className="px-4 py-3 font-semibold text-slate-600">Avenue</th><th className="px-4 py-3 font-semibold text-slate-600">Date</th><th className="px-4 py-3 font-semibold text-slate-600">Published</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{p.title}</td>
                  <td className="px-4 py-3 text-slate-500">{p.avenue}</td>
                  <td className="px-4 py-3 text-slate-500">{p.date}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{p.published ? 'Yes' : 'No'}</span></td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(p)} className="text-[#002664] hover:underline text-xs mr-3">Edit</button>
                    <button onClick={() => remove(p.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">No projects yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
