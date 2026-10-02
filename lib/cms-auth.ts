import { cookies } from 'next/headers';
import { getCmsSessionByToken } from '@/lib/cms-db';

export async function getCmsSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('cms_session')?.value;
  if (!token) return null;
  const session = await getCmsSessionByToken(token);
  if (!session || new Date() > session.expiresAt) return null;
  return { token, admin: session.admin };
}

export async function requireCmsSession() {
  const session = await getCmsSession();
  return session;
}
