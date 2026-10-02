import Link from 'next/link';
import { PublicShell } from '@/app/components/public/PublicShell';
import { projects } from '@/lib/rcnv-public-data';

function ProjectCard({ p }: { p: (typeof projects)[number] }) {
  return (
    <article className="bg-white border border-[#dfe4e8] rounded-[18px] p-5 flex flex-col gap-2">
      <span className="inline-block bg-[#f3f6fa] text-[#17458f] text-xs font-bold px-3 py-1 rounded-full self-start font-sans">{p.avenue}</span>
      <h3 className="text-[#17458f] text-lg font-bold m-0">{p.title}</h3>
      <p className="text-[#5e717d] text-sm m-0">{p.date}</p>
      <p className="text-[#1f2a37] text-base m-0 flex-1">{p.summary}</p>
      {p.impact.length > 0 && (
        <div className="flex gap-5 flex-wrap mt-1">
          {p.impact.map(i => (
            <div key={i.label}>
              <b className="block text-2xl font-bold text-[#c10042] font-sans leading-tight">{i.value}</b>
              <span className="text-[#5e717d] text-xs font-sans">{i.label}</span>
            </div>
          ))}
        </div>
      )}
      <a href={p.source} target="_blank" rel="noreferrer" className="text-[#0067c8] text-sm mt-1 hover:underline no-underline">
        Read the news report →
      </a>
    </article>
  );
}

export default function ProjectsPage() {
  const shown = projects.filter(p => p.year === '2025-26');
  return (
    <PublicShell>
      <div className="pt-7 pb-2">
        <p className="text-xs text-[#5e717d] m-0 mb-1.5">
          <Link href="/" className="text-[#0067c8] hover:underline">Home</Link> / Projects
        </p>
        <h1 className="text-[#17458f] font-bold leading-tight m-0 mb-2" style={{ fontSize: 'clamp(28px,5vw,42px)' }}>Projects</h1>
        <p className="text-lg text-[#3a4654] m-0">Service projects reported by the club, with the numbers behind them.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
        {shown.map(p => <ProjectCard key={p.id} p={p} />)}
      </div>
      <p className="text-[#5e717d] text-xs mt-3">Source: public news reports linked on each card. Photo albums will be added with permission.</p>

      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">Photo gallery</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <figure key={i} className="m-0">
            <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#dfe4e8] bg-[#f3f6fa] flex items-center justify-center text-[#5e717d] text-sm font-sans">
              Photo to be added
            </div>
            <figcaption className="text-xs text-[#5e717d] mt-1.5 font-sans">Project photo to be added</figcaption>
          </figure>
        ))}
      </div>
    </PublicShell>
  );
}
