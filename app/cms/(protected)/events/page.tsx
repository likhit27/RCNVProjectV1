'use client';
import { useState, useEffect, useCallback } from 'react';

type Evt = { id: string; title: string; date: string; venue: string | null; description: string | null; imageUrl: string | null; published: boolean };
const blank = { title: '', date: '', venue: '', description: '', imageUrl: '', published: true };

export default function EventsPage() {
  const [items, setItems] = useState<Evt[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<Evt | null>(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => { setLoading(true); const r = await fetch('/api/cms/events'); if (r.ok) setItems(await r.json()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);

  function openAdd() { setForm(blank); setEditing(null); setErr(''); setShow(true); }
  function openEdit(p: Evt) { setForm({ title: p.title, date: p.date?.slice(0, 16) ?? '', venue: p.venue ?? '', description: p.description ?? '', imageUrl: p.imageUrl ?? '', published: p.published }); setEditing(p); setErr(''); setShow(true); }
  async function save() {
    setSaving(true); setErr('');
    const body = { ...form, venue: form.venue || null, description: form.description || null, imageUrl: form.imageUrl || null };
    const url = editing ? `/api/cms/events/${editing.id}` : '/api/cms/events';
    const r = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.ok) { setShow(false); load(); } else { const d = await r.json(); setErr(d.message || 'Error'); }
    setSaving(false);
  }
  async function remove(id: string) { if (!confirm('Delete?')) return; await fetch(`/api/cms/events/${id}`, { method: 'DELETE' }); load(); }

  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002664]';
  const lbl = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-slate-900">Events</h1><p className="text-slate-500 text-sm">Upcoming and past club events</p></div>
        <button onClick={openAdd} className="bg-[#002664] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#001d4f]">+ Add Event</button>
      </div>
      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg my-8 shadow-xl">
            <h2 className="text-lg font-bold mb-4">{editing ? 'Edit' : 'Add'} Event</h2>
            {err && <p className="text-red-600 text-sm bg-red-50 rounded px-3 py-2 mb-3">{err}</p>}
            <div className="space-y-3">
              <div><label className={lbl}>Title</label><input className={inp} value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} /></div>
              <div><label className={lbl}>Date & Time</label><input type="datetime-local" className={inp} value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} /></div>
              <div><label className={lbl}>Venue (optional)</label><input className={inp} value={form.venue} onChange={e => setForm(f => ({...f, venue: e.target.value}))} /></div>
              <div><label className={lbl}>Description (optional)</label><textarea rows={3} className={inp} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} /></div>
              <div><label className={lbl}>Image URL (optional)</label><input className={inp} value={form.imageUrl} onChange={e => setForm(f => ({...f, imageUrl: e.target.value}))} /></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="pub" checked={form.published} onChange={e => setForm(f => ({...f, published: e.target.checked}))} /><label htmlFor="pub" className="text-sm text-gray-700">Published</label></div>
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button onClick={() => setShow(false)} className="px-4 py-2 rounded-lg border text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="bg-[#002664] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
      {loading ? <p className="text-slate-400 text-sm">Loading…</p> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-left">
              <tr><th className="px-4 py-3 font-semibold text-slate-600">Title</th><th className="px-4 py-3 font-semibold text-slate-600">Date</th><th className="px-4 py-3 font-semibold text-slate-600">Venue</th><th className="px-4 py-3 font-semibold text-slate-600">Published</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{p.title}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-4 py-3 text-slate-500">{p.venue ?? '—'}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{p.published ? 'Yes' : 'No'}</span></td>
                  <td className="px-4 py-3 text-right"><button onClick={() => openEdit(p)} className="text-[#002664] hover:underline text-xs mr-3">Edit</button><button onClick={() => remove(p.id)} className="text-red-500 hover:underline text-xs">Delete</button></td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">No events yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
