import { NextResponse } from 'next/server';
import { requireCmsSession } from '@/lib/cms-auth';
import { getGalleryAlbumWithPhotos, updateGalleryAlbum, deleteGalleryAlbum } from '@/lib/cms-db';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try { const { id } = await params; return NextResponse.json(await getGalleryAlbumWithPhotos(id)); }
  catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try { const { id } = await params; return NextResponse.json(await updateGalleryAlbum(id, await req.json())); }
  catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try { const { id } = await params; await deleteGalleryAlbum(id); return NextResponse.json({ success: true }); }
  catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}
