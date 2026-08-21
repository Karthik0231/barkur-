import { auth } from "@/lib/auth"
import { findDailyScheduleById, updateDailySchedule, deleteDailySchedule } from "@/lib/models/dailySchedule"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findDailyScheduleById(id)
    if (!existing) return errorResponse("Schedule not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    const allowed = ["dayOfWeek", "title", "description", "startTime", "endTime", "isActive", "sortOrder"]
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }

    const schedule = await updateDailySchedule(id, updateData)
    await auditLog("UPDATE", "DailySchedule", id, { title: schedule?.title }, session)
    return successResponse(schedule, "Schedule updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update schedule", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findDailyScheduleById(id)
    if (!existing) return errorResponse("Schedule not found", 404)

    await deleteDailySchedule(id)
    await auditLog("DELETE", "DailySchedule", id, { title: existing.title }, session)
    return successResponse(null, "Schedule deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete schedule", 500)
  }
}
