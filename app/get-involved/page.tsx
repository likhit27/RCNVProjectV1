import Link from 'next/link';
import { PublicShell } from '@/app/components/public/PublicShell';
import { externalLinks } from '@/lib/rcnv-public-data';

export default function GetInvolvedPage() {
  return (
    <PublicShell>
      <div className="pt-7 pb-2">
        <p className="text-xs text-[#5e717d] m-0 mb-1.5">
          <Link href="/" className="text-[#0067c8] hover:underline">Home</Link> / Get Involved
        </p>
        <h1 className="text-[#17458f] font-bold leading-tight m-0 mb-2" style={{ fontSize: 'clamp(28px,5vw,42px)' }}>Get Involved</h1>
        <p className="text-lg text-[#3a4654] m-0">There is more than one way to take part.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
        <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5 flex flex-col gap-3">
          <h3 className="text-[#17458f] text-lg font-bold m-0">Become a member</h3>
          <ol className="m-0 pl-5 text-sm space-y-1">
            <li>Contact the club.</li>
            <li>Visit a meeting as a guest.</li>
            <li>Meet members and talk about the club.</li>
          </ol>
          <p className="text-[#5e717d] text-xs m-0">Membership process and fees: <span className="bg-[#fff6e0] border border-dashed border-[#f7a81b] rounded px-2 py-0.5 text-[#6b4a00]">To be confirmed</span>.</p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full font-bold text-sm bg-[#c10042] text-white border-2 border-[#c10042] hover:bg-white hover:text-[#c10042] transition-colors no-underline mt-auto"
          >
            Ask about membership
          </Link>
        </div>
        <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5 flex flex-col gap-3">
          <h3 className="text-[#17458f] text-lg font-bold m-0">Volunteer</h3>
          <p className="text-sm m-0 flex-1">Bring your time and skills to a health camp, blood donation drive or plantation day.</p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full font-bold text-sm bg-[#c10042] text-white border-2 border-[#c10042] hover:bg-white hover:text-[#c10042] transition-colors no-underline"
          >
            Offer to help
          </Link>
        </div>
        <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5 flex flex-col gap-3">
          <h3 className="text-[#17458f] text-lg font-bold m-0">Partner with us</h3>
          <p className="text-sm m-0 flex-1">Hospitals, schools, companies and other clubs have worked with us. Tell us about a need in Nagpur.</p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full font-bold text-sm bg-white text-[#17458f] border-2 border-[#019fcb] hover:bg-[#019fcb] hover:text-white transition-colors no-underline"
          >
            Start a conversation
          </Link>
        </div>
      </div>

      <h2 className="text-[#17458f] text-2xl font-bold mt-9 mb-3.5">Support a cause</h2>
      <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5">
        <p className="m-0">Donations: <span className="bg-[#fff6e0] border border-dashed border-[#f7a81b] rounded px-2 py-0.5 text-xs text-[#6b4a00] font-sans">Not set up. The club must decide how to accept donations</span>. Rotary Foundation giving is on <a href={externalLinks.ri} target="_blank" rel="noreferrer" className="text-[#0067c8] hover:underline">rotary.org</a>.</p>
      </div>
    </PublicShell>
  );
}
