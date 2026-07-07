"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Edit3, Eye, Globe, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { RichEditor } from "@/components/admin/rich-editor"
import { ImageUpload, type ImageItem } from "@/components/admin/image-upload"
import toast from "react-hot-toast"

interface PageContent {
  id: string
  page: string
  section: string
  title: string
  subtitle: string
  content: string
  isActive: boolean
  sortOrder: number
}

const pages = [
  { id: "home", name: "Home Page", sections: ["Hero", "Stats", "About", "Sevas", "Festivals", "Testimonials", "Donations", "Contact", "Newsletter"] },
  { id: "about", name: "About Us", sections: ["History", "Architecture", "Deity", "Sub Deities", "Staff", "Committee"] },
  { id: "sevas", name: "Sevas", sections: ["Header", "Categories", "Special Sevas"] },
  { id: "contact", name: "Contact", sections: ["Header", "Form", "Map", "Info"] },
  { id: "donations", name: "Donations", sections: ["Header", "Campaigns", "Form"] },
  { id: "gallery", name: "Gallery", sections: ["Header", "Categories"] },
  { id: "footer", name: "Footer", sections: ["Links", "Social", "Copyright"] },
]

const sampleContent: Record<string, PageContent> = {
  "home-hero": { id: "pc1", page: "home", section: "Hero", title: "Sri Kalikamba Temple", subtitle: "Discover the divine grace of the ancient temple in Barkur", content: "<p>Welcome to Sri Kalikamba Temple, a sacred spiritual destination...</p>", isActive: true, sortOrder: 1 },
  "home-stats": { id: "pc2", page: "home", section: "Stats", title: "Temple at a Glance", subtitle: "Our legacy in numbers", content: "<p>Centuries of spiritual service...</p>", isActive: true, sortOrder: 2 },
}

export default function PagesPage() {
  const [activePage, setActivePage] = useState(pages[0].id)
  const [activeSection, setActiveSection] = useState(pages[0].sections[0])
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState(false)
  const [editorContent, setEditorContent] = useState(sampleContent["home-hero"]?.content || "")
  const [pageTitle, setPageTitle] = useState(sampleContent["home-hero"]?.title || "")
  const [pageSubtitle, setPageSubtitle] = useState(sampleContent["home-hero"]?.subtitle || "")
  const [images, setImages] = useState<ImageItem[]>([])

  const currentPage = pages.find((p) => p.id === activePage)
  const contentKey = `${activePage}-${activeSection.toLowerCase().replace(/\s+/g, "-")}`
  const currentContent = sampleContent[contentKey]

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success(`Content saved for ${activeSection}`)
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Page Content</h1>
          <p className="text-sm text-text-muted mt-1">Manage content for all public pages</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Save className="h-4 w-4" />} onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
      </div>

      <div className="flex gap-6">
        <div className="hidden lg:flex flex-col gap-1 w-48 shrink-0">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => { setActivePage(page.id); setActiveSection(page.sections[0]) }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                activePage === page.id ? "bg-secondary/10 text-secondary" : "text-text-muted hover:text-text-primary hover:bg-bg-secondary",
              )}
            >
              <Globe className="h-4 w-4" />
              {page.name}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold font-heading text-text-primary">{currentPage?.name}</h3>
                <p className="text-sm text-text-muted">Manage content sections</p>
              </div>
              <div className="flex items-center gap-2">
                {currentPage?.sections.map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                      activeSection === section ? "bg-secondary text-dark-slate" : "bg-bg-secondary text-text-muted hover:text-text-primary",
                    )}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Badge variant="subtle" size="sm">{activePage?.toUpperCase()}</Badge>
                <Badge variant="primary" size="sm">{activeSection}</Badge>
                {currentContent && <StatusBadge status={currentContent.isActive ? "ACTIVE" : "INACTIVE"} size="xs" />}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Section Title" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Section title..." />
                <Input label="Subtitle" value={pageSubtitle} onChange={(e) => setPageSubtitle(e.target.value)} placeholder="Section subtitle..." />
              </div>

              <RichEditor
                label="Content"
                value={editorContent}
                onChange={setEditorContent}
                placeholder="Edit page content..."
                minHeight="300px"
              />

              <ImageUpload
                images={images}
                onChange={setImages}
                maxImages={3}
                label="Section Images"
              />

              <div className="flex justify-end pt-4 border-t border-border">
                <Button variant="primary" size="sm" iconLeft={<Save className="h-4 w-4" />} onClick={handleSave} loading={saving}>
                  Save {activeSection}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: unknown[]) { return inputs.filter(Boolean).join(" ") }
