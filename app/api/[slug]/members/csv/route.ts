import { NextResponse } from 'next/server';
import { requireClubSession } from '@/lib/apiAuth';
import { createMember } from '@/lib/db';
import { parse } from 'csv-parse/sync';

export async function POST(req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const auth = await requireClubSession(slug);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });

  const text = await file.text();
  let records: Record<string, string>[];
  try {
    records = parse(text, { columns: true, skip_empty_lines: true, trim: true });
  } catch {
    return NextResponse.json({ message: 'Invalid CSV format' }, { status: 400 });
  }

  let imported = 0;
  const errors: string[] = [];

  for (const row of records) {
    if (!row.name) { errors.push(`Row missing name: ${JSON.stringify(row)}`); continue; }
    try {
      const children: { name: string; dateOfBirth?: string }[] = [];
      if (row.child1) children.push({ name: row.child1, dateOfBirth: row.child1dob || undefined });
      if (row.child2) children.push({ name: row.child2, dateOfBirth: row.child2dob || undefined });

      await createMember(auth.club.id, {
        name: row.name,
        email: row.email || undefined,
        phone: row.phone || undefined,
        classification: row.classification || undefined,
        dateOfBirth: row.dateofbirth ? new Date(row.dateofbirth) : undefined,
        anniversary: row.anniversary ? new Date(row.anniversary) : undefined,
        address: row.address || undefined,
        businessName: row.businessname || undefined,
        businessTagline: row.businesstagline || undefined,
        spouseName: row.spousename || undefined,
        spouseDob: row.spousedob ? new Date(row.spousedob) : undefined,
        children
      });
      imported++;
    } catch (e: unknown) {
      errors.push(`Failed for ${row.name}: ${String(e)}`);
    }
  }

  return NextResponse.json({ imported, errors });
}
