import { NextResponse } from 'next/server';
import { requireCmsSession } from '@/lib/cms-auth';
import { getBanners, createBanner } from '@/lib/cms-db';

export async function GET() {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try { return NextResponse.json(await getBanners()); }
  catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}

export async function POST(req: Request) {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try { return NextResponse.json(await createBanner(await req.json())); }
  catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}
