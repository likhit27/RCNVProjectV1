import Link from 'next/link';
import { cookies } from 'next/headers';
import { getClubBySlug, getMembers, getNews, getProjects, getDuesSummary, getSessionByToken } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminPage(props: any) {
  const { slug } = props.params as { slug: string };
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  const session = token ? await getSessionByToken(token) : null;
  const club = await getClubBySlug(slug);

  if (!session || session.clubId !== club.id) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-2xl font-semibold">Unauthorized</h1>
          <p className="mt-3 text-slate-600">Please log in with your club admin account first.</p>
          <Link href="/login" className="mt-6 inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-700">
            Go to login
          </Link>
        </div>
      </main>
    );
  }

  const members = await getMembers(club.id);
  const news = await getNews(club.id);
  const projects = await getProjects(club.id);
  const dues = await getDuesSummary(club.id);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-[1.6fr_0.75fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold">Admin dashboard</h1>
                <p className="mt-2 text-slate-600">Manage members, news, projects, and dues for {club.name}.</p>
              </div>
              <Link href={`/club/${club.slug}`} className="rounded-full border border-slate-300 px-5 py-3 text-sm text-slate-700 hover:bg-slate-100">
                View club page
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Members</p>
                <p className="mt-4 text-3xl font-semibold">{members.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Projects</p>
                <p className="mt-4 text-3xl font-semibold">{projects.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">News</p>
                <p className="mt-4 text-3xl font-semibold">{news.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Open dues</p>
                <p className="mt-4 text-3xl font-semibold">{dues.unpaidCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">Quick actions</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-600">Upload members via CSV from the admin panel later.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm text-slate-600">This demo includes a seeded admin and sample club data.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">Members</h2>
            <div className="mt-6 grid gap-4">
              {members.map((member) => (
                <div key={member.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{member.email || 'No email'}</p>
                    </div>
                    <p className="text-sm text-slate-500">{member.phone || 'No phone'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">Club news</h2>
            <div className="mt-6 space-y-4">
              {news.map((item) => (
                <div key={item.id} className="rounded-3xl bg-slate-50 p-5">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
