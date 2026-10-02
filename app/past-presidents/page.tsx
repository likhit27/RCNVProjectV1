export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { PublicShell } from '@/app/components/public/PublicShell';
import { getPastPresidents } from '@/lib/cms-db';

export default async function PastPresidentsPage() {
  let presidents: { id: string; name: string; year: string; imageUrl: string | null; order: number }[] = [];
  try {
    const db = await getPastPresidents();
    presidents = db as typeof presidents;
  } catch { /* empty */ }

  return (
    <PublicShell>
      <section className="bg-[#002664] py-12">
        <div className="max-w-7xl mx-auto px-4 text-white">
          <p className="text-xs text-[#F7A81B] uppercase tracking-widest font-bold mb-2">
            <Link href="/" className="text-[#F7A81B] hover:underline no-underline">Home</Link> / Past Presidents
          </p>
          <h1 className="text-4xl font-black mb-2">Past Presidents</h1>
          <p className="text-[#c8d9f0] text-lg">A record of the leaders who have served as President of the Club.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {presidents.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {presidents.map(p => (
              <div key={p.id} className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                {p.imageUrl ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#F7A81B] mx-auto mb-3">
                    <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#002664] border-2 border-[#F7A81B] flex items-center justify-center mx-auto mb-3">
                    <span className="text-[#F7A81B] font-bold text-2xl">{p.name[0]}</span>
                  </div>
                )}
                <h3 className="text-[#002664] font-bold text-sm leading-snug">{p.name}</h3>
                <p className="text-[#F7A81B] text-xs font-semibold mt-1">{p.year}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-[#002664] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#F7A81B] text-2xl font-black">R</span>
            </div>
            <p className="text-slate-400 mb-2">Past presidents will appear here once added through the CMS.</p>
            <p className="text-slate-400 text-sm">Manage them via <a href="/cms/past-presidents" className="text-[#002664] hover:underline">CMS → Past Presidents</a>.</p>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
