import Link from 'next/link';
import { PublicShell } from '@/app/components/public/PublicShell';
import { projects, externalLinks } from '@/lib/rcnv-public-data';

export default function EventsPage() {
  const pastEvents = projects.filter(p => p.year === '2025-26');
  return (
    <PublicShell>
      <div className="pt-7 pb-2">
        <p className="text-xs text-[#5e717d] m-0 mb-1.5">
          <Link href="/" className="text-[#0067c8] hover:underline">Home</Link> / Events & Newsletters
        </p>
        <h1 className="text-[#17458f] font-bold leading-tight m-0 mb-2" style={{ fontSize: 'clamp(28px,5vw,42px)' }}>Events & Newsletters</h1>
        <p className="text-lg text-[#3a4654] m-0">Speakers, service days and the club newsletter.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3.5 mt-5">
        <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5">
          <h3 className="text-[#17458f] text-lg font-bold m-0 mb-2">Upcoming events</h3>
          <p className="text-sm m-0 mb-2">No events are published for 2025-26 yet. <span className="bg-[#fff6e0] border border-dashed border-[#f7a81b] rounded px-2 py-0.5 text-xs text-[#6b4a00] font-sans">Dates to be confirmed</span>.</p>
          <Link href="/calendar" className="text-[#0067c8] text-sm hover:underline">Open the calendar →</Link>
        </div>
        <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5">
          <h3 className="text-[#17458f] text-lg font-bold m-0 mb-2">Vision newsletter</h3>
          <p className="text-sm m-0 mb-2">The existing club site mentions a Vision newsletter. Issues will be linked here once the club provides them.</p>
          <a href={externalLinks.existing} target="_blank" rel="noreferrer" className="text-[#0067c8] text-sm hover:underline">Visit rcnv.in →</a>
        </div>
      </div>

      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">Past events, 2025-26</h2>
      {pastEvents.length > 0 ? (
        <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5">
          <ul className="list-none p-0 m-0">
            {pastEvents.map((p, i) => (
              <li key={p.id} className={`py-2.5 ${i < pastEvents.length - 1 ? 'border-b border-[#dfe4e8]' : ''}`}>
                <b>{p.date}</b> — {p.title}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-[#eaf4fb] border-l-4 border-[#019fcb] rounded-lg px-4 py-3 font-sans text-[15px]">
          No past events published for 2025-26.
        </div>
      )}

      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">Model United Nations Assembly</h2>
      <p className="text-[#3a4654]">The existing club site mentions this youth event in District 3030. Dates and the club's role: <span className="bg-[#fff6e0] border border-dashed border-[#f7a81b] rounded px-2 py-0.5 text-xs text-[#6b4a00] font-sans">To be confirmed by the club</span>.</p>
    </PublicShell>
  );
}
