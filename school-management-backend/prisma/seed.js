// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  const existing = await prisma.user.findUnique({ where: { username: 'admin' }});
  if (!existing) {
    const user = await prisma.user.create({
      data: {
        username: 'admin',
        passwordHash: hash,
        role: 'admin'
      }
    });
    console.log('Created admin user -> username: admin password:', password);
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
