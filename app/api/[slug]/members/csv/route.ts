import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireClubSession } from '@/lib/apiAuth';
import { upsertMember, prisma } from '@/lib/db';

// Parse a date string leniently (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, Excel serial)
function parseDate(val: unknown): Date | null {
  if (!val) return null;
  if (typeof val === 'number') {
    const d = new Date((val - 25569) * 86400 * 1000);
    return isNaN(d.getTime()) ? null : d;
  }
  const s = String(val).trim();
  if (!s) return null;
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) return new Date(`${dmy[3]}-${dmy[2].padStart(2,'0')}-${dmy[1].padStart(2,'0')}`);
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// Normalise a row keyed by header (case+space insensitive)
function col(row: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const found = Object.keys(row).find(r => r.trim().toLowerCase() === k.toLowerCase());
    if (found && row[found] !== undefined && String(row[found]).trim()) return String(row[found]).trim();
  }
  return '';
}

async function processRows(rows: Record<string, unknown>[], clubId: string) {
  let imported = 0;
  let loginsCreated = 0;
  let loginsSkipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const name = col(row, 'Name Surname', 'Name', 'Full Name');
    if (!name) { errors.push(`Skipped row — no name: ${JSON.stringify(row)}`); continue; }

    try {
      const email = col(row, 'MEMBER E -Mail', 'Member E-Mail', 'Email', 'MEMBER E-Mail') || null;
      const phone = col(row, 'Mobile', 'Phone') || null;

      const children: { name: string }[] = [];
      const c1 = col(row, 'Child 1', 'Child1');
      const c2 = col(row, 'Child 2', 'Child2');
      const c3 = col(row, 'Child 3', 'Child3');
      if (c1) children.push({ name: c1 });
      if (c2) children.push({ name: c2 });
      if (c3) children.push({ name: c3 });

      const member = await upsertMember(clubId, {
        name,
        rotaryId: col(row, 'Rotary ID', 'RotaryID') || null,
        email,
        phone,
        classification: col(row, 'Classification') || null,
        occupation: col(row, 'SOccupation', 'Occupation') || null,
        principalActivity: col(row, 'Principal Activity', 'PrincipalActivity') || null,
        inductionDate: parseDate(row[Object.keys(row).find(k => k.toLowerCase().includes('induction')) || ''] ?? null),
        proposedBy: col(row, 'Proposed By', 'ProposedBy') || null,
        dateOfBirth: parseDate(row[Object.keys(row).find(k => k.toLowerCase().includes('birth') && k.toLowerCase().includes('member')) || ''] ?? null),
        anniversary: parseDate(row[Object.keys(row).find(k => k.toLowerCase().includes('anniversary')) || ''] ?? null),
        address: col(row, 'Home Address', 'Address') || null,
        businessName: col(row, 'Principal Activity', 'PrincipalActivity', 'Business Name') || null,
        businessAddress: col(row, 'Business Address', 'BusinessAddress') || null,
        spouseName: col(row, 'SpouseName', 'Spouse Name') || null,
        spouseEmail: col(row, 'SPOUSE E-Mail', 'Spouse Email') || null,
        spousePhone: col(row, 'Spouse Mobile', 'Spouse Phone') || null,
        spouseDob: parseDate(row[Object.keys(row).find(k => k.toLowerCase().includes('spouse') && k.toLowerCase().includes('dob')) || ''] ?? null),
        children,
      });
      imported++;

      // Auto-create login account if member has an email and mobile
      if (email && phone) {
        const existing = await prisma.clubUser.findUnique({
          where: { clubId_email: { clubId, email } }
        });
        if (!existing) {
          // Default password = mobile number
          const passwordHash = await bcrypt.hash(phone, 10);
          await prisma.clubUser.create({
            data: { clubId, email, password: passwordHash, role: 'member', memberId: member.id }
          });
          loginsCreated++;
        } else {
          // If already exists, update memberId link
          await prisma.clubUser.update({
            where: { clubId_email: { clubId, email } },
            data: { memberId: member.id }
          });
          loginsSkipped++;
        }
      }
    } catch (e: unknown) {
      errors.push(`Failed "${name}": ${String(e)}`);
    }
  }
  return { imported, loginsCreated, loginsSkipped, errors };
}

export async function POST(req: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const auth = await requireClubSession(slug);
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });

  const ext = file.name.split('.').pop()?.toLowerCase();
  let rows: Record<string, unknown>[];

  if (ext === 'xlsx' || ext === 'xls') {
    const buf = await file.arrayBuffer();
    const XLSX = await import('xlsx');
    const wb = XLSX.read(buf, { type: 'buffer', cellDates: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
  } else {
    const { parse } = await import('csv-parse/sync');
    const text = await file.text();
    try {
      rows = parse(text, { columns: true, skip_empty_lines: true, trim: true });
    } catch {
      return NextResponse.json({ message: 'Invalid CSV format' }, { status: 400 });
    }
  }

  const result = await processRows(rows, auth.club.id);
  return NextResponse.json(result);
}
