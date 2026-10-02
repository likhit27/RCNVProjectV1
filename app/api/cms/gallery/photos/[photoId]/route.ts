import { NextResponse } from 'next/server';
import { requireCmsSession } from '@/lib/cms-auth';
import { deleteGalleryPhoto } from '@/lib/cms-db';

export async function DELETE(_: Request, { params }: { params: Promise<{ photoId: string }> }) {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try { const { photoId } = await params; await deleteGalleryPhoto(photoId); return NextResponse.json({ success: true }); }
  catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}
