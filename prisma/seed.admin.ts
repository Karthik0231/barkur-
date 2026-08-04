import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  console.log("Seeding admin data...")

  // Seed users with different admin roles
  const adminRoles = [
    {
      email: "superadmin@kalikambatemple.org",
      name: "Super Admin",
      phone: "8888888888",
      role: "SUPER_ADMIN" as const,
      password: await bcrypt.hash("superadmin123", 10),
    },
    {
      email: "admin@kalikambatemple.org",
      name: "Admin",
      phone: "9999999999",
      role: "ADMIN" as const,
      password: await bcrypt.hash("admin123", 10),
    },
    {
      email: "templemanager@kalikambatemple.org",
      name: "Temple Manager",
      phone: "7777777777",
      role: "TEMPLE_MANAGER" as const,
      password: await bcrypt.hash("manager123", 10),
    },
    {
      email: "accountant@kalikambatemple.org",
      name: "Accountant",
      phone: "6666666666",
      role: "ACCOUNTANT" as const,
      password: await bcrypt.hash("accountant123", 10),
    },
    {
      email: "volunteer@kalikambatemple.org",
      name: "Volunteer Coordinator",
      phone: "5555555555",
      role: "VOLUNTEER" as const,
      password: await bcrypt.hash("volunteer123", 10),
    },
    {
      email: "reception@kalikambatemple.org",
      name: "Receptionist",
      phone: "4444444444",
      role: "RECEPTION" as const,
      password: await bcrypt.hash("reception123", 10),
    },
  ]

  for (const adminData of adminRoles) {
    await prisma.user.upsert({
      where: { email: adminData.email },
      update: {},
      create: {
        name: adminData.name,
        email: adminData.email,
        phone: adminData.phone,
        password: adminData.password,
        role: adminData.role,
        isActive: true,
      },
    })
    console.log(`Seeded ${adminData.role} user: ${adminData.email}`)
  }

  console.log("Admin data seeding completed!")
}

main()
  .catch((e) => {
    console.error("Error seeding admin data:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })