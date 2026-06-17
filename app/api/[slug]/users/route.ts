import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireClubSession } from '@/lib/apiAuth';
import { getClubUsers, createClubUser } from '@/lib/db';

export async function GET(_req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const auth = await requireClubSession(slug);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const users = await getClubUsers(auth.club.id);
  return NextResponse.json(users);
}

export async function POST(req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const auth = await requireClubSession(slug);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.email || !body.password) return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
  try {
    const hash = await bcrypt.hash(body.password, 10);
    const user = await createClubUser(auth.club.id, {
      email: body.email, password: hash,
      role: body.role || 'member', memberId: body.memberId || null
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ message: String(e) }, { status: 500 });
  }
}
