export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { cookies } from 'next/headers';
import { getClubBySlug, getFullMembers, getNews, getProjects, getDues, getClubUsers, getSessionByToken, getClubUserByEmail } from '@/lib/db';
import AdminDashboard from './AdminDashboard';
import { redirect } from 'next/navigation';

export default async function AdminPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  const session = token ? await getSessionByToken(token) : null;

  let club;
  try {
    club = await getClubBySlug(slug);
  } catch {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="rounded-2xl border bg-white p-10 shadow-sm text-center">
          <h1 className="text-xl font-semibold">Club not found</h1>
          <Link href="/" className="mt-4 inline-block text-sm text-blue-600 hover:underline">Go home</Link>
        </div>
      </main>
    );
  }

  if (!session || session.clubId !== club.id || new Date() > session.expiresAt) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="rounded-2xl border bg-white p-10 shadow-sm text-center">
          <h1 className="text-2xl font-semibold text-[#002664]">Unauthorized</h1>
          <p className="mt-2 text-slate-600">Please log in with your club admin account.</p>
          <Link href="/login" className="mt-6 inline-flex rounded-xl bg-[#002664] px-6 py-3 text-white hover:bg-[#001a4a] text-sm font-medium">
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  const currentUser = await getClubUserByEmail(club.id, session.email);
  if (!currentUser) redirect('/login');

  const adminRoles = ['super_admin', 'secretary', 'treasurer', 'president'];
  if (!adminRoles.includes(currentUser.role || '')) redirect(`/portal/${slug}`);

  const [members, news, projects, dues, users] = await Promise.all([
    getFullMembers(club.id),
    getNews(club.id),
    getProjects(club.id),
    getDues(club.id),
    getClubUsers(club.id),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serial = (v: unknown): any => JSON.parse(JSON.stringify(v));

  return (
    <AdminDashboard
      slug={slug}
      club={serial(club)}
      currentRole={currentUser.role as 'super_admin'|'secretary'|'treasurer'|'president'}
      initialMembers={serial(members)}
      initialNews={serial(news)}
      initialProjects={serial(projects)}
      initialDues={serial(dues)}
      initialUsers={serial(users)}
    />
  );
}
