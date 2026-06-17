import bcrypt from 'bcryptjs';
import { createSession, getClubUserByEmail } from '@/lib/db';

export async function verifyUser(clubId: string, email: string, password: string) {
  const user = await getClubUserByEmail(clubId, email);
  if (!user) {
    return null;
  }

  const valid = await bcrypt.compare(password, user.password);
  return valid ? user : null;
}

export function generateToken() {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function startSession(clubId: string, email: string) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await createSession(clubId, email, token, expiresAt);
  return { token, expiresAt };
}
