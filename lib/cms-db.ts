import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

// ── CMS Auth ──────────────────────────────────────────────────────────────────

export async function getCmsAdminByEmail(email: string) {
  return prisma.websiteAdmin.findUnique({ where: { email } });
}

export async function getCmsSessionByToken(token: string) {
  return prisma.cmsSession.findUnique({
    where: { token },
    include: { admin: { select: { id: true, email: true, name: true } } },
  });
}

export async function createCmsSession(adminId: string, token: string, expiresAt: Date) {
  return prisma.cmsSession.create({ data: { adminId, token, expiresAt } });
}

export async function clearCmsSession(token: string) {
  return prisma.cmsSession.deleteMany({ where: { token } });
}

// ── Banners ───────────────────────────────────────────────────────────────────

export async function getBanners() {
  return prisma.heroBanner.findMany({ orderBy: { order: 'asc' } });
}

export async function getActiveBanners() {
  return prisma.heroBanner.findMany({ where: { active: true }, orderBy: { order: 'asc' } });
}

export async function createBanner(data: { title: string; subtitle?: string; imageUrl: string; ctaText?: string; ctaUrl?: string; order?: number }) {
  return prisma.heroBanner.create({ data });
}

export async function updateBanner(id: string, data: Partial<{ title: string; subtitle: string; imageUrl: string; ctaText: string; ctaUrl: string; order: number; active: boolean }>) {
  return prisma.heroBanner.update({ where: { id }, data });
}

export async function deleteBanner(id: string) {
  return prisma.heroBanner.delete({ where: { id } });
}

// ── Web Projects ──────────────────────────────────────────────────────────────

export async function getWebProjects(publishedOnly = false) {
  return prisma.webProject.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getWebProjectById(id: string) {
  return prisma.webProject.findUnique({ where: { id } });
}

export async function createWebProject(data: { title: string; avenue: string; description: string; imageUrl?: string; date: string; year?: string; impact?: object; newsUrl?: string; order?: number }) {
  return prisma.webProject.create({ data });
}

export async function updateWebProject(id: string, data: Partial<{ title: string; avenue: string; description: string; imageUrl: string | null; date: string; year: string; impact: object; newsUrl: string | null; published: boolean; order: number }>) {
  return prisma.webProject.update({ where: { id }, data });
}

export async function deleteWebProject(id: string) {
  return prisma.webProject.delete({ where: { id } });
}

// ── Web Events ────────────────────────────────────────────────────────────────

export async function getWebEvents(publishedOnly = false) {
  return prisma.webEvent.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { date: 'asc' },
  });
}

export async function getUpcomingWebEvents() {
  return prisma.webEvent.findMany({
    where: { published: true, date: { gte: new Date() } },
    orderBy: { date: 'asc' },
    take: 6,
  });
}

export async function createWebEvent(data: { title: string; description?: string; date: Date | string; venue?: string; imageUrl?: string }) {
  return prisma.webEvent.create({ data: { ...data, date: new Date(data.date) } });
}

export async function updateWebEvent(id: string, data: Partial<{ title: string; description: string | null; date: Date | string; venue: string | null; imageUrl: string | null; published: boolean }>) {
  return prisma.webEvent.update({ where: { id }, data: { ...data, date: data.date ? new Date(data.date) : undefined } });
}

export async function deleteWebEvent(id: string) {
  return prisma.webEvent.delete({ where: { id } });
}

// ── Directors ─────────────────────────────────────────────────────────────────

export async function getWebDirectors(year?: string) {
  return prisma.webDirector.findMany({
    where: year ? { year } : undefined,
    orderBy: { order: 'asc' },
  });
}

export async function createWebDirector(data: { name: string; role: string; imageUrl?: string; year?: string; order?: number }) {
  return prisma.webDirector.create({ data });
}

export async function updateWebDirector(id: string, data: Partial<{ name: string; role: string; imageUrl: string | null; year: string; order: number }>) {
  return prisma.webDirector.update({ where: { id }, data });
}

export async function deleteWebDirector(id: string) {
  return prisma.webDirector.delete({ where: { id } });
}

// ── Past Presidents ───────────────────────────────────────────────────────────

