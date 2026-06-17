import { NextResponse } from 'next/server';
import { getClubBySlug } from '@/lib/db';
import { verifyUser, startSession } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, slug } = body;

  if (!email || !password || !slug) {
    return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
  }

  try {
    const club = await getClubBySlug(slug);
    const user = await verifyUser(club.id, email, password);

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const session = await startSession(club.id, user.email);
    const response = NextResponse.json({ success: true });
    response.cookies.set('session_token', session.token, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'lax',
      expires: session.expiresAt
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Authentication failed' }, { status: 500 });
  }
}
