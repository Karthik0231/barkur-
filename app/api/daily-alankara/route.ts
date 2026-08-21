import { auth } from "@/lib/auth"
import { findTodayAlankara, findManyDailyAlankaras, countDailyAlankaras, createDailyAlankara, updateDailyAlankara, softDeleteDailyAlankara, cleanupPreviousDays } from "@/lib/models/dailyAlankara"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    // Public: get today's alankara
    if (action === "today") {
      const today = await findTodayAlankara()
      return successResponse({ alankara: today })
    }

    // Admin: list all
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { page, limit, skip, sortBy, sortOrder } = paginationHelper(searchParams)

    const [alankaras, total] = await Promise.all([
      findManyDailyAlankaras({}, { skip, limit, sortBy, sortOrder }),
      countDailyAlankaras({}),
    ])

    return successResponse({ alankaras, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch daily alankara", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { date, videoUrl, specialNote, partyNames, isActive } = body

    if (!date) return errorResponse("Date is required", 400)

    // Cleanup previous day entries before creating new one
    await cleanupPreviousDays()

    const alankara = await createDailyAlankara({
      date: new Date(date),
      videoUrl: videoUrl || null,
      specialNote: specialNote || null,
      partyNames: Array.isArray(partyNames) ? partyNames : [],
      isActive: isActive !== false,
      createdBy: user.id,
    })

    await auditLog("CREATE", "DailyAlankara", alankara.id, { date }, session)
    return successResponse(alankara, "Daily alankara created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create daily alankara", 500)
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { id, date, videoUrl, specialNote, partyNames, isActive } = body
    if (!id) return errorResponse("ID is required", 400)

    const updateData: Record<string, unknown> = {}
    if (date !== undefined) updateData.date = new Date(date)
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl
    if (specialNote !== undefined) updateData.specialNote = specialNote
    if (partyNames !== undefined) updateData.partyNames = Array.isArray(partyNames) ? partyNames : []
    if (isActive !== undefined) updateData.isActive = isActive

    const updated = await updateDailyAlankara(id, updateData)
    if (!updated) return errorResponse("Not found", 404)

    await auditLog("UPDATE", "DailyAlankara", id, updateData, session)
    return successResponse(updated, "Daily alankara updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update daily alankara", 500)
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { id } = body
    if (!id) return errorResponse("ID is required", 400)

    await softDeleteDailyAlankara(id)
    await auditLog("DELETE", "DailyAlankara", id, {}, session)
    return successResponse(null, "Daily alankara deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete daily alankara", 500)
  }
}
