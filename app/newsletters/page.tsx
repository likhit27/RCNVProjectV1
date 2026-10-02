export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { PublicShell } from '@/app/components/public/PublicShell';
import { getNewsletters } from '@/lib/cms-db';

export default async function NewslettersPage() {
  let newsletters: { id: string; title: string; issue: string | null; year: string | null; pdfUrl: string }[] = [];
  try {
    const db = await getNewsletters(true);
    newsletters = db as typeof newsletters;
  } catch { /* empty */ }

  const byYear = newsletters.reduce<Record<string, typeof newsletters>>((acc, n) => {
    const y = n.year ?? 'Other';
    if (!acc[y]) acc[y] = [];
    acc[y].push(n);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));

  return (
    <PublicShell>
      <section className="bg-[#002664] py-12">
        <div className="max-w-7xl mx-auto px-4 text-white">
          <p className="text-xs text-[#F7A81B] uppercase tracking-widest font-bold mb-2">
            <Link href="/" className="text-[#F7A81B] hover:underline no-underline">Home</Link> / Newsletters
          </p>
          <h1 className="text-4xl font-black mb-2">Newsletters</h1>
          <p className="text-[#c8d9f0] text-lg">Club newsletters and bulletins, available to download.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        {newsletters.length > 0 ? (
          <div className="space-y-10">
            {years.map(year => (
              <div key={year}>
                <h2 className="text-xl font-bold text-[#002664] mb-4 pb-2 border-b border-slate-100">{year}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {byYear[year].map(n => (
                    <a
                      key={n.id}
                      href={n.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#F7A81B] transition-all no-underline group"
                    >
                      <div className="w-12 h-14 bg-[#002664] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#002664] font-bold text-sm leading-snug group-hover:underline">{n.title}</p>
                        {n.issue && <p className="text-slate-400 text-xs mt-0.5">Issue {n.issue}</p>}
                      </div>
                      <svg className="w-4 h-4 text-slate-300 group-hover:text-[#F7A81B] flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
              </svg>
            </div>
            <p className="text-slate-400 mb-2">No newsletters published yet.</p>
            <p className="text-slate-400 text-sm">Newsletters are managed via <a href="/cms/newsletters" className="text-[#002664] hover:underline">CMS → Newsletters</a>.</p>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
