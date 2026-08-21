"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@/lib/zod-resolver"
import { sevaSchema, type SevaInput } from "@/lib/validations"
import {
  Save,
  ArrowLeft,
  Trash2,
  Plus,
  X,
  Calendar,
  Power,
} from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RichEditor } from "@/components/admin/rich-editor"
import { ImageUpload, type ImageItem } from "@/components/admin/image-upload"
import { PageSkeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface AvailabilityDate {
  date: string
  isAvailable: boolean
  maxBookings?: number
}

export default function EditSevaPage() {
  const router = useRouter()
  const params = useParams()
  const [images, setImages] = useState<ImageItem[]>([])
  const [availabilityDates, setAvailabilityDates] = useState<AvailabilityDate[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [togglingStatus, setTogglingStatus] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SevaInput>({
    resolver: zodResolver(sevaSchema),
  })

  const sevaId = params.id as string
  const isActive = watch("isActive")

  useEffect(() => {
    if (!sevaId) return
    fetch(`/api/sevas/${sevaId}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found")
        return r.json()
      })
      .then((d) => {
        const seva = d.data || d
        if (!seva) throw new Error("not found")

        const rulesData = seva.rules
          ? typeof seva.rules === "string"
            ? JSON.parse(seva.rules)
            : seva.rules
          : {}
        const bookingRulesText = rulesData.bookingRules || ""

        reset({
          name: seva.name,
          slug: seva.slug,
          shortDescription: seva.shortDescription || "",
          description: seva.description,
          price: seva.price,
          originalPrice: seva.originalPrice ?? undefined,
          duration: seva.duration ?? undefined,
          maxDevotees: seva.maxDevotees ?? undefined,
          minDevotees: seva.minDevotees ?? undefined,
          bookingNotice: seva.bookingNotice ?? undefined,
          requiresApproval: seva.requiresApproval ?? false,
          isActive: seva.isActive ?? true,
          isSpecial: seva.isSpecial ?? false,
          isShashwatha: seva.isShashwatha ?? false,
          bookingRules: bookingRulesText,
          sortOrder: seva.sortOrder ?? 0,
        })

        if (seva.images) {
          const parsedImages =
            typeof seva.images === "string" ? JSON.parse(seva.images) : seva.images
          setImages(Array.isArray(parsedImages) ? parsedImages : [])
        }

        if (seva.sevaDates && Array.isArray(seva.sevaDates)) {
          setAvailabilityDates(
            seva.sevaDates.map((sd: any) => ({
              date: new Date(sd.date).toISOString().split("T")[0],
              isAvailable: sd.isAvailable !== false,
              maxBookings: sd.maxBookings ?? undefined,
            }))
          )
        }

        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [sevaId, reset])

  const generateSlug = (val: string) => {
    setValue(
      "slug",
      val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "")
    )
  }

  const addAvailabilityDate = () => {
    setAvailabilityDates((prev) => [
      ...prev,
      { date: "", isAvailable: true, maxBookings: undefined },
    ])
  }

  const removeAvailabilityDate = (index: number) => {
    setAvailabilityDates((prev) => prev.filter((_, i) => i !== index))
  }

  const updateAvailabilityDate = (
    index: number,
    field: keyof AvailabilityDate,
    value: any
  ) => {
    setAvailabilityDates((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    )
  }

  const onSubmit = async (data: SevaInput) => {
    setSaving(true)
    try {
      const payload: any = {
        ...data,
        images,
        availabilityDates: availabilityDates.filter((d) => d.date),
      }

      const res = await fetch(`/api/sevas/${sevaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || "Failed to update seva")
      }

      toast.success("Seva updated successfully")
      router.push("/admin/sevas")
    } catch (err: any) {
      toast.error(err?.message || "Failed to update seva")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStatus = async () => {
    if (togglingStatus) return
    setTogglingStatus(true)
    try {
      const newStatus = !isActive
      const res = await fetch(`/api/sevas/${sevaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      })
      if (!res.ok) throw new Error()
      setValue("isActive", newStatus)
      toast.success(`Seva ${newStatus ? "activated" : "deactivated"}`)
    } catch {
      toast.error("Failed to update status")
    } finally {
      setTogglingStatus(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/sevas/${sevaId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Seva deleted successfully")
      setDeleteDialog(false)
      router.push("/admin/sevas")
    } catch {
      toast.error("Failed to delete seva")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <PageSkeleton />
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-text-primary">Seva Not Found</h2>
        <p className="text-text-muted mt-2">
          The seva you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => router.push("/admin/sevas")}
        >
          Back to Sevas
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold font-heading text-text-primary">
                Edit Seva
              </h1>
              <p className="text-sm text-text-muted mt-1">
                {watch("name") || "Loading..."}
              </p>
            </div>
            <Badge
              variant={isActive ? "success" : "subtle"}
              size="sm"
              className="ml-2"
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isActive ? "outline" : "secondary"}
            size="sm"
            iconLeft={<Power className="h-4 w-4" />}
            onClick={handleToggleStatus}
            loading={togglingStatus}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>
          <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
            <Button
              variant="destructive"
              size="sm"
              iconLeft={<Trash2 className="h-4 w-4" />}
              onClick={() => setDeleteDialog(true)}
            >
              Delete
            </Button>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>Delete Seva</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this seva? This action cannot be
                  undone and may affect existing bookings.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialog(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  loading={deleting}
                >
                  Delete Seva
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="primary"
            size="sm"
            iconLeft={<Save className="h-4 w-4" />}
            onClick={handleSubmit(onSubmit)}
            loading={saving}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-5">
              <h3 className="text-lg font-semibold font-heading text-text-primary">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Seva Name *"
                  placeholder="e.g., Rudra Abhishekam"
                  error={errors.name?.message as string}
                  {...register("name")}
                  onChange={(e) => {
                    register("name").onChange(e)
                    generateSlug(e.target.value)
                  }}
                />
                <Input
                  label="Slug *"
                  placeholder="rudra-abhishekam"
                  error={errors.slug?.message as string}
                  {...register("slug")}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Input
                  label="Short Description"
                  placeholder="Brief description (max 300 chars)"
                  error={errors.shortDescription?.message as string}
                  {...register("shortDescription")}
                />
              </div>

              <RichEditor
                label="Description *"
                value={watch("description") || ""}
                onChange={(val) => setValue("description", val)}
                error={errors.description?.message as string}
                minHeight="250px"
              />
            </Card>

            <Card className="p-6 space-y-5">
              <h3 className="text-lg font-semibold font-heading text-text-primary">
                Pricing & Duration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="Price (₹) *"
                  type="number"
                  placeholder="2500"
                  error={errors.price?.message as string}
                  {...register("price")}
                />
                <Input
                  label="Discounted Price (₹)"
                  type="number"
                  placeholder="2000"
                  error={errors.originalPrice?.message as string}
                  {...register("originalPrice")}
                />
                <Input
                  label="Duration (mins)"
                  type="number"
                  placeholder="60"
                  error={errors.duration?.message as string}
                  {...register("duration")}
                />
                <Input
                  label="Booking Notice (hrs)"
                  type="number"
                  placeholder="24"
                  error={errors.bookingNotice?.message as string}
                  {...register("bookingNotice")}
                />
              </div>
            </Card>

            <Card className="p-6 space-y-5">
              <h3 className="text-lg font-semibold font-heading text-text-primary">
                Devotee Limits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Max Devotees"
                  type="number"
                  placeholder="10"
                  error={errors.maxDevotees?.message as string}
                  {...register("maxDevotees")}
                />
                <Input
                  label="Min Devotees"
                  type="number"
                  placeholder="1"
                  error={errors.minDevotees?.message as string}
                  {...register("minDevotees")}
                />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold font-heading text-text-primary">
                Booking Rules
              </h3>
              <div className="flex flex-col gap-1.5">
                <textarea
                  {...register("bookingRules")}
                  rows={6}
                  placeholder="Enter booking rules and guidelines for devotees..."
                  className="w-full rounded-lg border border-border bg-warm-white dark:bg-bg-secondary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all resize-y"
                />
                {errors.bookingRules && (
                  <p className="text-xs text-red-500">
                    {String(errors.bookingRules.message ?? "")}
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold font-heading text-text-primary">
                  Availability Dates
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  iconLeft={<Plus className="h-4 w-4" />}
                  onClick={addAvailabilityDate}
                >
                  Add Date
                </Button>
              </div>
              {availabilityDates.length === 0 && (
                <p className="text-sm text-text-muted">
                  No specific dates set - seva available daily (if active)
                </p>
              )}
              <div className="space-y-2">
                {availabilityDates.map((ad, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        type="date"
                        value={ad.date}
                        onChange={(e) =>
                          updateAvailabilityDate(index, "date", e.target.value)
                        }
                        className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <label className="flex items-center gap-1.5 text-sm text-text-primary cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ad.isAvailable}
                          onChange={(e) =>
                            updateAvailabilityDate(
                              index,
                              "isAvailable",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary"
                        />
                        Available
                      </label>
                    </div>
                    <Input
                      type="number"
                      placeholder="Max"
                      className="w-24"
                      value={ad.maxBookings ?? ""}
                      onChange={(e) =>
                        updateAvailabilityDate(
                          index,
                          "maxBookings",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeAvailabilityDate(index)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold font-heading text-text-primary">
                Settings
              </h3>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">Active</p>
                  <p className="text-xs text-text-muted">
                    Available for booking
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isSpecial")}
                  className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Special Seva
                  </p>
                  <p className="text-xs text-text-muted">Featured seva</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("requiresApproval")}
                  className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Requires Approval
                  </p>
                  <p className="text-xs text-text-muted">
                    Admin approval needed
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isShashwatha")}
                  className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Shashwatha Seva
                  </p>
                  <p className="text-xs text-text-muted">Permanent seva</p>
                </div>
              </label>

              <div className="pt-3 border-t border-border/60">
                <Input
                  label="Sort Order"
                  type="number"
                  placeholder="0"
                  error={errors.sortOrder?.message as string}
                  {...register("sortOrder")}
                />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold font-heading text-text-primary">
                Images
              </h3>
              <ImageUpload
                images={images}
                onChange={setImages}
                maxImages={5}
                label="Seva Images"
                featured
              />
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
