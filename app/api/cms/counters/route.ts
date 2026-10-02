import { NextResponse } from 'next/server';
import { requireCmsSession } from '@/lib/cms-auth';
import { getSiteCounters, upsertCounter } from '@/lib/cms-db';

export async function GET() {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try { return NextResponse.json(await getSiteCounters()); }
  catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}

export async function POST(req: Request) {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const { key, label, value, order } = await req.json();
    return NextResponse.json(await upsertCounter(key, label, value, order));
  } catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}
