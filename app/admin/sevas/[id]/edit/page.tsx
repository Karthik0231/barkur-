"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@/lib/zod-resolver"
import { z } from "zod"
import { Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { RichEditor } from "@/components/admin/rich-editor"
import { ImageUpload, type ImageItem } from "@/components/admin/image-upload"
import { PageSkeleton } from "@/components/ui/skeleton"

const sevaFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/),
  categoryId: z.string().min(1, "Category is required"),
  shortDescription: z.string().max(300).optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().positive(),
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

// Mock data - replace with API call
const getSeva = (id: string) => ({
  id,
  name: "Rudra Abhishekam",
  slug: "rudra-abhishekam",
  categoryId: "cat1",
  shortDescription: "A powerful Vedic ritual for purification",
  description: "<p>Rudra Abhishekam is a sacred Vedic ritual performed to Lord Shiva...</p>",
  price: 2500,
  originalPrice: 3000,
  duration: 60,
  maxDevotees: 5,
  minDevotees: 1,
  bookingNotice: 24,
  requiresApproval: false,
  isActive: true,
  isSpecial: true,
})

export default function EditSevaPage() {
  const router = useRouter()
  const params = useParams()
  const [images, setImages] = useState<ImageItem[]>([])
  const [rules, setRules] = useState<string[]>(["Must wear traditional attire", "Arrive 30 minutes early"])
  const [instructions, setInstructions] = useState<string[]>(["Maintain silence during the ritual", "No photography allowed"])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<any>({
    resolver: zodResolver(sevaFormSchema),
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = getSeva(params.id as string)
      if (data) {
        reset(data)
        setLoading(false)
      } else {
        setNotFound(true)
        setLoading(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [params.id, reset])

  const onSubmit = async (data: any) => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    console.log("Updated seva:", { ...data, id: params.id, images, rules, instructions })
    setSaving(false)
    router.push("/admin/sevas")
  }

  if (loading) return <PageSkeleton />
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-text-primary">Seva Not Found</h2>
        <p className="text-text-muted mt-2">The seva you&apos;re looking for doesn&apos;t exist.</p>
        <Button variant="primary" className="mt-4" onClick={() => router.push("/admin/sevas")}>
          Back to Sevas
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-heading text-text-primary">Edit Seva</h1>
            <p className="text-sm text-text-muted mt-1">{watch("name") || "Loading..."}</p>
          </div>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Save className="h-4 w-4" />} onClick={handleSubmit(onSubmit)} loading={saving}>
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 space-y-5">
              <h3 className="text-lg font-semibold font-heading text-text-primary">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Seva Name" placeholder="e.g., Rudra Abhishekam" error={errors.name?.message as string} {...register("name")} />
                <Input label="Slug" placeholder="rudra-abhishekam" error={errors.slug?.message as string} {...register("slug")} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary">Category</label>
                  <select {...register("categoryId")} className="h-11 w-full rounded-lg border border-border bg-warm-white dark:bg-bg-secondary px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary">
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-xs text-red-500">{String(errors.categoryId.message ?? "")}</p>}
                </div>
                <Input label="Short Description" placeholder="Brief description" error={errors.shortDescription?.message as string} {...register("shortDescription")} />
              </div>
              <RichEditor label="Description" value={watch("description") || ""} onChange={(val) => setValue("description", val)} error={errors.description?.message as string} minHeight="250px" />
            </Card>

            <Card className="p-6 space-y-5">
              <h3 className="text-lg font-semibold font-heading text-text-primary">Pricing & Duration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input label="Price (₹)" type="number" placeholder="2500" error={errors.price?.message as string} {...register("price")} />
                <Input label="Original Price (₹)" type="number" placeholder="3000" error={errors.originalPrice?.message as string} {...register("originalPrice")} />
                <Input label="Duration (mins)" type="number" placeholder="60" error={errors.duration?.message as string} {...register("duration")} />
                <Input label="Booking Notice (hrs)" type="number" placeholder="24" error={errors.bookingNotice?.message as string} {...register("bookingNotice")} />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold font-heading text-text-primary">Rules</h3>
              {rules.map((rule, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={rule} onChange={(e) => setRules((p) => p.map((r, j) => (j === i ? e.target.value : r)))} placeholder={`Rule ${i + 1}`} />
                  {rules.length > 1 && (
                    <button type="button" onClick={() => setRules((p) => p.filter((_, j) => j !== i))} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" iconLeft={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>} onClick={() => setRules((p) => [...p, ""])}>Add Rule</Button>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold font-heading text-text-primary">Special Instructions</h3>
              {instructions.map((inst, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={inst} onChange={(e) => setInstructions((p) => p.map((r, j) => (j === i ? e.target.value : r)))} placeholder={`Instruction ${i + 1}`} />
                  {instructions.length > 1 && (
                    <button type="button" onClick={() => setInstructions((p) => p.filter((_, j) => j !== i))} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" iconLeft={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>} onClick={() => setInstructions((p) => [...p, ""])}>Add Instruction</Button>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold font-heading text-text-primary">Settings</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register("isActive")} className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary" />
                <div><p className="text-sm font-medium text-text-primary">Active</p><p className="text-xs text-text-muted">Available for booking</p></div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register("isSpecial")} className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary" />
                <div><p className="text-sm font-medium text-text-primary">Special Seva</p><p className="text-xs text-text-muted">Featured seva</p></div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register("requiresApproval")} className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary" />
                <div><p className="text-sm font-medium text-text-primary">Requires Approval</p><p className="text-xs text-text-muted">Admin approval needed</p></div>
              </label>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-semibold font-heading text-text-primary">Image</h3>
              <ImageUpload images={images} onChange={setImages} maxImages={5} label="Seva Images" />
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}



