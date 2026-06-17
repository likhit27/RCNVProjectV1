import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getClubBySlug, getClubUserByEmail, createSession } from '@/lib/db';
import { generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, slug } = body;
  if (!email || !password || !slug)
    return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });

  try {
    const club = await getClubBySlug(slug);
    const user = await getClubUserByEmail(club.id, email);
    if (!user) return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    await createSession(club.id, email, token, expiresAt);

    const role = user.role || 'member';
    const response = NextResponse.json({ success: true, role });
    response.cookies.set('session_token', token, {
      httpOnly: true, path: '/', secure: true, sameSite: 'lax', expires: expiresAt
    });
    return response;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[login] error:', msg);
    return NextResponse.json({ message: msg.includes('Club not found') ? 'Club not found' : 'Server error' }, { status: 500 });
  }
}
