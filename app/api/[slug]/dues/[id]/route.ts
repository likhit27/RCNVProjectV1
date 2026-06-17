import { NextResponse } from 'next/server';
import { requireClubSession } from '@/lib/apiAuth';
import { updateDue, deleteDue } from '@/lib/db';

export async function PUT(req: Request, context: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await context.params;
  const auth = await requireClubSession(slug);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  try {
    const due = await updateDue(id, body);
    return NextResponse.json(due);
  } catch (e: unknown) {
    return NextResponse.json({ message: String(e) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await context.params;
  const auth = await requireClubSession(slug);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await deleteDue(id);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ message: String(e) }, { status: 500 });
  }
}
