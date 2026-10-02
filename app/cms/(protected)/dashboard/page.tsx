import Link from 'next/link';
import { getWebProjects, getWebEvents, getWebDirectors, getBanners, getPastPresidents, getNewsletters } from '@/lib/cms-db';

async function getStats() {
  try {
    const [projects, events, directors, banners, presidents, newsletters] = await Promise.all([
      getWebProjects(), getWebEvents(), getWebDirectors(), getBanners(), getPastPresidents(), getNewsletters(),
    ]);
    return { projects: projects.length, events: events.length, directors: directors.length, banners: banners.length, presidents: presidents.length, newsletters: newsletters.length };
  } catch { return { projects: 0, events: 0, directors: 0, banners: 0, presidents: 0, newsletters: 0 }; }
}

const quickLinks = [
  { href: '/cms/banners', label: 'Hero Banners', desc: 'Manage homepage hero slides', icon: '🖼️' },
  { href: '/cms/counters', label: 'Counters', desc: 'Impact numbers shown on homepage', icon: '🔢' },
  { href: '/cms/projects', label: 'Projects', desc: 'Community service projects', icon: '📝' },
  { href: '/cms/events', label: 'Events', desc: 'Upcoming and past events', icon: '📅' },
  { href: '/cms/directors', label: 'Directors', desc: 'Board of directors', icon: '👤' },
  { href: '/cms/past-presidents', label: 'Past Presidents', desc: 'Club presidents by year', icon: '🏆' },
  { href: '/cms/newsletters', label: 'Newsletters', desc: 'Vision newsletter issues', icon: '📰' },
  { href: '/cms/gallery', label: 'Gallery', desc: 'Photo albums', icon: '🖼️' },
  { href: '/cms/pages', label: 'Page Content', desc: 'About, contact and other text', icon: '📄' },
];

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Rotary Club Nagpur Vision — Website CMS</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Projects', value: stats.projects },
          { label: 'Events', value: stats.events },
          { label: 'Directors', value: stats.directors },
          { label: 'Banners', value: stats.banners },
          { label: 'Past Presidents', value: stats.presidents },
          { label: 'Newsletters', value: stats.newsletters },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
            <p className="text-3xl font-bold text-[#002664]">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="text-lg font-semibold text-slate-800 mb-3">Manage Content</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map(q => (
          <Link key={q.href} href={q.href}
            className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:border-[#F7A81B] hover:shadow transition-all no-underline flex items-start gap-3">
            <span className="text-2xl">{q.icon}</span>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{q.label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{q.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-[#fff8e6] border border-[#F7A81B]/30 rounded-xl p-4">
        <p className="text-sm font-semibold text-[#6b4a00]">💡 Getting started</p>
        <p className="text-sm text-[#6b4a00]/80 mt-1">Start with <strong>Counters</strong> to set impact numbers, then add <strong>Projects</strong> and <strong>Events</strong>. Use <strong>Hero Banners</strong> to control the homepage slides. Changes publish immediately.</p>
      </div>
    </div>
  );
}
