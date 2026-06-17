import { PrismaClient } from '@prisma/client';
import config from '@/config/config';

const DATABASE_URL = process.env.DATABASE_URL || config?.databaseUrl;

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: { db: { url: DATABASE_URL } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ── Club ──────────────────────────────────────────────────────────────────────
export async function getClubBySlug(slug: string) {
  const club = await prisma.club.findUnique({ where: { slug } });
  if (!club) throw new Error('Club not found');
  return club;
}

// ── Members ───────────────────────────────────────────────────────────────────
export async function getMembers(clubId: string) {
  return prisma.member.findMany({ where: { clubId }, orderBy: { name: 'asc' } });
}

export async function getFullMembers(clubId: string) {
  return prisma.member.findMany({
    where: { clubId },
    include: { children: true },
    orderBy: { name: 'asc' }
  });
}

export async function getMemberById(id: string) {
  return prisma.member.findUnique({ where: { id }, include: { children: true } });
}

type MemberInput = {
  name: string;
  email?: string | null;
  phone?: string | null;
  classification?: string | null;
  dateOfBirth?: string | Date | null;
  anniversary?: string | Date | null;
  address?: string | null;
  businessName?: string | null;
  businessTagline?: string | null;
  spouseName?: string | null;
  spouseDob?: string | Date | null;
  children?: { name: string; dateOfBirth?: string | null }[];
};

function memberFields(data: MemberInput) {
  return {
    name: data.name,
    email: data.email ?? null,
    phone: data.phone ?? null,
    classification: data.classification ?? null,
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
    anniversary: data.anniversary ? new Date(data.anniversary) : null,
    address: data.address ?? null,
    businessName: data.businessName ?? null,
    businessTagline: data.businessTagline ?? null,
    spouseName: data.spouseName ?? null,
    spouseDob: data.spouseDob ? new Date(data.spouseDob) : null,
  };
}

export async function createMember(clubId: string, data: MemberInput) {
  const { children } = data;
  return prisma.member.create({
    data: {
      ...memberFields(data),
      clubId,
      children: children?.length
        ? { create: children.map((c) => ({ name: c.name, dateOfBirth: c.dateOfBirth ? new Date(c.dateOfBirth) : null })) }
        : undefined
    },
    include: { children: true }
  });
}

export async function updateMember(id: string, data: MemberInput) {
  const { children } = data;
  await prisma.child.deleteMany({ where: { memberId: id } });
  return prisma.member.update({
    where: { id },
    data: {
      ...memberFields(data),
      children: children?.length
        ? { create: children.map((c) => ({ name: c.name, dateOfBirth: c.dateOfBirth ? new Date(c.dateOfBirth) : null })) }
        : undefined
    },
    include: { children: true }
  });
}

export async function deleteMember(id: string) {
  return prisma.member.delete({ where: { id } });
}

// ── News ──────────────────────────────────────────────────────────────────────
export async function getNews(clubId: string) {
  return prisma.news.findMany({
    where: { clubId },
    orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }]
  });
}

export async function createNews(clubId: string, data: { title: string; body: string; pinned?: boolean }) {
  return prisma.news.create({ data: { ...data, clubId } });
}

export async function updateNews(id: string, data: { title?: string; body?: string; pinned?: boolean }) {
  return prisma.news.update({ where: { id }, data });
}

export async function deleteNews(id: string) {
  return prisma.news.delete({ where: { id } });
}

// ── Projects ──────────────────────────────────────────────────────────────────
export async function getProjects(clubId: string) {
  return prisma.project.findMany({ where: { clubId }, orderBy: { startedAt: 'desc' } });
}

export async function createProject(
  clubId: string,
  data: { title: string; avenue: string; description?: string; status?: string }
) {
  return prisma.project.create({ data: { ...data, clubId } });
}

export async function updateProject(
  id: string,
  data: { title?: string; avenue?: string; description?: string; status?: string }
) {
  return prisma.project.update({ where: { id }, data });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

// ── Dues ──────────────────────────────────────────────────────────────────────
export async function getDues(clubId: string) {
  return prisma.due.findMany({
    where: { clubId },
    include: { member: { select: { name: true } } },
    orderBy: { dueDate: 'desc' }
  });
}

export async function getDuesSummary(clubId: string) {
  const unpaidCount = await prisma.due.count({ where: { clubId, paid: false } });
  return { unpaidCount };
}

export async function createDue(
  clubId: string,
  data: { memberId: string; amount: number | string; dueDate?: string; paid?: boolean }
) {
  return prisma.due.create({
    data: {
      clubId,
      memberId: data.memberId,
      amount: Number(data.amount),
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      paid: data.paid ?? false
    },
    include: { member: { select: { name: true } } }
  });
}

export async function updateDue(id: string, data: { paid?: boolean; amount?: number | string }) {
  return prisma.due.update({
    where: { id },
    data: {
      ...(data.paid !== undefined ? { paid: data.paid } : {}),
      ...(data.amount !== undefined ? { amount: Number(data.amount) } : {})
    },
    include: { member: { select: { name: true } } }
  });
}

export async function deleteDue(id: string) {
  return prisma.due.delete({ where: { id } });
}

// ── Sessions ──────────────────────────────────────────────────────────────────
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
