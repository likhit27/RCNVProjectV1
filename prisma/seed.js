const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const club = await prisma.club.upsert({
    where: { slug: 'rotary-navi-mumbai' },
    update: {},
    create: {
      slug: 'rotary-navi-mumbai',
      name: 'Rotary Navi Mumbai'
    }
  });

  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.clubUser.upsert({
    where: { clubId_email: { clubId: club.id, email: 'admin@rotary.local' } },
    update: { password: passwordHash },
    create: {
      clubId: club.id,
      email: 'admin@rotary.local',
      password: passwordHash,
      role: 'admin'
    }
  });

  await prisma.member.create({
    data: {
      clubId: club.id,
      name: 'Rotarian One',
      email: 'member1@rotary.local',
      phone: '+919900112233',
      classification: 'Service',
      address: 'Mumbai, India'
    }
  });

  await prisma.member.create({
    data: {
      clubId: club.id,
      name: 'Rotarian Two',
      email: 'member2@rotary.local',
      phone: '+919900445566',
      classification: 'Community',
      address: 'Navi Mumbai, India'
    }
  });

  await prisma.project.create({
    data: {
      clubId: club.id,
      title: 'Clean Water Drive',
      avenue: 'Community Service',
      description: 'Provide safe drinking water for public schools.'
    }
  });

  await prisma.project.create({
    data: {
      clubId: club.id,
      title: 'Youth Leadership Workshop',
      avenue: 'Youth Service',
      description: 'Motivate local youth with leadership training.'
    }
  });

  await prisma.news.create({
    data: {
      clubId: club.id,
      title: 'Welcome to Rotary Navi Mumbai',
      body: 'This is the official club news board for announcements and updates.',
      pinned: true
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
