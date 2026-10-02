import Link from 'next/link';
import Image from 'next/image';
import { PublicShell } from '@/app/components/public/PublicShell';
import { getWebProjects } from '@/lib/cms-db';
import { projects as staticProjects } from '@/lib/rcnv-public-data';

export default async function ProjectsPage() {
  let projects: { id: string; title: string; avenue: string; description: string; imageUrl: string | null; date: string; year: string; impact: unknown; newsUrl: string | null }[] = [];
  try {
    const db = await getWebProjects(true);
    projects = db as typeof projects;
  } catch { /* fallback */ }

  const useFallback = projects.length === 0;

  return (
    <PublicShell>
      {/* Page header */}
      <section className="bg-[#002664] py-12">
        <div className="max-w-7xl mx-auto px-4 text-white">
          <p className="text-xs text-[#F7A81B] uppercase tracking-widest font-bold mb-2">
            <Link href="/" className="text-[#F7A81B] hover:underline no-underline">Home</Link> / Projects
          </p>
          <h1 className="text-4xl font-black mb-2">Our Projects</h1>
          <p className="text-[#c8d9f0] text-lg">Service work by Rotary Club Nagpur Vision, with the numbers behind them.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {useFallback ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticProjects.map(p => (
              <article key={p.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-44 bg-gradient-to-br from-[#002664] to-[#0a3a8a] flex items-center justify-center">
                  <span className="text-white/20 text-6xl font-black">R</span>
                </div>
                <div className="p-5">
                  <span className="inline-block bg-[#f0f4ff] text-[#002664] text-xs font-bold px-3 py-1 rounded-full mb-3">{p.avenue}</span>
                  <h3 className="text-[#002664] font-bold text-base mb-1 leading-snug">{p.title}</h3>
                  <p className="text-slate-400 text-xs mb-2">{p.date}</p>
                  <p className="text-[#5e717d] text-sm mb-3 line-clamp-3">{p.summary}</p>
                  {p.impact.length > 0 && (
                    <div className="flex gap-4 border-t border-slate-100 pt-3">
                      {p.impact.slice(0, 2).map(i => (
                        <div key={i.label}>
                          <b className="block text-xl font-black text-[#c10042]">{i.value}</b>
                          <span className="text-[#5e717d] text-xs">{i.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {p.source && (
                    <a href={p.source} target="_blank" rel="noreferrer" className="block mt-3 text-[#002664] text-xs font-semibold hover:underline">
                      Read the news report →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => {
              const impact = Array.isArray(p.impact) ? p.impact as { value: string; label: string }[] : [];
              return (
                <article key={p.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {p.imageUrl ? (
                    <div className="relative h-44">
                      <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-[#002664] to-[#0a3a8a] flex items-center justify-center">
                      <span className="text-white/20 text-6xl font-black">R</span>
                    </div>
                  )}
                  <div className="p-5">
                    <span className="inline-block bg-[#f0f4ff] text-[#002664] text-xs font-bold px-3 py-1 rounded-full mb-3">{p.avenue}</span>
                    <h3 className="text-[#002664] font-bold text-base mb-1 leading-snug">{p.title}</h3>
                    <p className="text-slate-400 text-xs mb-2">{p.date} · {p.year}</p>
                    <p className="text-[#5e717d] text-sm mb-3 line-clamp-3">{p.description}</p>
                    {impact.length > 0 && (
                      <div className="flex gap-4 border-t border-slate-100 pt-3">
                        {impact.slice(0, 2).map(i => (
                          <div key={i.label}>
                            <b className="block text-xl font-black text-[#c10042]">{i.value}</b>
                            <span className="text-[#5e717d] text-xs">{i.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {p.newsUrl && (
                      <a href={p.newsUrl} target="_blank" rel="noreferrer" className="block mt-3 text-[#002664] text-xs font-semibold hover:underline">
                        Read more →
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {useFallback && (
          <p className="text-slate-400 text-xs mt-6 text-center">Projects will be managed via the CMS once content is added.</p>
        )}
      </section>
    </PublicShell>
  );
}
