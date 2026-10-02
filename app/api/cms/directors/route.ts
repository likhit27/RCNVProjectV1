import { NextResponse } from 'next/server';
import { requireCmsSession } from '@/lib/cms-auth';
import { getWebDirectors, createWebDirector } from '@/lib/cms-db';

export async function GET() {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try { return NextResponse.json(await getWebDirectors()); }
  catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}

export async function POST(req: Request) {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try { return NextResponse.json(await createWebDirector(await req.json())); }
  catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}
