export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { PublicShell } from '@/app/components/public/PublicShell';
import { getGalleryAlbums } from '@/lib/cms-db';

export default async function GalleryPage() {
  let albums: { id: string; title: string; coverImage: string | null; date: string | null; _count: { photos: number } }[] = [];
  try {
    const db = await getGalleryAlbums(true);
    albums = db as typeof albums;
  } catch { /* empty */ }

  return (
    <PublicShell>
      <section className="bg-[#002664] py-12">
        <div className="max-w-7xl mx-auto px-4 text-white">
          <p className="text-xs text-[#F7A81B] uppercase tracking-widest font-bold mb-2">
            <Link href="/" className="text-[#F7A81B] hover:underline no-underline">Home</Link> / Gallery
          </p>
          <h1 className="text-4xl font-black mb-2">Photo Gallery</h1>
          <p className="text-[#c8d9f0] text-lg">Moments from our service projects, events and fellowship.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {albums.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map(album => (
              <div key={album.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                {album.coverImage ? (
                  <div className="relative h-48">
                    <Image src={album.coverImage} alt={album.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-sm leading-snug drop-shadow">{album.title}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#002664] to-[#0a3a8a] flex flex-col items-center justify-center">
                    <span className="text-white/20 text-6xl font-black">R</span>
                  </div>
                )}
                <div className="p-4">
                  {!album.coverImage && <h3 className="text-[#002664] font-bold text-sm mb-1">{album.title}</h3>}
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400 text-xs">{album.date ?? ''}</p>
                    <span className="text-xs text-slate-400">{album._count.photos} photo{album._count.photos !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-400 mb-2">No photo albums published yet.</p>
            <p className="text-slate-400 text-sm">Albums are managed via <a href="/cms/gallery" className="text-[#002664] hover:underline">CMS → Gallery</a>.</p>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
