import Link from 'next/link';
import Image from 'next/image';
import { PublicShell } from '@/app/components/public/PublicShell';
import { projects, externalLinks } from '@/lib/rcnv-public-data';

function ProjectCard({ p }: { p: (typeof projects)[number] }) {
  return (
    <article className="bg-white border border-[#dfe4e8] rounded-[18px] p-5 flex flex-col gap-2">
      <span className="inline-block bg-[#f3f6fa] text-[#17458f] text-xs font-bold px-3 py-1 rounded-full self-start">{p.avenue}</span>
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
      <a href={p.source} target="_blank" rel="noreferrer" className="text-[#0067c8] text-sm mt-1 hover:underline">
        Read the news report
      </a>
    </article>
  );
}

const verifiedProjects = projects.filter(p => p.year === '2025-26');

export default function HomePage() {
  return (
    <PublicShell>
      {/* Hero */}
      <section className="grid md:grid-cols-[1.3fr_1fr] gap-7 items-center bg-[#17458f] text-white rounded-3xl px-10 py-10 mt-6 max-sm:px-6 max-sm:py-8">
        <div>
          <p className="text-[#f7a81b] uppercase tracking-widest text-xs font-bold m-0 mb-2">Rotary Club of Nagpur Vision</p>
          <h1 className="text-white font-bold leading-tight m-0 mb-3" style={{ fontSize: 'clamp(32px,6vw,52px)' }}>
            People of Action in Nagpur
          </h1>
          <p className="text-[#e6eefb] text-lg m-0 mb-6">
            We are neighbours, professionals and friends who take action on health, the environment and opportunity in our city.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full font-bold text-sm bg-[#f7a81b] text-[#1f2a37] border-2 border-[#f7a81b] hover:bg-white hover:text-[#17458f] transition-colors no-underline"
            >
              Join or Volunteer
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full font-bold text-sm bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#17458f] transition-colors no-underline"
            >
              See Our Projects
            </Link>
          </div>
        </div>
        <figure className="m-0 max-md:hidden">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src="/hero.jpg"
              alt="Volunteers at a RCNV community event"
              fill
              className="object-cover"
              priority
            />
          </div>
          <figcaption className="text-[#cfdcf2] text-xs mt-2 font-sans">
            Illustration. Real club photos to be added with member permission.
          </figcaption>
        </figure>
      </section>

      {/* Impact stats */}
      <section aria-label="Impact highlights" className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5">
        {[
          { value: '20', label: 'units of blood collected, 4 July 2025' },
          { value: '~300', label: 'students screened, 12 November 2025' },
          { value: '~60', label: 'girls at hygiene session' },
          { value: String(verifiedProjects.length), label: 'projects reported in 2025-26 news' },
        ].map(s => (
          <div key={s.label} className="bg-[#f3f6fa] rounded-[18px] p-5">
            <b className="block text-[40px] font-bold text-[#17458f] leading-tight font-sans">{s.value}</b>
            <span className="text-[#5e717d] text-sm font-sans">{s.label}</span>
          </div>
        ))}
      </section>
      <p className="text-[#5e717d] text-xs mt-2">Figures from public news reports of 2025-26 projects.</p>

      {/* Latest projects */}
      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">Latest from the club</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {verifiedProjects.map(p => <ProjectCard key={p.id} p={p} />)}
      </div>

      {/* Quick links */}
      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">Quick links</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {[
          { href: '/about', title: 'About the club', desc: 'Who we are, when and where we meet.' },
          { href: '/directors', title: 'Directors', desc: 'The board and avenue directors.' },
          { href: '/events', title: 'Events & newsletters', desc: 'Speakers, service days and the Vision newsletter.' },
          { href: '/get-involved', title: 'Get involved', desc: 'Visit a meeting, volunteer or partner with us.', accent: true },
        ].map(tile => (
          <Link
            key={tile.href}
            href={tile.href}
            className={`block rounded-[18px] border p-5 no-underline transition-colors hover:border-[#f7a81b] ${
              tile.accent ? 'bg-[#f7a81b] border-[#f7a81b]' : 'bg-white border-[#dfe4e8]'
            }`}
          >
            <h3 className={`text-lg font-bold m-0 mb-1 ${tile.accent ? 'text-[#1f2a37]' : 'text-[#17458f]'}`}>{tile.title}</h3>
            <p className={`text-sm m-0 ${tile.accent ? 'text-[#1f2a37]/80' : 'text-[#5e717d]'}`}>{tile.desc}</p>
          </Link>
        ))}
        <a href={externalLinks.district} target="_blank" rel="noreferrer"
          className="block rounded-[18px] border border-[#dfe4e8] bg-white p-5 no-underline hover:border-[#f7a81b] transition-colors">
          <h3 className="text-[#17458f] text-lg font-bold m-0 mb-1">Rotary District 3030</h3>
          <p className="text-[#5e717d] text-sm m-0">Our district website (opens in a new tab).</p>
        </a>
        <a href={externalLinks.ri} target="_blank" rel="noreferrer"
          className="block rounded-[18px] border border-[#dfe4e8] bg-white p-5 no-underline hover:border-[#f7a81b] transition-colors">
          <h3 className="text-[#17458f] text-lg font-bold m-0 mb-1">Rotary International</h3>
          <p className="text-[#5e717d] text-sm m-0">Rotary.org and My Rotary.</p>
        </a>
      </div>

      {/* Next meeting */}
      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">Next meeting</h2>
      <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5">
        <p className="m-0"><b>Day, time and venue:</b> <span className="bg-[#fff6e0] border border-dashed border-[#f7a81b] rounded px-2 py-0.5 text-sm text-[#6b4a00] font-sans">To be confirmed by the club</span></p>
        <p className="text-sm text-[#5e717d] mt-2 mb-0">Visitors are welcome once the club confirms its meeting details.{' '}
          <Link href="/contact" className="text-[#0067c8] hover:underline">Contact us to confirm.</Link>
        </p>
      </div>
    </PublicShell>
  );
}
