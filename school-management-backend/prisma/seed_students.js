// prisma/seed_students.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sample = [
    {
      admnNo: 'A001',
      name: 'Aarav Kumar',
      parentName: 'Rajesh Kumar',
      class: '8',
      section: 'A',
      rollNo: '1',
      category: 'General',
      address: 'Delhi, India',
      dob: new Date('2012-05-01'),
    },
    {
      admnNo: 'A002',
      name: 'Ananya Sharma',
      parentName: 'Sunita Sharma',
      class: '8',
      section: 'B',
      rollNo: '2',
      category: 'General',
      address: 'Noida, India',
      dob: new Date('2012-11-10'),
    },
  ];

  for (const s of sample) {
    try {
      await prisma.student.create({ data: s });
      console.log('Inserted', s.name);
    } catch (err) {
      console.log('Skipped', s.name, err.message);
    }
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
