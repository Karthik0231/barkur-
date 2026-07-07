"use client"

import { useState, useRef, useCallback, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Image as ImageIcon, GripVertical, FileImage } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ImageItem {
  id: string
  url: string
  file?: File
  alt?: string
  isFeatured?: boolean
}

interface ImageUploadProps {
  images: ImageItem[]
  onChange: (images: ImageItem[]) => void
  maxImages?: number
  maxSizeMB?: number
  accept?: string
  label?: string
  error?: string
  helperText?: string
  className?: string
  featured?: boolean
  draggable?: boolean
  aspectRatio?: string
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]

export function ImageUpload({
  images,
  onChange,
  maxImages = 10,
  maxSizeMB = 5,
  accept = ".jpg,.jpeg,.png,.webp,.gif,.avif",
  label = "Upload Images",
  error,
  helperText,
  className,
  featured = false,
  draggable = true,
  aspectRatio = "4/3",
}: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragItemRef = useRef<number | null>(null)
  const dragOverItemRef = useRef<number | null>(null)

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const remaining = maxImages - images.length
      if (remaining <= 0) return

      const fileArray = Array.from(files).slice(0, remaining)

      const validFiles = fileArray.filter((file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) return false
        if (file.size > maxSizeMB * 1024 * 1024) return false
        return true
      })

      if (validFiles.length === 0) return

      setUploading(true)

      const newImages: ImageItem[] = await Promise.all(
        validFiles.map(
          (file) =>
            new Promise<ImageItem>((resolve) => {
              const reader = new FileReader()
              reader.onload = (e) => {
                resolve({
                  id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                  url: e.target?.result as string,
                  file,
                  alt: file.name.replace(/\.[^/.]+$/, ""),
                })
              }
              reader.readAsDataURL(file)
            }),
        ),
      )

      const updated = [...images, ...newImages]
      if (featured && updated.length > 0 && !updated.some((img) => img.isFeatured)) {
        updated[0].isFeatured = true
      }

      onChange(updated)
      setUploading(false)
    },
    [images, maxImages, maxSizeMB, featured, onChange],
  )

  const removeImage = useCallback(
    (id: string) => {
      const filtered = images.filter((img) => img.id !== id)
      if (featured && filtered.length > 0 && !filtered.some((img) => img.isFeatured)) {
        filtered[0].isFeatured = true
      }
      onChange(filtered)
    },
    [images, onChange, featured],
  )

  const setFeatured = useCallback(
    (id: string) => {
      onChange(
        images.map((img) => ({
          ...img,
          isFeatured: img.id === id,
        })),
      )
    },
    [images, onChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleDragStart = (index: number) => {
    dragItemRef.current = index
  }

  const handleDragEnter = (index: number) => {
    dragOverItemRef.current = index
  }

  const handleDragEnd = () => {
    if (dragItemRef.current === null || dragOverItemRef.current === null) return
    const updated = [...images]
    const [dragged] = updated.splice(dragItemRef.current, 1)
    updated.splice(dragOverItemRef.current, 0, dragged)
    onChange(updated)
    dragItemRef.current = null
    dragOverItemRef.current = null
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-sm font-medium text-text-primary">{label}</label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer",
          dragOver
            ? "border-secondary bg-secondary/5 scale-[1.02]"
            : "border-border hover:border-secondary/50 hover:bg-bg-secondary/50",
          error && "border-red-500",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
            <p className="text-sm text-text-muted">Uploading...</p>
          </div>
        ) : (
          <>
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-secondary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-text-primary">
                Drop images here or click to browse
              </p>
              <p className="text-xs text-text-muted mt-1">
                PNG, JPG, WebP up to {maxSizeMB}MB ({images.length}/{maxImages})
              </p>
            </div>
          </>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
          <AnimatePresence>
            {images.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className={cn(
                  "relative group rounded-xl overflow-hidden border border-border bg-bg-secondary",
                  img.isFeatured && "ring-2 ring-secondary",
                )}
                style={{ aspectRatio }}
                draggable={draggable}
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <img
                  src={img.url || "/placeholder.svg"}
                  alt={img.alt || "Uploaded image"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {featured && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFeatured(img.id)
                      }}
                      className={cn(
                        "p-1.5 rounded-lg text-xs font-medium transition-all",
                        img.isFeatured
                          ? "bg-secondary text-dark-slate"
                          : "bg-white/90 text-text-primary hover:bg-white",
                      )}
                    >
                      Featured
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(img.id)
                    }}
                    className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                {draggable && (
                  <div className="absolute top-1 left-1 p-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-3.5 w-3.5" />
                  </div>
                )}
                {img.isFeatured && (
                  <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-secondary text-dark-slate text-[10px] font-semibold">
                    Featured
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-xs text-text-muted">{helperText}</p>
      )}
    </div>
  )
}
