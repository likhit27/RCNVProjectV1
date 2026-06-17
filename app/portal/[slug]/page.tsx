export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getClubBySlug, getSessionByToken, getClubUserByEmail, getFullMembers, getNews, getProjects, getMemberDues } from '@/lib/db';
import MemberPortal from './MemberPortal';

export default async function PortalPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  const session = token ? await getSessionByToken(token) : null;

  if (!session || new Date() > session.expiresAt) redirect('/login');

  const club = await getClubBySlug(slug);
  if (session.clubId !== club.id) redirect('/login');

  const currentUser = await getClubUserByEmail(club.id, session.email);
  if (!currentUser) redirect('/login');

  // Admins go to admin dashboard
  const adminRoles = ['super_admin', 'secretary', 'treasurer', 'president'];
  if (adminRoles.includes(currentUser.role || '')) redirect(`/admin/${slug}`);

  const [members, news, projects] = await Promise.all([
    getFullMembers(club.id),
    getNews(club.id),
    getProjects(club.id),
  ]);

  const myDues = currentUser.memberId
    ? await getMemberDues(club.id, currentUser.memberId)
    : [];

  const serial = (v: unknown): unknown => JSON.parse(JSON.stringify(v));

  return (
    <MemberPortal
      slug={slug}
      club={serial(club) as { id: string; name: string; slug: string }}
      currentUser={serial(currentUser) as { id: string; email: string; role: string | null; memberId: string | null; member: { id: string; name: string } | null }}
      initialMembers={serial(members) as Parameters<typeof MemberPortal>[0]['initialMembers']}
      initialNews={serial(news) as Parameters<typeof MemberPortal>[0]['initialNews']}
      initialProjects={serial(projects) as Parameters<typeof MemberPortal>[0]['initialProjects']}
      initialMyDues={serial(myDues) as Parameters<typeof MemberPortal>[0]['initialMyDues']}
    />
  );
}
