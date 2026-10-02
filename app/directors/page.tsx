import Link from 'next/link';
import { PublicShell } from '@/app/components/public/PublicShell';
import { boardRoles } from '@/lib/rcnv-public-data';

export default function DirectorsPage() {
  return (
    <PublicShell>
      <div className="pt-7 pb-2">
        <p className="text-xs text-[#5e717d] m-0 mb-1.5">
          <Link href="/" className="text-[#0067c8] hover:underline">Home</Link> / Directors
        </p>
        <h1 className="text-[#17458f] font-bold leading-tight m-0 mb-2" style={{ fontSize: 'clamp(28px,5vw,42px)' }}>Directors</h1>
        <p className="text-lg text-[#3a4654] m-0">Club president, officers and avenue directors for 2025-26.</p>
      </div>

      <div className="bg-[#eaf4fb] border-l-4 border-[#019fcb] rounded-lg px-4 py-3 mt-5 font-sans text-[15px]">
        Names are not shown because the board for 2025-26 has not been verified. Each card is a slot to fill once the club confirms its board.
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
        {boardRoles.map(role => (
          <div key={role} className="bg-white border border-[#dfe4e8] rounded-[18px] p-5 text-center">
            <div className="w-14 h-14 rounded-full bg-[#f3f6fa] border-2 border-[#f7a81b] flex items-center justify-center mx-auto mb-2.5">
              <span className="text-[#17458f] font-bold text-2xl font-sans">?</span>
            </div>
            <h3 className="text-[#17458f] text-base font-bold m-0 mb-1">{role}</h3>
            <p className="text-sm m-0">
              <span className="bg-[#fff6e0] border border-dashed border-[#f7a81b] rounded px-2 py-0.5 text-xs text-[#6b4a00] font-sans">Name to be confirmed</span>
            </p>
          </div>
        ))}
      </div>
    </PublicShell>
  );
}
