"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Save, Calendar, Video, Users, Image, Loader2, Edit2, Upload, X as XIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"

interface AlankaraEntry {
  id: string
  date: string
  videoUrl: string
  specialNote: string
  partyNames: string[]
  imageUrl: string | null
  isActive: boolean
  createdAt: string
}

export default function DailyAlankaraAdmin() {
  const [entries, setEntries] = useState<AlankaraEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0])
  const [videoUrl, setVideoUrl] = useState("")
  const [specialNote, setSpecialNote] = useState("")
  const [partyNames, setPartyNames] = useState<string[]>([""])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isActive, setIsActive] = useState(true)

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/daily-alankara?limit=30")
      const json = await res.json()
      if (json.success) {
        setEntries(json.data.alankaras || [])
      }
    } catch {
      toast.error("Failed to load entries")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const resetForm = () => {
    setEditingId(null)
    setDate(new Date().toISOString().split("T")[0])
    setVideoUrl("")
    setSpecialNote("")
    setPartyNames([""])
    setImageUrl(null)
    setIsActive(true)
  }

  const loadEntry = (entry: AlankaraEntry) => {
    setEditingId(entry.id)
    setDate(entry.date.split("T")[0])
    setVideoUrl(entry.videoUrl || "")
    setSpecialNote(entry.specialNote || "")
    setPartyNames(entry.partyNames.length > 0 ? [...entry.partyNames] : [""])
    setImageUrl(entry.imageUrl || null)
    setIsActive(entry.isActive)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB")
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "daily-alankara")

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (data.url) {
        setImageUrl(data.url)
        toast.success("Image uploaded!")
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const addPartyName = () => setPartyNames([...partyNames, ""])
  const removePartyName = (index: number) => {
    if (partyNames.length <= 1) return
    setPartyNames(partyNames.filter((_, i) => i !== index))
  }
  const updatePartyName = (index: number, value: string) => {
    const updated = [...partyNames]
    updated[index] = value
    setPartyNames(updated)
  }

  const handleSubmit = async () => {
    if (!date) { toast.error("Date is required"); return }

    setSaving(true)
    try {
      const payload = {
        id: editingId || undefined,
        date,
        videoUrl: videoUrl.trim() || null,
        specialNote: specialNote.trim() || null,
        partyNames: partyNames.filter((n) => n.trim()),
        imageUrl: imageUrl || null,
        isActive,
      }

      const method = editingId ? "PUT" : "POST"
      const res = await fetch("/api/daily-alankara", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)

      toast.success(editingId ? "Updated successfully!" : "Created successfully!")
      resetForm()
      fetchEntries()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return
    try {
      const res = await fetch("/api/daily-alankara", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      toast.success("Deleted!")
      fetchEntries()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">Daily Alankara & Seva</h1>
        <p className="text-sm text-text-muted mt-1">Manage daily alankara images, video, special notes, and nitya pooja seva parties</p>
      </div>

      {/* Form */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            {editingId ? <Edit2 className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
          </div>
          <h2 className="text-lg font-heading font-bold text-text-primary">
            {editingId ? "Edit Entry" : "Add New Entry"}
          </h2>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="text-sm font-medium text-text-primary mb-2 block">Alankara Image</label>
          {imageUrl ? (
            <div className="relative inline-block">
              <img src={imageUrl} alt="Alankara" className="w-48 h-32 object-cover rounded-xl border border-border" />
              <button
                onClick={() => setImageUrl(null)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-48 h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-bg-secondary/50 flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              {uploadingImage ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-text-muted group-hover:text-primary transition-colors" />
                  <p className="text-xs text-text-muted mt-1">Click to upload</p>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-text-primary mb-1.5 block">Date *</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              iconLeft={<Calendar className="h-4 w-4" />}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary mb-1.5 block">Video URL (YouTube embed)</label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              iconLeft={<Video className="h-4 w-4" />}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-text-primary mb-1.5 block">Current Day Special</label>
          <textarea
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
            rows={3}
            placeholder="Enter today's special pooja, event, or notice..."
            className="w-full rounded-xl border border-border bg-warm-white p-3 text-sm text-text-primary placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus-visible:outline-none transition-all resize-none"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-text-primary flex items-center gap-2">
              <Users className="h-4 w-4" />
              Nitya Pooja Seva Parties
            </label>
            <Button variant="outline" size="sm" onClick={addPartyName} iconLeft={<Plus className="h-3.5 w-3.5" />}>
              Add Party
            </Button>
          </div>
          <div className="space-y-2">
            {partyNames.map((name, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={name}
                  onChange={(e) => updatePartyName(idx, e.target.value)}
                  placeholder={`Party name ${idx + 1}`}
                  inputSize="sm"
                />
                {partyNames.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => removePartyName(idx)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-secondary"
          />
          <label htmlFor="isActive" className="text-sm text-text-primary">Active (visible to public)</label>
        </div>

        <div className="flex gap-3">
          <Button variant="primary" onClick={handleSubmit} loading={saving} iconLeft={<Save className="h-4 w-4" />}>
            {editingId ? "Update Entry" : "Create Entry"}
          </Button>
          {editingId && (
            <Button variant="ghost" onClick={resetForm}>Cancel Edit</Button>
          )}
        </div>
      </Card>

      {/* Entries List */}
      <Card variant="elevated" padding="lg">
        <h2 className="text-lg font-heading font-bold text-text-primary mb-4">Recent Entries</h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-text-muted">No entries yet</div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-bg-secondary/50 border border-border/50"
              >
                {entry.imageUrl && (
                  <img src={entry.imageUrl} alt="Alankara" className="w-20 h-16 object-cover rounded-lg shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-text-primary">
                      {new Date(entry.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <Badge variant={entry.isActive ? "success" : "default"} size="sm">
                      {entry.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  {entry.specialNote && (
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">{entry.specialNote}</p>
                  )}
                  {entry.partyNames.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.partyNames.map((name, i) => (
                        <Badge key={i} variant="secondary" size="sm">{name}</Badge>
                      ))}
                    </div>
                  )}
                  {entry.videoUrl && (
                    <p className="text-xs text-text-muted mt-1 truncate">📹 Video attached</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => loadEntry(entry)}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(entry.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
