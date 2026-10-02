'use client';
import { useState, useEffect, useCallback } from 'react';

type Counter = { id: string; key: string; label: string; value: string; order: number };
const blank = { key: '', label: '', value: '', order: 0 };
const PRESETS = [
  { key: 'members', label: 'Members', value: '100+' },
  { key: 'projects', label: 'Projects', value: '25+' },
  { key: 'beneficiaries', label: 'Beneficiaries', value: '1000+' },
  { key: 'manhours', label: 'Man Hours', value: '5000+' },
];

export default function CountersPage() {
  const [items, setItems] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => { setLoading(true); const r = await fetch('/api/cms/counters'); if (r.ok) setItems(await r.json()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true); setErr('');
    const r = await fetch('/api/cms/counters', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (r.ok) { setShow(false); setForm(blank); load(); } else { const d = await r.json(); setErr(d.message || 'Error'); }
    setSaving(false);
  }
  async function remove(id: string) { if (!confirm('Delete counter?')) return; await fetch(`/api/cms/counters/${id}`, { method: 'DELETE' }); load(); }
  async function applyPreset(p: typeof PRESETS[0]) {
    const r = await fetch('/api/cms/counters', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...p, order: PRESETS.indexOf(p) }) });
    if (r.ok) load();
  }

  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002664]';
  const lbl = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-slate-900">Counters</h1><p className="text-slate-500 text-sm">Impact numbers shown on the homepage hero</p></div>
        <button onClick={() => { setForm(blank); setErr(''); setShow(true); }} className="bg-[#002664] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#001d4f]">+ Add Counter</button>
      </div>

      {!items.length && !loading && (
        <div className="bg-[#fff8e6] border border-[#F7A81B]/40 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-[#6b4a00] mb-3">Quick start — add preset counters:</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button key={p.key} onClick={() => applyPreset(p)} className="bg-white border border-[#F7A81B] text-[#6b4a00] text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#F7A81B] hover:text-white transition-colors">
                + {p.label} ({p.value})
              </button>
            ))}
          </div>
        </div>
      )}

      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md my-8 shadow-xl">
            <h2 className="text-lg font-bold mb-4">Add Counter</h2>
            <p className="text-xs text-slate-500 mb-4">Using the same key as an existing counter will update it.</p>
            {err && <p className="text-red-600 text-sm bg-red-50 rounded px-3 py-2 mb-3">{err}</p>}
            <div className="space-y-3">
              <div><label className={lbl}>Key (unique ID)</label><input className={inp} value={form.key} onChange={e => setForm(f => ({...f, key: e.target.value}))} placeholder="members" /></div>
              <div><label className={lbl}>Label</label><input className={inp} value={form.label} onChange={e => setForm(f => ({...f, label: e.target.value}))} placeholder="Members" /></div>
              <div><label className={lbl}>Value</label><input className={inp} value={form.value} onChange={e => setForm(f => ({...f, value: e.target.value}))} placeholder="100+" /></div>
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
              <tr><th className="px-4 py-3 font-semibold text-slate-600">Key</th><th className="px-4 py-3 font-semibold text-slate-600">Label</th><th className="px-4 py-3 font-semibold text-slate-600">Value</th><th className="px-4 py-3 font-semibold text-slate-600">Order</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{p.key}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{p.label}</td>
                  <td className="px-4 py-3 text-[#002664] font-bold">{p.value}</td>
                  <td className="px-4 py-3 text-slate-500">{p.order}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => remove(p.id)} className="text-red-500 hover:underline text-xs">Delete</button></td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">No counters yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
