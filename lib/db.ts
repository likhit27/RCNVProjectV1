import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getClubBySlug(slug: string) {
  const club = await prisma.club.findUnique({ where: { slug } });
  if (!club) {
    throw new Error('Club not found');
  }
  return club;
}

export async function getMembers(clubId: string) {
  return prisma.member.findMany({ where: { clubId }, orderBy: { name: 'asc' } });
}

export async function getNews(clubId: string) {
  return prisma.news.findMany({ where: { clubId }, orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }] });
}

export async function getProjects(clubId: string) {
  return prisma.project.findMany({ where: { clubId }, orderBy: { startedAt: 'desc' } });
}

export async function getDuesSummary(clubId: string) {
  const unpaidCount = await prisma.due.count({ where: { clubId, paid: false } });
  return { unpaidCount };
}

export async function getSessionByToken(token: string) {
  return prisma.session.findUnique({ where: { token } });
}

export async function createSession(clubId: string, email: string, token: string, expiresAt: Date) {
  return prisma.session.create({ data: { clubId, email, token, expiresAt } });
}

export async function clearSession(token: string) {
  return prisma.session.deleteMany({ where: { token } });
}

export async function getClubUserByEmail(clubId: string, email: string) {
  return prisma.clubUser.findUnique({ where: { clubId_email: { clubId, email } } });
}
