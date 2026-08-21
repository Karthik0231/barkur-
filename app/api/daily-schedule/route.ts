import { auth } from "@/lib/auth"
import { findManyDailySchedules, createDailySchedule } from "@/lib/models/dailySchedule"
import { dailyScheduleSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dayOfWeek = searchParams.get("dayOfWeek")
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])

    const filter: Record<string, unknown> = {}
    if (!isAdmin) filter.isActive = true
    if (dayOfWeek !== null) filter.dayOfWeek = parseInt(dayOfWeek ?? "0", 10)

    const schedules = await findManyDailySchedules(filter, {
      sort: [["dayOfWeek", 1], ["sortOrder", 1], ["startTime", 1]],
    })

    return successResponse({ schedules })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch daily schedule", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = dailyScheduleSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const schedule = await createDailySchedule({
      dayOfWeek: data.dayOfWeek,
      title: data.title,
      description: data.description ?? null,
      startTime: data.startTime,
      endTime: data.endTime,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    })

    await auditLog("CREATE", "DailySchedule", schedule.id, { title: schedule.title }, session)
    return successResponse(schedule, "Schedule created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create schedule", 500)
  }
}
