import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { findUserByEmail, createUser } from "@/lib/models/user"

async function main() {
  console.log("Seeding admin data...")

  await connectToDatabase()

  const adminRoles = [
    { email: "superadmin@kalikambatemple.com", name: "Super Admin", phone: "8888888888", role: "SUPER_ADMIN", password: await bcrypt.hash("superadmin123", 10) },
    { email: "templemanager@kalikambatemple.org", name: "Temple Manager", phone: "7777777777", role: "TEMPLE_MANAGER", password: await bcrypt.hash("manager123", 10) },
    { email: "reception@kalikambatemple.org", name: "Receptionist", phone: "4444444444", role: "RECEPTION", password: await bcrypt.hash("reception123", 10) },
  ]

  for (const adminData of adminRoles) {
    const exists = await findUserByEmail(adminData.email)
    if (!exists) {
      await createUser({
        name: adminData.name,
        email: adminData.email,
        phone: adminData.phone,
        password: adminData.password,
        role: adminData.role,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log(`Seeded ${adminData.role} user: ${adminData.email}`)
    } else {
      console.log(`Exists ${adminData.role} user: ${adminData.email}`)
    }
  }

  console.log("Admin data seeding completed!")
}

main()
  .catch((e) => {
    console.error("Error seeding admin data:", e)
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })

export {}
