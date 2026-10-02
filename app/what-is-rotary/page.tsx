import Link from 'next/link';
import { PublicShell } from '@/app/components/public/PublicShell';
import { causes, externalLinks } from '@/lib/rcnv-public-data';

export default function WhatIsRotaryPage() {
  return (
    <PublicShell>
      <div className="pt-7 pb-2">
        <p className="text-xs text-[#5e717d] m-0 mb-1.5">
          <Link href="/" className="text-[#0067c8] hover:underline">Home</Link> / What Is Rotary?
        </p>
        <h1 className="text-[#17458f] font-bold leading-tight m-0 mb-2" style={{ fontSize: 'clamp(28px,5vw,42px)' }}>What Is Rotary?</h1>
        <p className="text-lg text-[#3a4654] m-0">Rotary connects a global network of neighbours, friends, leaders and problem-solvers who see a world where people unite and take action to create lasting change.</p>
      </div>

      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">Our causes</h2>
      <ul className="flex flex-wrap gap-2 p-0 list-none m-0">
        {causes.map(c => (
          <li key={c} className="bg-[#f3f6fa] border border-[#dfe4e8] rounded-full px-4 py-1.5 text-[#17458f] font-bold text-sm font-sans">{c}</li>
        ))}
      </ul>

      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">The Rotary Foundation</h2>
      <p className="text-[#3a4654]">The Rotary Foundation funds service projects around the world. Learn more on <a href={externalLinks.ri} target="_blank" rel="noreferrer" className="text-[#0067c8] hover:underline">rotary.org</a>.</p>

      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">Our district</h2>
      <p className="text-[#3a4654]">Clubs in Nagpur belong to <a href={externalLinks.district} target="_blank" rel="noreferrer" className="text-[#0067c8] hover:underline">Rotary District 3030</a>.</p>

      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">Join us</h2>
      <p className="text-[#3a4654]">Interested in becoming part of the Rotary Club Nagpur Vision? <Link href="/get-involved" className="text-[#0067c8] hover:underline">Find out how to get involved.</Link></p>
    </PublicShell>
  );
}
