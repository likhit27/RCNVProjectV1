'use client';
import { useState, useEffect, useCallback } from 'react';

type PP = { id: string; name: string; year: string; imageUrl: string | null; order: number };
const blank = { name: '', year: '', imageUrl: '', order: 0 };

export default function PastPresidentsPage() {
  const [items, setItems] = useState<PP[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<PP | null>(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => { setLoading(true); const r = await fetch('/api/cms/past-presidents'); if (r.ok) setItems(await r.json()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  function openAdd() { setForm(blank); setEditing(null); setErr(''); setShow(true); }
  function openEdit(p: PP) { setForm({ name: p.name, year: p.year, imageUrl: p.imageUrl ?? '', order: p.order }); setEditing(p); setErr(''); setShow(true); }
  async function save() {
    setSaving(true); setErr('');
    const url = editing ? `/api/cms/past-presidents/${editing.id}` : '/api/cms/past-presidents';
    const r = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, imageUrl: form.imageUrl || null }) });
    if (r.ok) { setShow(false); load(); } else { const d = await r.json(); setErr(d.message || 'Error'); }
    setSaving(false);
  }
  async function remove(id: string) { if (!confirm('Delete?')) return; await fetch(`/api/cms/past-presidents/${id}`, { method: 'DELETE' }); load(); }

  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002664]';
  const lbl = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-slate-900">Past Presidents</h1><p className="text-slate-500 text-sm">Club presidents by Rotary year</p></div>
        <button onClick={openAdd} className="bg-[#002664] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#001d4f]">+ Add</button>
      </div>
      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md my-8 shadow-xl">
            <h2 className="text-lg font-bold mb-4">{editing ? 'Edit' : 'Add'} Past President</h2>
            {err && <p className="text-red-600 text-sm bg-red-50 rounded px-3 py-2 mb-3">{err}</p>}
            <div className="space-y-3">
              <div><label className={lbl}>Name</label><input className={inp} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} /></div>
              <div><label className={lbl}>Year (e.g. 2024-25)</label><input className={inp} value={form.year} onChange={e => setForm(f => ({...f, year: e.target.value}))} /></div>
              <div><label className={lbl}>Photo URL (optional)</label><input className={inp} value={form.imageUrl} onChange={e => setForm(f => ({...f, imageUrl: e.target.value}))} /></div>
              <div><label className={lbl}>Display Order</label><input type="number" className={inp} value={form.order} onChange={e => setForm(f => ({...f, order: +e.target.value}))} /></div>
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
              <tr><th className="px-4 py-3 font-semibold text-slate-600">Name</th><th className="px-4 py-3 font-semibold text-slate-600">Year</th><th className="px-4 py-3 font-semibold text-slate-600">Order</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                  <td className="px-4 py-3 text-slate-500">{p.year}</td>
                  <td className="px-4 py-3 text-slate-500">{p.order}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => openEdit(p)} className="text-[#002664] hover:underline text-xs mr-3">Edit</button><button onClick={() => remove(p.id)} className="text-red-500 hover:underline text-xs">Delete</button></td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-400">No past presidents added yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
