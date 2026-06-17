import { cookies } from 'next/headers';
import { getSessionByToken, getClubBySlug } from './db';

export async function requireClubSession(slug: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return null;
  const session = await getSessionByToken(token);
  if (!session || new Date() > session.expiresAt) return null;
  try {
    const club = await getClubBySlug(slug);
    if (session.clubId !== club.id) return null;
    return { session, club };
  } catch {
    return null;
  }
}
