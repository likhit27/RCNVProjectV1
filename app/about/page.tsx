import Link from 'next/link';
import { PublicShell } from '@/app/components/public/PublicShell';
import { externalLinks } from '@/lib/rcnv-public-data';

export default function AboutPage() {
  return (
    <PublicShell>
      <div className="pt-7 pb-2">
        <p className="text-xs text-[#5e717d] m-0 mb-1.5">
          <Link href="/" className="text-[#0067c8] hover:underline">Home</Link> / About
        </p>
        <h1 className="text-[#17458f] font-bold leading-tight m-0 mb-2" style={{ fontSize: 'clamp(28px,5vw,42px)' }}>About Our Club</h1>
        <p className="text-lg text-[#3a4654] m-0">The Rotary Club of Nagpur Vision is a Rotary club in Nagpur, Maharashtra, in Rotary District 3030.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3.5 mt-5">
        <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5">
          <h3 className="text-[#17458f] text-lg font-bold m-0 mb-3">Meeting info and location</h3>
          <dl className="grid grid-cols-[120px_1fr] gap-y-2 gap-x-3 m-0">
            <dt className="font-bold text-[#5e717d] text-sm">Day and time</dt>
            <dd className="m-0"><span className="bg-[#fff6e0] border border-dashed border-[#f7a81b] rounded px-2 py-0.5 text-xs text-[#6b4a00] font-sans">To be confirmed</span></dd>
            <dt className="font-bold text-[#5e717d] text-sm">Venue</dt>
            <dd className="m-0"><span className="bg-[#fff6e0] border border-dashed border-[#f7a81b] rounded px-2 py-0.5 text-xs text-[#6b4a00] font-sans">To be confirmed</span></dd>
            <dt className="font-bold text-[#5e717d] text-sm">Visitors</dt>
            <dd className="m-0 text-sm">Contact the club first. <Link href="/contact" className="text-[#0067c8] hover:underline">Contact page</Link></dd>
          </dl>
        </div>
        <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5">
          <h3 className="text-[#17458f] text-lg font-bold m-0 mb-3">Our district</h3>
          <p className="text-sm m-0 mb-2">Our club belongs to <a href={externalLinks.district} target="_blank" rel="noreferrer" className="text-[#0067c8] hover:underline">Rotary District 3030</a>.</p>
          <p className="text-sm m-0"><a href={externalLinks.ri} target="_blank" rel="noreferrer" className="text-[#0067c8] hover:underline">Rotary International</a></p>
        </div>
      </div>

      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">History</h2>
      <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5">
        <p className="m-0 mb-2">Charter date, founding members and milestones: <span className="bg-[#fff6e0] border border-dashed border-[#f7a81b] rounded px-2 py-0.5 text-xs text-[#6b4a00] font-sans">To be confirmed by the club</span>.</p>
        <p className="m-0 text-sm text-[#3a4654]">The existing club site at <a href={externalLinks.existing} target="_blank" rel="noreferrer" className="text-[#0067c8] hover:underline">rcnv.in</a> mentions the club's Vision newsletter and a Model United Nations Assembly in District 3030.</p>
      </div>

      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">Our focus</h2>
      <p className="text-[#3a4654]">Recent public reports show the club working on community health and the environment: <Link href="/projects" className="text-[#0067c8] hover:underline">blood donation, school health camps and tree plantation</Link>.</p>

      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">Rotary mission</h2>
      <p className="text-[#3a4654]">Rotary connects neighbours, friends, leaders and problem-solvers who see a world where people unite and take action to create lasting change. <Link href="/what-is-rotary" className="text-[#0067c8] hover:underline">What is Rotary?</Link></p>
    </PublicShell>
  );
}
