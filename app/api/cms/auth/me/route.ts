import { NextResponse } from 'next/server';
import { requireCmsSession } from '@/lib/cms-auth';

export async function GET() {
  const session = await requireCmsSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ admin: session.admin });
}