export async function getPastPresidents() {
  return prisma.pastPresident.findMany({ orderBy: [{ order: 'asc' }, { year: 'desc' }] });
}

export async function createPastPresident(data: { name: string; year: string; imageUrl?: string; order?: number }) {
  return prisma.pastPresident.create({ data });
}

export async function updatePastPresident(id: string, data: Partial<{ name: string; year: string; imageUrl: string | null; order: number }>) {
  return prisma.pastPresident.update({ where: { id }, data });
}

export async function deletePastPresident(id: string) {
  return prisma.pastPresident.delete({ where: { id } });
}

// ── Gallery ───────────────────────────────────────────────────────────────────

export async function getGalleryAlbums(publishedOnly = false) {
  return prisma.galleryAlbum.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: { _count: { select: { photos: true } } },
  });
}

export async function getGalleryAlbumWithPhotos(id: string) {
  return prisma.galleryAlbum.findUnique({ where: { id }, include: { photos: { orderBy: { order: 'asc' } } } });
}

export async function createGalleryAlbum(data: { title: string; coverImage?: string; date?: string }) {
  return prisma.galleryAlbum.create({ data });
}

export async function updateGalleryAlbum(id: string, data: Partial<{ title: string; coverImage: string | null; date: string | null; published: boolean; order: number }>) {
  return prisma.galleryAlbum.update({ where: { id }, data });
}

export async function deleteGalleryAlbum(id: string) {
  return prisma.galleryAlbum.delete({ where: { id } });
}

export async function addPhotoToAlbum(albumId: string, url: string, caption?: string) {
  const count = await prisma.galleryPhoto.count({ where: { albumId } });
  return prisma.galleryPhoto.create({ data: { albumId, url, caption, order: count } });
}

export async function deleteGalleryPhoto(id: string) {
  return prisma.galleryPhoto.delete({ where: { id } });
}

// ── Newsletters ───────────────────────────────────────────────────────────────

export async function getNewsletters(publishedOnly = false) {
  return prisma.webNewsletter.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export async function createNewsletter(data: { title: string; issue?: string; year: string; pdfUrl: string }) {
  return prisma.webNewsletter.create({ data });
}

export async function updateNewsletter(id: string, data: Partial<{ title: string; issue: string | null; year: string; pdfUrl: string; published: boolean }>) {
  return prisma.webNewsletter.update({ where: { id }, data });
}

export async function deleteNewsletter(id: string) {
  return prisma.webNewsletter.delete({ where: { id } });
}

// ── Page Content ──────────────────────────────────────────────────────────────

export async function getPageContent(key: string) {
  const row = await prisma.pageContent.findUnique({ where: { key } });
  return row?.value ?? null;
}

export async function getAllPageContent() {
  return prisma.pageContent.findMany({ orderBy: { key: 'asc' } });
}

export async function upsertPageContent(key: string, value: string) {
  return prisma.pageContent.upsert({ where: { key }, update: { value }, create: { key, value } });
}

// ── Counters ──────────────────────────────────────────────────────────────────

export async function getSiteCounters() {
  return prisma.siteCounter.findMany({ orderBy: { order: 'asc' } });
}

export async function upsertCounter(key: string, label: string, value: string, order?: number) {
  return prisma.siteCounter.upsert({
    where: { key },
    update: { label, value, ...(order !== undefined ? { order } : {}) },
    create: { key, label, value, order: order ?? 0 },
  });
}

export async function deleteCounter(id: string) {
  return prisma.siteCounter.delete({ where: { id } });
}

// ── Seed helper ───────────────────────────────────────────────────────────────

export async function ensureCmsAdmin(email: string, password: string, name: string) {
  const existing = await prisma.websiteAdmin.findUnique({ where: { email } });
  if (existing) return existing;
  const hashed = await bcrypt.hash(password, 10);
  return prisma.websiteAdmin.create({ data: { email, password: hashed, name } });
}

export async function loginCmsAdmin(email: string, password: string) {
  const admin = await getCmsAdminByEmail(email);
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return null;
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await createCmsSession(admin.id, token, expiresAt);
  return { admin: { id: admin.id, email: admin.email, name: admin.name }, token, expiresAt };
}
