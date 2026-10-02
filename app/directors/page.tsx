export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { PublicShell } from '@/app/components/public/PublicShell';
import { getWebDirectors } from '@/lib/cms-db';
import { boardRoles } from '@/lib/rcnv-public-data';

export default async function DirectorsPage() {
  let directors: { id: string; name: string; role: string; imageUrl: string | null; year: string; order: number }[] = [];
  try {
    const db = await getWebDirectors();
    directors = db as typeof directors;
  } catch { /* fallback */ }

  const useFallback = directors.length === 0;

  return (
    <PublicShell>
      <section className="bg-[#002664] py-12">
        <div className="max-w-7xl mx-auto px-4 text-white">
          <p className="text-xs text-[#F7A81B] uppercase tracking-widest font-bold mb-2">
            <Link href="/" className="text-[#F7A81B] hover:underline no-underline">Home</Link> / Directors
          </p>
          <h1 className="text-4xl font-black mb-2">Board of Directors</h1>
          <p className="text-[#c8d9f0] text-lg">Club president, officers and avenue directors for the current year.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {useFallback ? (
          <>
            <div className="bg-[#f0f4ff] border border-[#c8d9f0] rounded-2xl p-5 mb-8 text-[#002664] text-sm">
              Director names will appear here once added through the CMS.
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {boardRoles.map(role => (
                <div key={role} className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-[#F7A81B] flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#002664] font-bold text-2xl">?</span>
                  </div>
                  <h3 className="text-[#002664] font-bold text-sm">{role}</h3>
                  <p className="text-slate-400 text-xs mt-1">2025-26</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {directors.map(d => (
              <div key={d.id} className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                {d.imageUrl ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#F7A81B] mx-auto mb-3">
                    <Image src={d.imageUrl} alt={d.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#002664] border-2 border-[#F7A81B] flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#F7A81B] font-bold text-2xl">{d.name[0]}</span>
                  </div>
                )}
                <h3 className="text-[#002664] font-bold text-sm leading-snug">{d.name}</h3>
                <p className="text-[#F7A81B] text-xs font-semibold mt-1">{d.role}</p>
                <p className="text-slate-400 text-xs mt-0.5">{d.year}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  );
}
