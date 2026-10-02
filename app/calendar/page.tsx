import Link from 'next/link';
import { PublicShell } from '@/app/components/public/PublicShell';
import { projects, months } from '@/lib/rcnv-public-data';

export default function CalendarPage() {
  const year = '2025-26';
  const firstYear = 2025;
  const items = projects.filter(p => p.year === year);
  return (
    <PublicShell>
      <div className="pt-7 pb-2">
        <p className="text-xs text-[#5e717d] m-0 mb-1.5">
          <Link href="/" className="text-[#0067c8] hover:underline">Home</Link> / Calendar
        </p>
        <h1 className="text-[#17458f] font-bold leading-tight m-0 mb-2" style={{ fontSize: 'clamp(28px,5vw,42px)' }}>Calendar</h1>
        <p className="text-lg text-[#3a4654] m-0">Month by month for Rotary year 2025-26, July to June.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        {months.map((month, i) => {
          const y = i < 6 ? firstYear : firstYear + 1;
          const hits = items.filter(p => p.date.includes(month) && p.date.includes(String(y)));
          return (
            <div key={month} className="bg-white border border-[#dfe4e8] rounded-[18px] p-4">
              <h3 className="text-[#17458f] text-[15px] font-bold m-0 mb-2">{month} {y}</h3>
              {hits.length > 0 ? (
                <ul className="list-none p-0 m-0">
                  {hits.map(h => (
                    <li key={h.id} className="text-xs text-[#3a4654] py-1 border-b border-[#f3f6fa] last:border-0">
                      <span className="font-semibold">{h.date}:</span> {h.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#5e717d] text-xs m-0">No events published</p>
              )}
            </div>
          );
        })}
      </div>

      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">Regular meetings</h2>
      <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5">
        <p className="m-0">Weekly or fortnightly meeting day, time and venue: <span className="bg-[#fff6e0] border border-dashed border-[#f7a81b] rounded px-2 py-0.5 text-xs text-[#6b4a00] font-sans">To be confirmed by the club</span>.</p>
      </div>
    </PublicShell>
  );
}
