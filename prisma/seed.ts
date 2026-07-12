import { prisma } from "../lib/prisma"
import bcrypt from 'bcryptjs';

async function main() {
  // Create an admin user
  const password = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kalikambatemple.org' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@kalikambatemple.org',
      phone: '9999999999',
      password,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Admin user created:', admin);

  // Create a super admin user
  const superAdminPassword = await bcrypt.hash('superadmin123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@kalikambatemple.org' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@kalikambatemple.org',
      phone: '8888888888',
      password: superAdminPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('Super admin user created:', superAdmin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
