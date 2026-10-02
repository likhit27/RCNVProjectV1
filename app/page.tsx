export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { PublicShell } from '@/app/components/public/PublicShell';
import { getWebProjects, getUpcomingWebEvents, getSiteCounters, getActiveBanners, getPageContent } from '@/lib/cms-db';
import { projects as fallbackProjects } from '@/lib/rcnv-public-data';

type DisplayProject = { id: string; title: string; avenue: string; description: string; imageUrl: string | null; impact: { value: string; label: string }[] };

const DEFAULT_COUNTERS = [
  { label: 'Members', value: '100+' },
  { label: 'Projects', value: '25+' },
  { label: 'Beneficiaries', value: '1,000+' },
  { label: 'Man Hours', value: '5,000+' },
];

async function getData() {
  try {
    const [dbProjects, events, counters, banners, heroTitle, heroSub] = await Promise.all([
      getWebProjects(true), getUpcomingWebEvents(), getSiteCounters(),
      getActiveBanners(), getPageContent('home.hero.title'), getPageContent('home.hero.subtitle'),
    ]);
    return { dbProjects, events, counters, banners, heroTitle, heroSub };
  } catch {
    return { dbProjects: [], events: [], counters: [], banners: [], heroTitle: null, heroSub: null };
  }
}

