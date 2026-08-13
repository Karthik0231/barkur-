"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@/lib/zod-resolver"
import { sevaSchema, type SevaInput } from "@/lib/validations"
import {
  Save,
  ArrowLeft,
  Plus,
  X,
  Calendar,
} from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { RichEditor } from "@/components/admin/rich-editor"
import { ImageUpload, type ImageItem } from "@/components/admin/image-upload"

interface CategoryOption {
  id: string
  name: string
  slug: string
}

interface AvailabilityDate {
  date: string
  isAvailable: boolean
  maxBookings?: number
}

export default function NewSevaPage() {
  const router = useRouter()
  const [images, setImages] = useState<ImageItem[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [availabilityDates, setAvailabilityDates] = useState<AvailabilityDate[]>([])
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SevaInput>({
    resolver: zodResolver(sevaSchema),
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      shortDescription: "",
      description: "",
      price: undefined,
      originalPrice: undefined,
      duration: undefined,
      maxDevotees: undefined,
      minDevotees: undefined,
      bookingNotice: 24,
      requiresApproval: false,
      isActive: true,
      isSpecial: false,
      isShashwatha: false,
      bookingRules: "",
      sortOrder: 0,
    },
  })

  useEffect(() => {
    fetch("/api/categories?type=SEVA&limit=100")
      .then((r) => r.json())
      .then((d) => {
        const cats = d.data?.categories || d.data || d || []
        setCategories(Array.isArray(cats) ? cats : [])
        setCategoriesLoading(false)
      })
      .catch(() => {
        setCategories([])
        setCategoriesLoading(false)
      })
  }, [])

  const name = watch("name")

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

      const res = await fetch("/api/sevas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.message || "Failed to create seva")
      }

      toast.success("Seva created successfully")
      router.push("/admin/sevas")
    } catch (err: any) {
      toast.error(err?.message || "Failed to create seva")
    } finally {
      setSaving(false)
    }
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
          <div>
            <h1 className="text-2xl font-bold font-heading text-text-primary">
              Create New Seva
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Add a new seva, puja, or homa to the temple
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          iconLeft={<Save className="h-4 w-4" />}
          onClick={handleSubmit(onSubmit)}
          loading={saving}
        >
          Save Seva
        </Button>
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
                  variant="filled"
                  label="Seva Name *"
                  placeholder="e.g., Rudra Abhishekam"
                  error={errors.name?.message as string}
                  {...register("name")}
                  onChange={(e) => {
                    register("name").onChange(e)
                    const currentSlug = watch("slug")
                    const expectedSlug =
                      (name || "")
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, "")
                        .replace(/[\s_]+/g, "-")
                        .replace(/^-+|-+$/g, "")
                    if (!currentSlug || currentSlug === expectedSlug) {
                      generateSlug(e.target.value)
                    }
                  }}
                />
                <Input
                  variant="filled"
                  label="Slug *"
                  placeholder="rudra-abhishekam"
                  error={errors.slug?.message as string}
                  {...register("slug")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary">
                    Category *
                  </label>
                  <select
                    {...register("categoryId")}
                    className="h-11 w-full rounded-xl border-2 border-transparent bg-bg-secondary px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                    disabled={categoriesLoading}
                  >
                    <option value="">
                      {categoriesLoading ? "Loading..." : "Select category"}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-xs text-red-500">
                      {String(errors.categoryId.message ?? "")}
                    </p>
                  )}
                </div>
                <Input
                  variant="filled"
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
                placeholder="Describe the seva, its significance, and what devotees should know..."
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
                  variant="filled"
                  label="Price (₹) *"
                  type="number"
                  placeholder="2500"
                  error={errors.price?.message as string}
                  {...register("price")}
                />
                <Input
                  variant="filled"
                  label="Discounted Price (₹)"
                  type="number"
                  placeholder="2000"
                  error={errors.originalPrice?.message as string}
                  {...register("originalPrice")}
                />
                <Input
                  variant="filled"
                  label="Duration (mins)"
                  type="number"
                  placeholder="60"
                  error={errors.duration?.message as string}
                  {...register("duration")}
                />
                <Input
                  variant="filled"
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
                  variant="filled"
                  label="Max Devotees"
                  type="number"
                  placeholder="10"
                  error={errors.maxDevotees?.message as string}
                  {...register("maxDevotees")}
                />
                <Input
                  variant="filled"
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
                  placeholder="Enter booking rules and guidelines for devotees...&#10;&#10;e.g.,&#10;- Devotees must arrive 30 minutes before the seva&#10;- Traditional attire is required&#10;- No photography during the ritual"
                  className="w-full rounded-xl border-2 border-transparent bg-bg-secondary px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all resize-y"
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
                  No specific dates set - seva will be available daily (if active)
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
                        className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border-2 border-transparent bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
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
                      variant="filled"
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
                    Make this seva available for booking
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
                  <p className="text-xs text-text-muted">
                    Mark as a special/featured seva
                  </p>
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
                    Admin must approve bookings
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
                  <p className="text-xs text-text-muted">
                    Permanent/long-term seva
                  </p>
                </div>
              </label>

              <div className="pt-3 border-t border-border/60">
                <Input
                  variant="filled"
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
