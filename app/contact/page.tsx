import Link from 'next/link';
import { PublicShell } from '@/app/components/public/PublicShell';
import { externalLinks } from '@/lib/rcnv-public-data';

export default function ContactPage() {
  return (
    <PublicShell>
      <div className="pt-7 pb-2">
        <p className="text-xs text-[#5e717d] m-0 mb-1.5">
          <Link href="/" className="text-[#0067c8] hover:underline">Home</Link> / Contact
        </p>
        <h1 className="text-[#17458f] font-bold leading-tight m-0 mb-2" style={{ fontSize: 'clamp(28px,5vw,42px)' }}>Contact</h1>
        <p className="text-lg text-[#3a4654] m-0">How to reach the club.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3.5 mt-5">
        <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5">
          <h3 className="text-[#17458f] text-lg font-bold m-0 mb-3">Club contact</h3>
          <dl className="grid grid-cols-[100px_1fr] gap-y-2 gap-x-3 m-0">
            {(['Email', 'Phone', 'Address', 'Meeting venue'] as const).map(field => (
              <>
                <dt key={`dt-${field}`} className="font-bold text-[#5e717d] text-sm">{field}</dt>
                <dd key={`dd-${field}`} className="m-0">
                  <span className="bg-[#fff6e0] border border-dashed border-[#f7a81b] rounded px-2 py-0.5 text-xs text-[#6b4a00] font-sans">To be confirmed</span>
                </dd>
              </>
            ))}
          </dl>
        </div>
        <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5">
          <h3 className="text-[#17458f] text-lg font-bold m-0 mb-3">Meanwhile</h3>
          <p className="text-sm m-0 mb-2">Until the club adds its details, use the existing club site: <a href={externalLinks.existing} target="_blank" rel="noreferrer" className="text-[#0067c8] hover:underline">rcnv.in</a>.</p>
          <p className="text-sm m-0 mb-2">District: <a href={externalLinks.district} target="_blank" rel="noreferrer" className="text-[#0067c8] hover:underline">Rotary District 3030</a></p>
          <p className="text-sm m-0">Members: <a href={externalLinks.myRotary} target="_blank" rel="noreferrer" className="text-[#0067c8] hover:underline">My Rotary</a></p>
        </div>
      </div>

      <div className="bg-[#eaf4fb] border-l-4 border-[#019fcb] rounded-lg px-4 py-3 mt-5 font-sans text-[15px]">
        This page has no live form yet. A real contact form needs a club email address and a place to send submissions.
      </div>

      <div className="bg-white border border-[#dfe4e8] rounded-[18px] p-5 mt-5">
        <h3 className="text-[#17458f] text-lg font-bold m-0 mb-3">Member login</h3>
        <p className="text-sm m-0 mb-3">Already a member? Log in to the member portal.</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full font-bold text-sm bg-[#17458f] text-white border-2 border-[#17458f] hover:bg-white hover:text-[#17458f] transition-colors no-underline"
        >
          Member Login
        </Link>
      </div>
    </PublicShell>
  );
}
