import { prisma } from "@/lib/prisma"
import PanchangaClient from "./PanchangaClient"

export default async function PanchangaPage() {
  const festivals = await prisma.festival.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: [{ isFeatured: "desc" }, { startDate: "asc" }],
  })

  return <PanchangaClient festivals={festivals} />
}
