import { NextResponse } from 'next/server';
import { requireClubSession } from '@/lib/apiAuth';
import { getDues, createDue } from '@/lib/db';

export async function GET(_req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const auth = await requireClubSession(slug);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const dues = await getDues(auth.club.id);
  return NextResponse.json(dues);
}

export async function POST(req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const auth = await requireClubSession(slug);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  try {
    const due = await createDue(auth.club.id, body);
    return NextResponse.json(due, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ message: String(e) }, { status: 500 });
  }
}
