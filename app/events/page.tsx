export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { PublicShell } from '@/app/components/public/PublicShell';
import { getWebEvents } from '@/lib/cms-db';

export default async function EventsPage() {
  let events: { id: string; title: string; description: string | null; date: Date; venue: string | null; imageUrl: string | null }[] = [];
  try {
    const db = await getWebEvents();
    events = db as typeof events;
  } catch { /* empty */ }

  const now = new Date();
  const upcoming = events.filter(e => new Date(e.date) >= now);
  const past = events.filter(e => new Date(e.date) < now);

  return (
    <PublicShell>
      <section className="bg-[#002664] py-12">
        <div className="max-w-7xl mx-auto px-4 text-white">
          <p className="text-xs text-[#F7A81B] uppercase tracking-widest font-bold mb-2">
            <Link href="/" className="text-[#F7A81B] hover:underline no-underline">Home</Link> / Events
          </p>
          <h1 className="text-4xl font-black mb-2">Events</h1>
          <p className="text-[#c8d9f0] text-lg">Meetings, service days, speaker sessions and special events.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">

        {/* Upcoming */}
        <div>
          <h2 className="text-2xl font-bold text-[#002664] mb-6">Upcoming Events</h2>
          {upcoming.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map(ev => (
                <div key={ev.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#002664] text-white rounded-xl px-3 py-2 text-center flex-shrink-0 min-w-[56px]">
                      <p className="text-2xl font-black leading-none">{new Date(ev.date).getDate()}</p>
                      <p className="text-[10px] uppercase tracking-wider opacity-80">{new Date(ev.date).toLocaleString('en-IN', { month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#002664] text-sm leading-snug mb-1">{ev.title}</h3>
                      {ev.venue && <p className="text-[#5e717d] text-xs mb-1">📍 {ev.venue}</p>}
                      {ev.description && <p className="text-[#5e717d] text-xs line-clamp-2">{ev.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center">
              <p className="text-slate-400 mb-2">No upcoming events published yet.</p>
              <p className="text-slate-400 text-sm">Events are managed through the <a href="/cms" className="text-[#002664] hover:underline">CMS</a>.</p>
            </div>
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#002664] mb-6">Past Events</h2>
            <div className="space-y-3">
              {past.map(ev => (
                <div key={ev.id} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="bg-slate-100 text-slate-500 rounded-lg px-3 py-2 text-center flex-shrink-0 min-w-[56px]">
                    <p className="text-lg font-bold leading-none">{new Date(ev.date).getDate()}</p>
                    <p className="text-[10px] uppercase">{new Date(ev.date).toLocaleString('en-IN', { month: 'short', year: '2-digit' })}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 text-sm">{ev.title}</h3>
                    {ev.venue && <p className="text-slate-400 text-xs">{ev.venue}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <div className="bg-[#f0f4ff] border border-[#c8d9f0] rounded-2xl p-6 text-center">
            <p className="text-[#002664] font-semibold mb-1">Weekly Meetings</p>
            <p className="text-[#5e717d] text-sm">The club meets weekly. Contact us for the venue and time.</p>
            <Link href="/contact" className="inline-block mt-3 text-[#002664] text-sm font-bold hover:underline no-underline">Contact the club →</Link>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
