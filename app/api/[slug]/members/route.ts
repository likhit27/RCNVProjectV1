import { NextResponse } from 'next/server';
import { requireClubSession } from '@/lib/apiAuth';
import { getFullMembers, createMember } from '@/lib/db';

export async function GET(_req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const auth = await requireClubSession(slug);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const members = await getFullMembers(auth.club.id);
  return NextResponse.json(members);
}

export async function POST(req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const auth = await requireClubSession(slug);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  try {
    const member = await createMember(auth.club.id, body);
    return NextResponse.json(member, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ message: String(e) }, { status: 500 });
  }
}
