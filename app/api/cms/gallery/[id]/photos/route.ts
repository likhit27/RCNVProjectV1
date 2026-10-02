import { NextResponse } from 'next/server';
import { requireCmsSession } from '@/lib/cms-auth';
import { addPhotoToAlbum } from '@/lib/cms-db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const { url, caption } = await req.json();
    return NextResponse.json(await addPhotoToAlbum(id, url, caption));
  } catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}
