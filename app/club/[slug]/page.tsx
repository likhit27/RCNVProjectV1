export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getClubBySlug, getMembers, getNews, getProjects, getDuesSummary } from '@/lib/db';

export default async function ClubPage(props: any) {
  const { slug } = props.params as { slug: string };
  const club = await getClubBySlug(slug);
  const members = await getMembers(club.id);
  const news = await getNews(club.id);
  const projects = await getProjects(club.id);
  const dues = await getDuesSummary(club.id);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Club</p>
              <h1 className="text-4xl font-semibold">{club.name}</h1>
            </div>
            <Link href="/login" className="rounded-full border border-slate-300 px-5 py-3 text-sm text-slate-700 hover:bg-slate-100">
              Admin login
            </Link>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div>
              <h2 className="text-2xl font-semibold">Announcements</h2>
              <p className="mt-2 text-slate-600">Latest club updates and pinned news.</p>
            </div>
            <div className="space-y-4">
              {news.map((item) => (
                <article key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    {item.pinned && <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">Pinned</span>}
                  </div>
                  <p className="mt-3 text-slate-600">{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold">Club snapshot</h2>
            <dl className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-slate-50 p-4">
                <dt className="text-sm uppercase tracking-[0.2em] text-slate-500">Members</dt>
                <dd className="mt-2 text-3xl font-semibold">{members.length}</dd>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <dt className="text-sm uppercase tracking-[0.2em] text-slate-500">Projects</dt>
                <dd className="mt-2 text-3xl font-semibold">{projects.length}</dd>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <dt className="text-sm uppercase tracking-[0.2em] text-slate-500">Open dues</dt>
                <dd className="mt-2 text-3xl font-semibold">{dues.unpaidCount}</dd>
              </div>
            </dl>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Active projects</h2>
              <p className="mt-2 text-slate-600">See the club's active service initiatives.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <article key={project.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-500">{project.avenue}</p>
                <p className="mt-3 text-slate-600">{project.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Member directory</h2>
              <p className="mt-2 text-slate-600">Public member directory overview.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {members.map((member) => (
              <div key={member.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="mt-2 text-slate-600">{member.classification || 'Rotarian'}</p>
                <p className="mt-2 text-sm text-slate-500">{member.email || 'No email'}</p>
                <p className="mt-1 text-sm text-slate-500">{member.phone || 'No phone'}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
