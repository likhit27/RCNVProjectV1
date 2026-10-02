import { NextResponse } from 'next/server';
import { loginCmsAdmin } from '@/lib/cms-db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });

    const result = await loginCmsAdmin(email, password);
    if (!result) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

    const response = NextResponse.json({ success: true, admin: result.admin });
    response.cookies.set('cms_session', result.token, {
      httpOnly: true, path: '/', secure: true, sameSite: 'lax', expires: result.expiresAt,
    });
    return response;
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