export default async function HomePage() {
  const { dbProjects, events, counters, banners, heroTitle, heroSub } = await getData();

  const projects: DisplayProject[] = dbProjects.length > 0
    ? dbProjects.map(p => ({
        id: p.id, title: p.title, avenue: p.avenue, description: p.description,
        imageUrl: p.imageUrl,
        impact: Array.isArray(p.impact) ? p.impact as { value: string; label: string }[] : [],
      }))
    : fallbackProjects.map(p => ({
        id: p.id, title: p.title, avenue: p.avenue, description: p.summary,
        imageUrl: null, impact: p.impact,
      }));

  const displayCounters = counters.length > 0 ? counters : DEFAULT_COUNTERS;
  const heroBanner = banners[0];

  const title = heroTitle ?? 'Be a Gift to the World';
  const subtitle = heroSub ?? 'We are neighbours, professionals and friends who take action on health, the environment and opportunity in Nagpur.';

  return (
    <PublicShell>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#002664] overflow-hidden">
        {/* Background hero image */}
        {heroBanner ? (
          <div className="absolute inset-0">
            <Image src={heroBanner.imageUrl} alt={heroBanner.title} fill className="object-cover opacity-20" priority />
          </div>
        ) : (
          <div className="absolute inset-0">
            <Image src="/hero.jpg" alt="RCNV volunteers" fill className="object-cover opacity-20" priority />
          </div>
        )}

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-12 text-center text-white">
          <p className="text-[#F7A81B] uppercase tracking-[0.2em] text-xs font-bold mb-4">Rotary Club of Nagpur Vision · District 3030</p>
          <h1
            className="font-black leading-tight mb-6 mx-auto max-w-3xl"
            style={{ fontSize: 'clamp(36px, 7vw, 68px)', lineHeight: 1.1 }}
          >
            {title}
          </h1>
          <p className="text-[#c8d9f0] text-lg max-w-2xl mx-auto mb-8 leading-relaxed">{subtitle}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/get-involved"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#F7A81B] text-[#1f2a37] font-bold text-sm hover:bg-[#e09810] transition-colors no-underline">
              Join or Volunteer
            </Link>
            <Link href="/projects"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-transparent text-white border-2 border-white font-bold text-sm hover:bg-white hover:text-[#002664] transition-colors no-underline">
              See Our Projects
            </Link>
          </div>
        </div>

        {/* ── Counters strip ──────────────────────────────────────────────────── */}
        <div className="relative bg-[#001d4f]/80 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/10">
            {displayCounters.map((c) => (
              <div key={c.label} className="text-center px-4">
                <p
                  className="font-black leading-none mb-2"
                  style={{
                    fontSize: 'clamp(40px, 7vw, 64px)',
                    background: 'linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.4))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {c.value}
                </p>
                <p className="text-[#94b8e0] uppercase tracking-widest text-xs font-semibold">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Projects ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#F7A81B] uppercase tracking-widest text-xs font-bold mb-1">What We Do</p>
            <h2 className="text-3xl font-bold text-[#002664]">Our Projects</h2>
          </div>
          <Link href="/projects" className="text-[#002664] text-sm font-semibold hover:underline no-underline">
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((p) => (
            <article key={p.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              {p.imageUrl ? (
                <div className="relative h-44">
                  <Image src={p.imageUrl} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="h-44 bg-gradient-to-br from-[#002664] to-[#0a3a8a] flex items-center justify-center">
                  <span className="text-white/20 text-6xl font-black">R</span>
                </div>
              )}
              <div className="p-5">
                <span className="inline-block bg-[#f0f4ff] text-[#002664] text-xs font-bold px-3 py-1 rounded-full mb-3">{p.avenue}</span>
                <h3 className="text-[#002664] font-bold text-base mb-2 leading-snug">{p.title}</h3>
                <p className="text-[#5e717d] text-sm mb-3 line-clamp-2">{p.description}</p>
                {p.impact.length > 0 && (
                  <div className="flex gap-4 border-t border-slate-100 pt-3">
                    {p.impact.slice(0, 2).map(i => (
                      <div key={i.label}>
                        <b className="block text-lg font-black text-[#c10042]">{i.value}</b>
                        <span className="text-[#5e717d] text-xs">{i.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Upcoming Events ──────────────────────────────────────────────────── */}
      <section className="bg-[#f8fafc] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[#F7A81B] uppercase tracking-widest text-xs font-bold mb-1">Join Us</p>
              <h2 className="text-3xl font-bold text-[#002664]">Upcoming Events</h2>
            </div>
            <Link href="/events" className="text-[#002664] text-sm font-semibold hover:underline no-underline">View all →</Link>
          </div>
          {events.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map(ev => (
                <div key={ev.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#002664] text-white rounded-xl px-3 py-2 text-center flex-shrink-0 min-w-[50px]">
                      <p className="text-xl font-black leading-none">{new Date(ev.date).getDate()}</p>
                      <p className="text-[10px] uppercase tracking-wider opacity-80">{new Date(ev.date).toLocaleString('en-IN', { month: 'short' })}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#002664] text-sm leading-snug mb-1">{ev.title}</h3>
                      {ev.venue && <p className="text-[#5e717d] text-xs">📍 {ev.venue}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center">
              <p className="text-slate-400 mb-2">No upcoming events published yet.</p>
              <p className="text-slate-400 text-sm">Check back soon or <Link href="/contact" className="text-[#002664] hover:underline">contact the club</Link>.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Service Avenues ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-[#F7A81B] uppercase tracking-widest text-xs font-bold mb-1">How We Serve</p>
          <h2 className="text-3xl font-bold text-[#002664]">Five Avenues of Service</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { name: 'Club Service', icon: '🤝', desc: 'Fellowship, meetings and membership' },
            { name: 'Vocational Service', icon: '💼', desc: 'Ethics and professional excellence' },
            { name: 'Community Service', icon: '🌿', desc: 'Health, environment and education' },
            { name: 'International Service', icon: '🌍', desc: 'Global partnerships and The Foundation' },
            { name: 'Youth Service', icon: '🎓', desc: 'Developing the next generation' },
          ].map(a => (
            <div key={a.name} className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-sm hover:border-[#F7A81B] transition-colors">
              <span className="text-3xl mb-3 block">{a.icon}</span>
              <h3 className="text-[#002664] font-bold text-sm mb-1">{a.name}</h3>
              <p className="text-slate-500 text-xs">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Get Involved CTA ────────────────────────────────────────────────── */}
      <section className="bg-[#002664] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <p className="text-[#F7A81B] uppercase tracking-widest text-xs font-bold mb-3">Take Action</p>
          <h2 className="text-4xl font-black mb-4">Become a Person of Action</h2>
          <p className="text-[#c8d9f0] mb-8 text-lg">Bring a skill, an hour, or an idea. Start with a meeting and see the work for yourself.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/get-involved"
              className="inline-flex items-center h-12 px-8 rounded-full bg-[#F7A81B] text-[#1f2a37] font-bold text-sm hover:bg-[#e09810] transition-colors no-underline">
              Join or Volunteer
            </Link>
            <Link href="/contact"
              className="inline-flex items-center h-12 px-8 rounded-full bg-transparent text-white border-2 border-white font-bold text-sm hover:bg-white hover:text-[#002664] transition-colors no-underline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
