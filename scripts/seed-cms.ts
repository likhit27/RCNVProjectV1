import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default CMS admin
  const hash = await bcrypt.hash('cms123', 12);
  const admin = await prisma.websiteAdmin.upsert({
    where: { email: 'cms@rcnv.in' },
    update: {},
    create: { email: 'cms@rcnv.in', password: hash, name: 'CMS Admin' },
  });
  console.log('✓ CMS admin:', admin.email);

  // Default counters
  const counters = [
    { key: 'members', label: 'Members', value: '100+', order: 1 },
    { key: 'projects', label: 'Projects', value: '25+', order: 2 },
    { key: 'beneficiaries', label: 'Beneficiaries', value: '1,000+', order: 3 },
    { key: 'manhours', label: 'Man Hours', value: '5,000+', order: 4 },
  ];
  for (const c of counters) {
    await prisma.siteCounter.upsert({
      where: { key: c.key },
      update: {},
      create: c,
    });
  }
  console.log('✓ Site counters seeded');

  // Default page content
  const pages = [
    { key: 'home.hero.title', value: 'Be a Gift to the World' },
    { key: 'home.hero.subtitle', value: 'We are neighbours, professionals and friends who take action on health, the environment and opportunity in Nagpur.' },
    { key: 'about.intro', value: 'Rotary Club of Nagpur Vision is a community of professionals committed to making a positive, lasting change in communities in India and abroad.' },
    { key: 'contact.email', value: 'info@rcnv.in' },
    { key: 'contact.phone', value: '' },
    { key: 'about.meeting.day', value: 'Every Tuesday' },
    { key: 'about.meeting.venue', value: 'Contact the club for venue details' },
  ];
  for (const p of pages) {
    await prisma.pageContent.upsert({
      where: { key: p.key },
      update: {},
      create: p,
    });
  }
  console.log('✓ Page content seeded');

  console.log('\n✅ Seed complete.');
  console.log('   CMS login: cms@rcnv.in / cms123');
  console.log('   Change the password after first login via the CMS dashboard.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
