'use client';
import { useState, useEffect, useCallback } from 'react';

type Album = { id: string; title: string; coverImage: string | null; date: string | null; published: boolean; _count: { photos: number } };
type Photo = { id: string; url: string; caption: string | null };
const blank = { title: '', coverImage: '', date: '' };

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [photoAlbum, setPhotoAlbum] = useState<{ id: string; title: string; photos: Photo[] } | null>(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  const load = useCallback(async () => { setLoading(true); const r = await fetch('/api/cms/gallery'); if (r.ok) setAlbums(await r.json()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);

  async function addAlbum() {
    setSaving(true); setErr('');
    const r = await fetch('/api/cms/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, coverImage: form.coverImage || null, date: form.date || null }) });
    if (r.ok) { setShow(false); setForm(blank); load(); } else { const d = await r.json(); setErr(d.message || 'Error'); }
    setSaving(false);
  }
  async function deleteAlbum(id: string) { if (!confirm('Delete album and all photos?')) return; await fetch(`/api/cms/gallery/${id}`, { method: 'DELETE' }); load(); }
  async function openPhotos(album: Album) {
    const r = await fetch(`/api/cms/gallery/${album.id}`);
    if (r.ok) { const d = await r.json(); setPhotoAlbum({ id: album.id, title: album.title, photos: d.photos ?? [] }); }
  }
  async function addPhoto() {
    if (!photoAlbum || !newPhotoUrl) return;
    const r = await fetch(`/api/cms/gallery/${photoAlbum.id}/photos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: newPhotoUrl, caption: newPhotoCaption || null }) });
    if (r.ok) { setNewPhotoUrl(''); setNewPhotoCaption(''); openPhotos(albums.find(a => a.id === photoAlbum.id)!); }
  }
  async function deletePhoto(photoId: string) {
    if (!confirm('Delete photo?')) return;
    await fetch(`/api/cms/gallery/photos/${photoId}`, { method: 'DELETE' });
    if (photoAlbum) openPhotos(albums.find(a => a.id === photoAlbum.id)!);
  }

  const inp = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002664]';
  const lbl = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-slate-900">Gallery</h1><p className="text-slate-500 text-sm">Photo albums</p></div>
        <button onClick={() => { setForm(blank); setErr(''); setShow(true); }} className="bg-[#002664] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#001d4f]">+ New Album</button>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md my-8 shadow-xl">
            <h2 className="text-lg font-bold mb-4">New Album</h2>
            {err && <p className="text-red-600 text-sm bg-red-50 rounded px-3 py-2 mb-3">{err}</p>}
            <div className="space-y-3">
              <div><label className={lbl}>Album Title</label><input className={inp} value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} /></div>
              <div><label className={lbl}>Cover Image URL (optional)</label><input className={inp} value={form.coverImage} onChange={e => setForm(f => ({...f, coverImage: e.target.value}))} /></div>
              <div><label className={lbl}>Date (optional)</label><input className={inp} value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} placeholder="November 2025" /></div>
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button onClick={() => setShow(false)} className="px-4 py-2 rounded-lg border text-sm">Cancel</button>
              <button onClick={addAlbum} disabled={saving} className="bg-[#002664] text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">{saving ? 'Creating…' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {photoAlbum && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl my-8 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{photoAlbum.title}</h2>
              <button onClick={() => setPhotoAlbum(null)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="flex gap-2 mb-4">
              <input className={inp + ' flex-1'} value={newPhotoUrl} onChange={e => setNewPhotoUrl(e.target.value)} placeholder="Photo URL" />
              <input className={inp + ' flex-1'} value={newPhotoCaption} onChange={e => setNewPhotoCaption(e.target.value)} placeholder="Caption (optional)" />
              <button onClick={addPhoto} className="bg-[#002664] text-white px-4 rounded-lg text-sm font-semibold whitespace-nowrap">Add</button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {photoAlbum.photos.map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-slate-50 rounded-lg p-2">
                  <img src={p.url} alt={p.caption ?? ''} className="w-12 h-12 object-cover rounded" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <p className="text-sm text-slate-600 flex-1 truncate">{p.caption ?? p.url}</p>
                  <button onClick={() => deletePhoto(p.id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                </div>
              ))}
              {!photoAlbum.photos.length && <p className="text-center text-slate-400 py-4 text-sm">No photos yet</p>}
            </div>
          </div>
        </div>
      )}

      {loading ? <p className="text-slate-400 text-sm">Loading…</p> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map(a => (
            <div key={a.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {a.coverImage ? <img src={a.coverImage} alt={a.title} className="w-full h-40 object-cover" /> : <div className="w-full h-40 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">No cover image</div>}
              <div className="p-4">
                <p className="font-semibold text-slate-800">{a.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{a.date ?? ''} · {a._count.photos} photo{a._count.photos !== 1 ? 's' : ''}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openPhotos(a)} className="bg-[#002664] text-white text-xs px-3 py-1.5 rounded-lg font-medium">Manage Photos</button>
                  <button onClick={() => deleteAlbum(a.id)} className="text-red-500 text-xs px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {!albums.length && <div className="col-span-3 py-10 text-center text-slate-400">No albums yet</div>}
        </div>
      )}
    </div>
  );
}
