import { NextResponse } from 'next/server';
import { requireCmsSession } from '@/lib/cms-auth';
import { deleteCounter } from '@/lib/cms-db';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await requireCmsSession();
  if (!s) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try { const { id } = await params; await deleteCounter(id); return NextResponse.json({ success: true }); }
  catch { return NextResponse.json({ message: 'Server error' }, { status: 500 }); }
}
