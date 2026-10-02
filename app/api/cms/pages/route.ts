import { NextResponse } from 'next/server';
import { requireCmsSession } from '@/lib/cms-auth';
import { getAllPageContent, upsertPageContent } from '@/lib/cms-db';

export async function GET() {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try { return NextResponse.json(await getAllPageContent()); }
  catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}

export async function POST(req: Request) {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const { key, value } = await req.json();
    return NextResponse.json(await upsertPageContent(key, value));
  } catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}
