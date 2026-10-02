'use client';
import { useState, useEffect, useCallback } from 'react';

type PC = { id: string; key: string; value: string };
const SUGGESTED_KEYS = ['home.hero.title', 'home.hero.subtitle', 'about.intro', 'about.history', 'about.meeting.day', 'about.meeting.venue', 'contact.email', 'contact.phone', 'contact.address', 'contact.venue'];

export default function PagesPage() {
  const [items, setItems] = useState<PC[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState('');
  const [newVal, setNewVal] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/cms/pages'); if (r.ok) { const d = await r.json(); setItems(d); const ev: Record<string, string> = {}; d.forEach((p: PC) => { ev[p.id] = p.value; }); setEditValues(ev); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function saveItem(key: string, value: string, id: string) {
    setSaving(id);
    await fetch('/api/cms/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }) });
    setSaving(null);
  }

  async function addNew() {
    if (!newKey || !newVal) return;
    setSaving('new');
    await fetch('/api/cms/pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: newKey, value: newVal }) });
    setNewKey(''); setNewVal('');
    setSaving(null); load();
  }

  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002664]';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Page Content</h1>
        <p className="text-slate-500 text-sm">Manage text content for public website pages</p>
      </div>

      {/* Add new block */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
        <p className="text-sm font-semibold text-slate-700 mb-3">Add or update a content block</p>
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-slate-500 mb-1">Key</label>
            <input list="suggested-keys" className={inp} value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="e.g. home.hero.title" />
            <datalist id="suggested-keys">{SUGGESTED_KEYS.map(k => <option key={k} value={k} />)}</datalist>
          </div>
          <div className="flex-[2] min-w-[280px]">
            <label className="block text-xs text-slate-500 mb-1">Value</label>
            <input className={inp} value={newVal} onChange={e => setNewVal(e.target.value)} placeholder="Content text..." />
          </div>
          <div className="flex items-end">
            <button onClick={addNew} disabled={saving === 'new'} className="bg-[#002664] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 whitespace-nowrap">
              {saving === 'new' ? 'Saving…' : 'Save Block'}
            </button>
          </div>
        </div>
      </div>

      {loading ? <p className="text-slate-400 text-sm">Loading…</p> : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex gap-4 items-start">
              <code className="text-xs text-[#002664] bg-slate-50 border border-slate-200 rounded px-2 py-1 whitespace-nowrap mt-1">{item.key}</code>
              <textarea
                rows={2} className={inp + ' flex-1 resize-y'}
                value={editValues[item.id] ?? item.value}
                onChange={e => setEditValues(v => ({ ...v, [item.id]: e.target.value }))}
              />
              <button
                onClick={() => saveItem(item.key, editValues[item.id] ?? item.value, item.id)}
                disabled={saving === item.id}
                className="bg-[#002664] text-white px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 whitespace-nowrap mt-1"
              >
                {saving === item.id ? 'Saving…' : 'Save'}
              </button>
            </div>
          ))}
          {!items.length && <p className="text-center text-slate-400 py-8 text-sm">No content blocks yet. Add one above.</p>}
        </div>
      )}
    </div>
  );
}
