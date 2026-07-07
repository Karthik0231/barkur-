"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@/lib/zod-resolver"
import { z } from "zod"
import { motion } from "framer-motion"
import {
  Save,
  ArrowLeft,
  Plus,
  X,
  Image as ImageIcon,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RichEditor } from "@/components/admin/rich-editor"
import { ImageUpload, type ImageItem } from "@/components/admin/image-upload"

const sevaFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  categoryId: z.string().min(1, "Category is required"),
  shortDescription: z.string().max(300).optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  originalPrice: z.coerce.number().optional().or(z.literal("")),
  duration: z.coerce.number().int().positive().optional().or(z.literal("")),
  maxDevotees: z.coerce.number().int().positive().optional().or(z.literal("")),
  minDevotees: z.coerce.number().int().positive().optional().or(z.literal("")),
  bookingNotice: z.coerce.number().int().min(0).optional().or(z.literal("")),
  requiresApproval: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isSpecial: z.boolean().optional(),
})



const categories = [
  { id: "cat1", name: "Abhishekam" },
  { id: "cat2", name: "Vrata" },
  { id: "cat3", name: "Homa" },
  { id: "cat4", name: "Nitya" },
  { id: "cat5", name: "Special" },
  { id: "cat6", name: "Seva" },
]

export default function NewSevaPage() {
  const router = useRouter()
  const [images, setImages] = useState<ImageItem[]>([])
  const [rules, setRules] = useState<string[]>([""])
  const [instructions, setInstructions] = useState<string[]>([""])
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<any>({
    resolver: zodResolver(sevaFormSchema),
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
    },
  })

  const name = watch("name")

  const generateSlug = (val: string) => {
    setValue("slug", val.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, ""))
  }

  const onSubmit = async (data: any) => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    console.log("Seva data:", { ...data, images, rules: rules.filter(Boolean), instructions: instructions.filter(Boolean) })
    setSaving(false)
    router.push("/admin/sevas")
  }

  const addRule = () => setRules((prev) => [...prev, ""])
  const removeRule = (index: number) => setRules((prev) => prev.filter((_, i) => i !== index))
  const updateRule = (index: number, value: string) =>
    setRules((prev) => prev.map((r, i) => (i === index ? value : r)))

  const addInstruction = () => setInstructions((prev) => [...prev, ""])
  const removeInstruction = (index: number) => setInstructions((prev) => prev.filter((_, i) => i !== index))
  const updateInstruction = (index: number, value: string) =>
    setInstructions((prev) => prev.map((r, i) => (i === index ? value : r)))

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
            <h1 className="text-2xl font-bold font-heading text-text-primary">Create New Seva</h1>
            <p className="text-sm text-text-muted mt-1">Add a new seva, puja, or homa to the temple</p>
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
              <h3 className="text-lg font-semibold font-heading text-text-primary">Basic Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Seva Name"
                  placeholder="e.g., Rudra Abhishekam"
                  error={errors.name?.message as string}
                  {...register("name")}
                  onChange={(e) => {
                    register("name").onChange(e)
                    if (!watch("slug") || watch("slug") === name?.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "")) {
                      generateSlug(e.target.value)
                    }
                  }}
                />
                <Input
                  label="Slug"
                  placeholder="rudra-abhishekam"
                  error={errors.slug?.message as string}
                  {...register("slug")}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary">Category</label>
                  <select
                    {...register("categoryId")}
                    className="h-11 w-full rounded-lg border border-border bg-warm-white dark:bg-bg-secondary px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-xs text-red-500">{String(errors.categoryId.message ?? "")}</p>
                  )}
                </div>
                <Input
                  label="Short Description"
                  placeholder="Brief description (max 300 chars)"
                  error={errors.shortDescription?.message as string}
                  {...register("shortDescription")}
                />
              </div>

              <RichEditor
                label="Description"
                value={watch("description") || ""}
                onChange={(val) => setValue("description", val)}
                placeholder="Describe the seva, its significance, and what devotees should know..."
                error={errors.description?.message as string}
                minHeight="250px"
              />
            </Card>

            <Card className="p-6 space-y-5">
              <h3 className="text-lg font-semibold font-heading text-text-primary">Pricing & Duration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  label="Price (₹)"
                  type="number"
                  placeholder="2500"
                  error={errors.price?.message as string}
                  {...register("price")}
                />
                <Input
                  label="Original Price (₹)"
                  type="number"
                  placeholder="3000"
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
              <h3 className="text-lg font-semibold font-heading text-text-primary">Devotee Limits</h3>
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
                  placeholder="2"
                  error={errors.minDevotees?.message as string}
                  {...register("minDevotees")}
                />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold font-heading text-text-primary">Rules</h3>
              {rules.map((rule, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={rule}
                    onChange={(e) => updateRule(index, e.target.value)}
                    placeholder={`Rule ${index + 1}`}
                  />
                  {rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={addRule}>
                Add Rule
              </Button>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold font-heading text-text-primary">Special Instructions</h3>
              {instructions.map((inst, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={inst}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder={`Instruction ${index + 1}`}
                  />
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={addInstruction}>
                Add Instruction
              </Button>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold font-heading text-text-primary">Settings</h3>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">Active</p>
                  <p className="text-xs text-text-muted">Make this seva available for booking</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isSpecial")}
                  className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">Special Seva</p>
                  <p className="text-xs text-text-muted">Mark as a special/featured seva</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("requiresApproval")}
                  className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">Requires Approval</p>
                  <p className="text-xs text-text-muted">Admin must approve bookings</p>
                </div>
              </label>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold font-heading text-text-primary">Image</h3>
              <ImageUpload
                images={images}
                onChange={setImages}
                maxImages={5}
                label="Seva Images"
              />
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}




