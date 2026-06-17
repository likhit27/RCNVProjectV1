const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const clubs = await prisma.club.findMany();
  if (!clubs.length) { console.log('No clubs found.'); return; }

  for (const club of clubs) {
    console.log(`\nProcessing club: ${club.name} (${club.slug})`);

    const members = await prisma.member.findMany({
      where: { clubId: club.id }
    });

    console.log(`Found ${members.length} members.`);

    let created = 0, updated = 0, skipped = 0;

    for (const member of members) {
      if (!member.email || !member.phone) {
        console.log(`  ⚠ Skipped "${member.name}" — missing email or mobile`);
        skipped++;
        continue;
      }

      const password = member.phone.trim();
      const passwordHash = await bcrypt.hash(password, 10);

      const existing = await prisma.clubUser.findUnique({
        where: { clubId_email: { clubId: club.id, email: member.email } }
      });

      if (existing) {
        // Update password to mobile and ensure memberId is linked
        await prisma.clubUser.update({
          where: { id: existing.id },
          data: { password: passwordHash, memberId: member.id, role: existing.role || 'member' }
        });
        console.log(`  ↻ Updated  "${member.name}" (${member.email}) → password = ${password}`);
        updated++;
      } else {
        await prisma.clubUser.create({
          data: {
            clubId: club.id,
            email: member.email,
            password: passwordHash,
            role: 'member',
            memberId: member.id
          }
        });
        console.log(`  ✓ Created  "${member.name}" (${member.email}) → password = ${password}`);
        created++;
      }
    }

    console.log(`\nDone for ${club.name}:`);
    console.log(`  ✓ Created : ${created}`);
    console.log(`  ↻ Updated : ${updated}`);
    console.log(`  ⚠ Skipped : ${skipped} (no email or mobile)`);
  }
}

main()
  .catch(e => { console.error('Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
