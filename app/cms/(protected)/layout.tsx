import { redirect } from 'next/navigation';
import { requireCmsSession } from '@/lib/cms-auth';
import { CmsSidebar } from '../components/CmsSidebar';

export default async function CmsProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireCmsSession();
  if (!session) redirect('/cms/login');
  return (
    <div className="flex min-h-screen bg-[#f8fafc]" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <CmsSidebar admin={session.admin} />
      <main className="flex-1 p-6 overflow-y-auto min-w-0">{children}</main>
    </div>
  );
}
