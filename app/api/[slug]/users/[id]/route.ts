import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireClubSession } from '@/lib/apiAuth';
import { updateClubUser, deleteClubUser } from '@/lib/db';

export async function PUT(req: Request, context: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await context.params;
  const auth = await requireClubSession(slug);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  try {
    const update: Parameters<typeof updateClubUser>[1] = {};
    if (body.role) update.role = body.role;
    if (body.memberId !== undefined) update.memberId = body.memberId || null;
    if (body.email) update.email = body.email;
    if (body.password) update.password = await bcrypt.hash(body.password, 10);
    const user = await updateClubUser(id, update);
    return NextResponse.json(user);
  } catch (e: unknown) {
    return NextResponse.json({ message: String(e) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await context.params;
  const auth = await requireClubSession(slug);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await deleteClubUser(id);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ message: String(e) }, { status: 500 });
  }
}
