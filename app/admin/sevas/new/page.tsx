"use client"

import { useState } from "react"
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
  Image as ImageIcon,
  Settings2,
  IndianRupee,
  Users,
  Clock3,
  FileText,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronRight,
  Info,
  BookOpen,
  Eye,
  Zap,
} from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { RichEditor } from "@/components/admin/rich-editor"
import { ImageUpload, type ImageItem } from "@/components/admin/image-upload"

interface AvailabilityDate {
  date: string
  isAvailable: boolean
  maxBookings?: number
}

const sections = [
  {
    id: "basic",
    label: "Basic information",
    description: "Name, slug & description",
    icon: FileText,
  },
  {
    id: "pricing",
    label: "Pricing & limits",
    description: "Price, duration & devotees",
    icon: IndianRupee,
  },
  {
    id: "rules",
    label: "Booking rules",
    description: "Guidelines & availability",
    icon: BookOpen,
  },
  {
    id: "settings",
    label: "Settings",
    description: "Visibility & approval",
    icon: Settings2,
  },
  {
    id: "media",
    label: "Media",
    description: "Seva images",
    icon: ImageIcon,
  },
]

export default function NewSevaPage() {
  const router = useRouter()

  const [images, setImages] = useState<ImageItem[]>([])
  const [availabilityDates, setAvailabilityDates] = useState<
    AvailabilityDate[]
  >([])
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

  const name = watch("name") as string | undefined
  const price = watch("price") as number | undefined
  const originalPrice = watch("originalPrice") as number | undefined
  const duration = watch("duration") as number | undefined
  const maxDevotees = watch("maxDevotees") as number | undefined
  const minDevotees = watch("minDevotees") as number | undefined
  const bookingNotice = watch("bookingNotice") as number | undefined
  const isActive = watch("isActive") as boolean | undefined
  const isSpecial = watch("isSpecial") as boolean | undefined
  const requiresApproval = watch("requiresApproval") as boolean | undefined
  const isShashwatha = watch("isShashwatha") as boolean | undefined

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
      {
        date: "",
        isAvailable: true,
        maxBookings: undefined,
      },
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
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    )
  }

  const onSubmit = async (data: SevaInput) => {
    setSaving(true)

    try {
      const payload: any = {
        ...data,
        images,
        availabilityDates: availabilityDates.filter((item) => item.date),
      }

      const res = await fetch("/api/sevas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  const getDiscountPercentage = () => {
    if (!price || !originalPrice) return null

    const current = Number(price)
    const original = Number(originalPrice)

    if (!current || !original || original <= current) return null

    return Math.round(((original - current) / original) * 100)
  }

  const discount = getDiscountPercentage()

  return (
    <div className="min-h-full pb-28">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="mb-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="
                mt-1 flex h-11 w-11 shrink-0 items-center justify-center
                rounded-2xl border border-border/70
                bg-bg-primary
                text-text-muted
                shadow-sm
                transition-all duration-200
                hover:-translate-x-0.5
                hover:border-secondary/30
                hover:bg-secondary/5
                hover:text-secondary
              "
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className="
                    inline-flex items-center gap-1.5 rounded-full
                    bg-secondary/10 px-3 py-1
                    text-[11px] font-bold uppercase tracking-[0.12em]
                    text-secondary
                  "
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  New seva
                </span>

                <span className="text-xs text-text-muted">
                  / Sevas / Create
                </span>
              </div>

              <h1 className="font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                Create a new seva
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                Configure the seva details, pricing, booking rules and
                availability before publishing it for devotees.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <div
              className={`
                flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold
                ${isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : "border-border bg-bg-secondary text-text-muted"
                }
              `}
            >
              <span
                className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-text-muted"
                  }`}
              />
              {isActive ? "Ready to publish" : "Draft mode"}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-7 hidden overflow-hidden rounded-2xl border border-border/60 bg-bg-primary shadow-sm lg:block">
          <div className="flex">
            {sections.map((section, index) => {
              const Icon = section.icon

              return (
                <div
                  key={section.id}
                  className="
                    group relative flex flex-1 items-center gap-3
                    border-r border-border/50 px-5 py-4
                    last:border-r-0
                  "
                >
                  <div
                    className="
                      flex h-9 w-9 shrink-0 items-center justify-center
                      rounded-xl bg-secondary/10
                      text-secondary
                      transition-transform duration-200
                      group-hover:scale-105
                    "
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-text-primary">
                      {String(index + 1).padStart(2, "0")}{" "}
                      {section.label}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-text-muted">
                      {section.description}
                    </p>
                  </div>

                  {index < sections.length - 1 && (
                    <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-text-muted/40" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* =======================================================
              MAIN FORM
          ======================================================= */}

          <div className="min-w-0 space-y-7">
            {/* =====================================================
                BASIC INFORMATION
            ===================================================== */}

            <section id="basic">
              <Card className="overflow-hidden border-border/60 p-0 shadow-sm">
                <div className="border-b border-border/60 bg-bg-secondary/40 px-6 py-5 sm:px-7">
                  <div className="flex items-start gap-4">
                    <div
                      className="
                        flex h-11 w-11 shrink-0 items-center justify-center
                        rounded-2xl bg-secondary/10 text-secondary
                      "
                    >
                      <FileText className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-heading text-lg font-bold text-text-primary">
                        Basic information
                      </h2>
                      <p className="mt-1 text-sm text-text-muted">
                        Give devotees a clear understanding of what this seva
                        is about.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-6 sm:p-7">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Input
                      variant="filled"
                      label="Seva name *"
                      placeholder="e.g. Rudra Abhishekam"
                      error={errors.name?.message as string}
                      {...register("name")}
                      onChange={(e) => {
                        register("name").onChange(e)

                        const currentSlug = watch("slug")

                        const expectedSlug = (name || "")
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
                      label="URL slug *"
                      placeholder="rudra-abhishekam"
                      error={errors.slug?.message as string}
                      {...register("slug")}
                    />
                  </div>

                  <div>
                    <Input
                      variant="filled"
                      label="Short description"
                      placeholder="A concise description devotees will see in listings..."
                      error={errors.shortDescription?.message as string}
                      {...register("shortDescription")}
                    />

                    <div className="mt-2 flex justify-end">
                      <span className="text-[11px] text-text-muted">
                        Keep it clear and under 300 characters
                      </span>
                    </div>
                  </div>

                  <RichEditor
                    label="Full description *"
                    value={watch("description") || ""}
                    onChange={(val) => setValue("description", val)}
                    placeholder="Describe the seva, its significance, procedure, benefits, and anything devotees should know..."
                    error={errors.description?.message as string}
                    minHeight="280px"
                  />
                </div>
              </Card>
            </section>

            {/* =====================================================
                PRICING
            ===================================================== */}

            <section id="pricing">
              <Card className="overflow-hidden border-border/60 p-0 shadow-sm">
                <div className="border-b border-border/60 bg-bg-secondary/40 px-6 py-5 sm:px-7">
                  <div className="flex items-start gap-4">
                    <div
                      className="
                        flex h-11 w-11 shrink-0 items-center justify-center
                        rounded-2xl bg-secondary/10 text-secondary
                      "
                    >
                      <IndianRupee className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-heading text-lg font-bold text-text-primary">
                        Pricing & capacity
                      </h2>
                      <p className="mt-1 text-sm text-text-muted">
                        Define pricing, duration and how many devotees can
                        participate.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-7 p-6 sm:p-7">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="relative">
                      <Input
                        variant="filled"
                        label="Booking price (₹) *"
                        type="number"
                        placeholder="2500"
                        error={errors.price?.message as string}
                        {...register("price")}
                      />

                      {price && (
                        <span className="absolute bottom-3.5 right-3 text-[11px] font-semibold text-text-muted">
                          INR
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <Input
                        variant="filled"
                        label="Original price (₹)"
                        type="number"
                        placeholder="3000"
                        error={errors.originalPrice?.message as string}
                        {...register("originalPrice")}
                      />

                      {discount && (
                        <span
                          className="
                            absolute right-3 top-[38px]
                            rounded-full bg-emerald-500/10
                            px-2 py-1 text-[10px] font-bold
                            text-emerald-600
                          "
                        >
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Input
                      variant="filled"
                      label="Duration"
                      type="number"
                      placeholder="60"
                      error={errors.duration?.message as string}
                      {...register("duration")}
                    />

                    <Input
                      variant="filled"
                      label="Booking notice"
                      type="number"
                      placeholder="24"
                      error={errors.bookingNotice?.message as string}
                      {...register("bookingNotice")}
                    />
                  </div>

                  <div className="rounded-2xl border border-secondary/15 bg-secondary/5 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                        <Users className="h-4 w-4" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-text-primary">
                          Devotee capacity
                        </h3>
                        <p className="text-xs text-text-muted">
                          Set participation limits for each booking.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Input
                        variant="filled"
                        label="Maximum devotees"
                        type="number"
                        placeholder="10"
                        error={errors.maxDevotees?.message as string}
                        {...register("maxDevotees")}
                      />

                      <Input
                        variant="filled"
                        label="Minimum devotees"
                        type="number"
                        placeholder="1"
                        error={errors.minDevotees?.message as string}
                        {...register("minDevotees")}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* =====================================================
                BOOKING RULES
            ===================================================== */}

            <section id="rules">
              <Card className="overflow-hidden border-border/60 p-0 shadow-sm">
                <div className="border-b border-border/60 bg-bg-secondary/40 px-6 py-5 sm:px-7">
                  <div className="flex items-start gap-4">
                    <div
                      className="
                        flex h-11 w-11 shrink-0 items-center justify-center
                        rounded-2xl bg-secondary/10 text-secondary
                      "
                    >
                      <BookOpen className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-heading text-lg font-bold text-text-primary">
                        Booking rules
                      </h2>
                      <p className="mt-1 text-sm text-text-muted">
                        Make important requirements clear before devotees
                        complete a booking.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-7 p-6 sm:p-7">
                  <div>
                    <textarea
                      {...register("bookingRules")}
                      rows={8}
                      placeholder={`Enter booking rules and guidelines for devotees...

Example:
• Devotees must arrive 30 minutes before the seva
• Traditional attire is required
• No photography during the ritual`}
                      className="
                        min-h-[190px] w-full resize-y rounded-2xl
                        border-2 border-transparent
                        bg-bg-secondary px-4 py-4
                        text-sm leading-6 text-text-primary
                        placeholder:text-text-muted
                        transition-all
                        focus:border-secondary
                        focus:outline-none
                        focus:ring-4 focus:ring-secondary/10
                      "
                    />

                    {errors.bookingRules && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {String(errors.bookingRules.message ?? "")}
                      </p>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="rounded-2xl border border-border/70 bg-bg-secondary/25">
                    <div className="flex flex-col gap-4 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                          <Calendar className="h-4 w-4" />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-text-primary">
                            Specific availability
                          </h3>
                          <p className="mt-0.5 text-xs text-text-muted">
                            Leave empty to make this seva available daily.
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        iconLeft={<Plus className="h-4 w-4" />}
                        onClick={addAvailabilityDate}
                      >
                        Add availability
                      </Button>
                    </div>

                    <div className="p-5">
                      {availabilityDates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-bg-primary px-5 py-10 text-center">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                            <Calendar className="h-5 w-5" />
                          </div>

                          <p className="text-sm font-semibold text-text-primary">
                            Available every day
                          </p>

                          <p className="mt-1 max-w-sm text-xs leading-5 text-text-muted">
                            Add specific dates only when this seva should have
                            custom availability or capacity.
                          </p>

                          <button
                            type="button"
                            onClick={addAvailabilityDate}
                            className="mt-4 text-xs font-bold text-secondary hover:underline"
                          >
                            + Add a specific date
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {availabilityDates.map((item, index) => (
                            <div
                              key={index}
                              className="
                                rounded-2xl border border-border/70
                                bg-bg-primary p-4
                                transition-all
                                hover:border-secondary/25
                                hover:shadow-sm
                              "
                            >
                              <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                                <div className="flex-1">
                                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-text-muted">
                                    Date
                                  </label>

                                  <div className="relative">
                                    <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

                                    <input
                                      type="date"
                                      value={item.date}
                                      onChange={(e) =>
                                        updateAvailabilityDate(
                                          index,
                                          "date",
                                          e.target.value
                                        )
                                      }
                                      className="
                                        h-11 w-full rounded-xl
                                        border-2 border-transparent
                                        bg-bg-secondary
                                        pl-10 pr-4
                                        text-sm text-text-primary
                                        outline-none
                                        transition-all
                                        focus:border-secondary
                                        focus:ring-4 focus:ring-secondary/10
                                      "
                                    />
                                  </div>
                                </div>

                                <div className="lg:w-[150px]">
                                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-text-muted">
                                    Max bookings
                                  </label>

                                  <Input
                                    variant="filled"
                                    type="number"
                                    placeholder="Unlimited"
                                    value={item.maxBookings ?? ""}
                                    onChange={(e) =>
                                      updateAvailabilityDate(
                                        index,
                                        "maxBookings",
                                        e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </div>

                                <label
                                  className="
                                    flex h-11 cursor-pointer items-center gap-3
                                    rounded-xl border border-border/60
                                    bg-bg-secondary px-4
                                  "
                                >
                                  <input
                                    type="checkbox"
                                    checked={item.isAvailable}
                                    onChange={(e) =>
                                      updateAvailabilityDate(
                                        index,
                                        "isAvailable",
                                        e.target.checked
                                      )
                                    }
                                    className="peer sr-only"
                                  />

                                  <span
                                    className={`
                                      relative h-5 w-9 rounded-full transition-colors
                                      ${item.isAvailable
                                        ? "bg-secondary"
                                        : "bg-border"
                                      }
                                    `}
                                  >
                                    <span
                                      className={`
                                        absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform
                                        ${item.isAvailable
                                          ? "translate-x-4"
                                          : "translate-x-0.5"
                                        }
                                      `}
                                    />
                                  </span>

                                  <span className="text-xs font-semibold text-text-primary">
                                    Available
                                  </span>
                                </label>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeAvailabilityDate(index)
                                  }
                                  className="
                                    flex h-11 w-11 shrink-0 items-center
                                    justify-center rounded-xl
                                    text-red-500
                                    transition-colors
                                    hover:bg-red-50
                                    dark:hover:bg-red-950/30
                                  "
                                  aria-label="Remove availability date"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* =====================================================
                MEDIA
            ===================================================== */}

            <section id="media">
              <Card className="overflow-hidden border-border/60 p-0 shadow-sm">
                <div className="border-b border-border/60 bg-bg-secondary/40 px-6 py-5 sm:px-7">
                  <div className="flex items-start gap-4">
                    <div
                      className="
                        flex h-11 w-11 shrink-0 items-center justify-center
                        rounded-2xl bg-secondary/10 text-secondary
                      "
                    >
                      <ImageIcon className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="font-heading text-lg font-bold text-text-primary">
                        Seva media
                      </h2>
                      <p className="mt-1 text-sm text-text-muted">
                        Add high-quality images to make the seva easier to
                        discover.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <ImageUpload
                    images={images}
                    onChange={setImages}
                    maxImages={5}
                    label="Seva images"
                    featured
                  />

                  <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-secondary/5 p-3.5">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />

                    <p className="text-xs leading-5 text-text-muted">
                      Use clear temple, ritual or seva-related images. The
                      featured image will be used as the primary visual.
                    </p>
                  </div>
                </div>
              </Card>
            </section>
          </div>

          {/* =======================================================
              RIGHT SIDEBAR
          ======================================================= */}

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            {/* Preview */}
            <Card className="overflow-hidden border-border/60 p-0 shadow-sm">
              <div className="border-b border-border/60 bg-bg-secondary/40 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <Eye className="h-4 w-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-text-primary">
                        Live overview
                      </h3>
                      <p className="text-[11px] text-text-muted">
                        Updates as you type
                      </p>
                    </div>
                  </div>

                  {isSpecial && (
                    <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-bold text-secondary">
                      SPECIAL
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-bg-secondary">
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-secondary/15 via-secondary/5 to-transparent">
                    {images.length > 0 ? (
                      <div className="flex flex-col items-center gap-2 text-secondary">
                        <ImageIcon className="h-7 w-7" />
                        <span className="text-[11px] font-semibold">
                          {images.length} image
                          {images.length > 1 ? "s" : ""} added
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-text-muted">
                        <ImageIcon className="h-7 w-7 opacity-50" />
                        <span className="text-[11px]">
                          No image selected
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-4">
                    <div>
                      <p className="text-lg font-bold leading-tight text-text-primary">
                        {name || "Your seva name"}
                      </p>

                      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-text-muted">
                        {watch("shortDescription") ||
                          "Your short description will appear here."}
                      </p>
                    </div>

                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                          Booking price
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xl font-bold text-secondary">
                            ₹{price ? Number(price).toLocaleString("en-IN") : "—"}
                          </span>

                          {originalPrice &&
                            Number(originalPrice) > Number(price || 0) && (
                              <span className="text-xs text-text-muted line-through">
                                ₹
                                {Number(originalPrice).toLocaleString("en-IN")}
                              </span>
                            )}
                        </div>
                      </div>

                      {discount && (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-600">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-bg-primary p-3">
                        <Clock3 className="mb-2 h-4 w-4 text-secondary" />
                        <p className="text-[10px] text-text-muted">
                          Duration
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-text-primary">
                          {duration ? `${duration} mins` : "Not set"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-bg-primary p-3">
                        <Users className="mb-2 h-4 w-4 text-secondary" />
                        <p className="text-[10px] text-text-muted">
                          Capacity
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-text-primary">
                          {maxDevotees || "Unlimited"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Settings */}
            <Card className="overflow-hidden border-border/60 p-0 shadow-sm">
              <div className="border-b border-border/60 bg-bg-secondary/40 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <Settings2 className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      Publishing settings
                    </h3>
                    <p className="text-[11px] text-text-muted">
                      Control how this seva behaves
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-border/50">
                <SettingToggle
                  label="Active"
                  description="Available for devotees to book"
                  checked={isActive}
                  onChange={(value) => setValue("isActive", value)}
                  icon={<Zap className="h-4 w-4" />}
                />

                <SettingToggle
                  label="Special seva"
                  description="Highlight as a featured seva"
                  checked={isSpecial}
                  onChange={(value) => setValue("isSpecial", value)}
                  icon={<Sparkles className="h-4 w-4" />}
                />

                <SettingToggle
                  label="Requires approval"
                  description="Admin approval before confirmation"
                  checked={requiresApproval}
                  onChange={(value) =>
                    setValue("requiresApproval", value)
                  }
                  icon={<ShieldCheck className="h-4 w-4" />}
                />

                <SettingToggle
                  label="Shashwatha seva"
                  description="Mark as permanent / long-term"
                  checked={isShashwatha}
                  onChange={(value) => setValue("isShashwatha", value)}
                  icon={<Check className="h-4 w-4" />}
                />
              </div>

              <div className="border-t border-border/60 p-5">
                <Input
                  variant="filled"
                  label="Display order"
                  type="number"
                  placeholder="0"
                  error={errors.sortOrder?.message as string}
                  {...register("sortOrder")}
                />

                <p className="mt-2 text-[11px] leading-4 text-text-muted">
                  Lower numbers appear first when sevas are sorted manually.
                </p>
              </div>
            </Card>

            {/* Quick information */}
            <div className="rounded-2xl border border-secondary/15 bg-secondary/5 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <Info className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-bold text-text-primary">
                    Before publishing
                  </p>

                  <ul className="mt-2 space-y-2 text-[11px] leading-5 text-text-muted">
                    <li className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                      Check the seva name and description.
                    </li>

                    <li className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                      Verify the booking price and capacity.
                    </li>

                    <li className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                      Add important devotee instructions.
                    </li>

                    <li className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                      Add a featured image for better presentation.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </form>

      {/* =========================================================
          STICKY ACTION BAR
      ========================================================= */}

      <div
        className="
          fixed inset-x-0 bottom-0 z-40
          border-t border-border/70
          bg-bg-primary/90
          px-4 py-3
          shadow-[0_-8px_30px_rgba(0,0,0,0.06)]
          backdrop-blur-xl
          sm:px-6
        "
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <div className="hidden items-center gap-3 sm:flex">
            <div
              className={`
                flex h-8 w-8 items-center justify-center rounded-full
                ${isActive
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-bg-secondary text-text-muted"
                }
              `}
            >
              {isActive ? (
                <Check className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-text-primary">
                {isActive ? "Ready to publish" : "Currently inactive"}
              </p>

              <p className="text-[11px] text-text-muted">
                {name
                  ? `${name} will be created when you save`
                  : "Complete the required fields before saving"}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              iconLeft={<Save className="h-4 w-4" />}
              onClick={handleSubmit(onSubmit)}
              loading={saving}
            >
              {saving ? "Creating..." : "Create seva"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===============================================================
   SETTING TOGGLE
=============================================================== */

interface SettingToggleProps {
  label: string
  description: string
  checked: boolean | undefined
  onChange: (value: boolean) => void
  icon: React.ReactNode
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
  icon,
}: SettingToggleProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3.5 p-5 transition-colors hover:bg-bg-secondary/40">
      <div
        className={`
          flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
          transition-colors
          ${checked
            ? "bg-secondary/10 text-secondary"
            : "bg-bg-secondary text-text-muted"
          }
        `}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-text-primary">{label}</p>
        <p className="mt-0.5 text-[11px] leading-4 text-text-muted">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative h-6 w-11 shrink-0 rounded-full
          transition-colors duration-200
          focus:outline-none focus:ring-4 focus:ring-secondary/10
          ${checked ? "bg-secondary" : "bg-border"}
        `}
      >
        <span
          className={`
            absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm
            transition-transform duration-200
            ${checked ? "translate-x-6" : "translate-x-1"}
          `}
        />
      </button>
    </label>
  )
}