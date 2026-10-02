import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clearCmsSession } from '@/lib/cms-db';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('cms_session')?.value;
  if (token) await clearCmsSession(token).catch(() => {});
  const res = NextResponse.json({ success: true });
  res.cookies.set('cms_session', '', { maxAge: 0, path: '/' });
  return res;
}
