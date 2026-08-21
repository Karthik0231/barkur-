import { findManyFestivals } from "@/lib/models"
import PanchangaClient from "./PanchangaClient"

export const dynamic = "force-dynamic"

export default async function PanchangaPage() {
  const festivals = await findManyFestivals({ isActive: true }, {
    sort: [["isFeatured", -1], ["startDate", 1]],
  })

  return <PanchangaClient festivals={festivals} />
}
