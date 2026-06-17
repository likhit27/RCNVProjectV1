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

export type MemberInput = {
  name: string; rotaryId?: string | null; email?: string | null; phone?: string | null;
  classification?: string | null; occupation?: string | null; principalActivity?: string | null;
  inductionDate?: string | Date | null; proposedBy?: string | null;
  dateOfBirth?: string | Date | null; anniversary?: string | Date | null;
  address?: string | null; businessName?: string | null; businessTagline?: string | null;
  businessAddress?: string | null; photoUrl?: string | null;
  spouseName?: string | null; spouseEmail?: string | null; spousePhone?: string | null;
  spouseDob?: string | Date | null;
  children?: { name: string; dateOfBirth?: string | null }[];
};

function memberFields(d: MemberInput) {
  return {
    name: d.name, rotaryId: d.rotaryId ?? null, email: d.email ?? null,
    phone: d.phone ?? null, classification: d.classification ?? null,
    occupation: d.occupation ?? null, principalActivity: d.principalActivity ?? null,
    inductionDate: d.inductionDate ? new Date(d.inductionDate) : null,
    proposedBy: d.proposedBy ?? null,
    dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth) : null,
    anniversary: d.anniversary ? new Date(d.anniversary) : null,
    address: d.address ?? null, businessName: d.businessName ?? null,
    businessTagline: d.businessTagline ?? null, businessAddress: d.businessAddress ?? null,
    photoUrl: d.photoUrl ?? null, spouseName: d.spouseName ?? null,
    spouseEmail: d.spouseEmail ?? null, spousePhone: d.spousePhone ?? null,
    spouseDob: d.spouseDob ? new Date(d.spouseDob) : null,
  };
}

function childRows(children?: { name: string; dateOfBirth?: string | null }[]) {
  return children?.filter(c => c.name).map(c => ({
    name: c.name, dateOfBirth: c.dateOfBirth ? new Date(c.dateOfBirth) : null
  }));
}

export async function createMember(clubId: string, data: MemberInput) {
  const rows = childRows(data.children);
  return prisma.member.create({
    data: { ...memberFields(data), clubId, children: rows?.length ? { create: rows } : undefined },
    include: { children: true }
  });
}

export async function upsertMember(clubId: string, data: MemberInput) {
  const rows = childRows(data.children);
  const fields = memberFields(data);
  // Try to find existing member by rotaryId or email within this club
  const existing = await prisma.member.findFirst({
    where: {
      clubId,
      OR: [
        ...(data.rotaryId ? [{ rotaryId: data.rotaryId }] : []),
        ...(data.email ? [{ email: data.email }] : []),
      ].filter(Boolean)
    }
  });
  if (existing) {
    await prisma.child.deleteMany({ where: { memberId: existing.id } });
    return prisma.member.update({
      where: { id: existing.id },
      data: { ...fields, children: rows?.length ? { create: rows } : undefined },
      include: { children: true }
    });
  }
  return prisma.member.create({
    data: { ...fields, clubId, children: rows?.length ? { create: rows } : undefined },
    include: { children: true }
  });
}

export async function updateMember(id: string, data: MemberInput) {
  const rows = childRows(data.children);
  await prisma.child.deleteMany({ where: { memberId: id } });
  return prisma.member.update({
    where: { id },
    data: { ...memberFields(data), children: rows?.length ? { create: rows } : undefined },
    include: { children: true }
  });
}

export async function deleteMember(id: string) {
  return prisma.member.delete({ where: { id } });
}

// ── News ──────────────────────────────────────────────────────────────────────
export async function getNews(clubId: string) {
  return prisma.news.findMany({ where: { clubId }, orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }] });
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
export async function createProject(clubId: string, data: { title: string; avenue: string; description?: string; status?: string }) {
  return prisma.project.create({ data: { ...data, clubId } });
}
export async function updateProject(id: string, data: { title?: string; avenue?: string; description?: string; status?: string }) {
  return prisma.project.update({ where: { id }, data });
}
export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

// ── Dues ──────────────────────────────────────────────────────────────────────
export async function getDues(clubId: string) {
  return prisma.due.findMany({
    where: { clubId },
    include: { member: { select: { id: true, name: true } } },
    orderBy: { dueDate: 'desc' }
  });
}
export async function getMemberDues(clubId: string, memberId: string) {
  return prisma.due.findMany({
    where: { clubId, memberId },
    orderBy: { dueDate: 'desc' }
  });
}
export async function getDuesSummary(clubId: string) {
  const unpaidCount = await prisma.due.count({ where: { clubId, paid: false } });
  return { unpaidCount };
}
export async function createDue(clubId: string, data: { memberId: string; amount: number | string; dueDate?: string; paid?: boolean }) {
  return prisma.due.create({
    data: { clubId, memberId: data.memberId, amount: Number(data.amount), dueDate: data.dueDate ? new Date(data.dueDate) : undefined, paid: data.paid ?? false },
    include: { member: { select: { id: true, name: true } } }
  });
}
export async function updateDue(id: string, data: { paid?: boolean; amount?: number | string }) {
  return prisma.due.update({
    where: { id },
    data: { ...(data.paid !== undefined ? { paid: data.paid } : {}), ...(data.amount !== undefined ? { amount: Number(data.amount) } : {}) },
    include: { member: { select: { id: true, name: true } } }
  });
}
export async function deleteDue(id: string) {
  return prisma.due.delete({ where: { id } });
}

// ── Club Users ────────────────────────────────────────────────────────────────
export async function getClubUsers(clubId: string) {
  return prisma.clubUser.findMany({
    where: { clubId },
    include: { member: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' }
  });
}
export async function getClubUserByEmail(clubId: string, email: string) {
  return prisma.clubUser.findUnique({
    where: { clubId_email: { clubId, email } },
    include: { member: { select: { id: true, name: true } } }
  });
}
export async function createClubUser(clubId: string, data: { email: string; password: string; role: string; memberId?: string | null }) {
  return prisma.clubUser.create({
    data: { clubId, ...data },
    include: { member: { select: { id: true, name: true } } }
  });
}
export async function updateClubUser(id: string, data: { email?: string; password?: string; role?: string; memberId?: string | null }) {
  return prisma.clubUser.update({
    where: { id },
    data,
    include: { member: { select: { id: true, name: true } } }
  });
}
export async function deleteClubUser(id: string) {
  return prisma.clubUser.delete({ where: { id } });
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
