"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, User, Search } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

export default function StaffPage() {
  const { t } = useTranslation()
  const [staffMembers, setStaffMembers] = useState<{ name: string; role: string; department: string }[]>([])
  const [activeDept, setActiveDept] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetch("/api/staff")
      .then((r) => r.json())
      .then((res) => {
        const list = res.data?.staff || res.data || []
        if (Array.isArray(list)) {
          setStaffMembers(
            list.map((d: any) => ({
              name: d.name,
              role: d.role,
              department: d.designation,
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  const departments = ["All", ...new Set(staffMembers.map((s) => s.department))]

  const filtered = staffMembers.filter((member) => {
    const matchesDept = activeDept === "All" || member.department === activeDept
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDept && matchesSearch
  })

  return (
    <div className="min-h-screen">
      <PageBanner
        title={t("pages.aboutStaff.title")}
        subtitle={t("pages.aboutStaff.subtitle")}
        eyebrow={t("pages.aboutStaff.eyebrow")}
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/about" className="hover:text-secondary transition-colors">{t("nav.about")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.staff")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title={t("sections.aboutStaffS1Title")}
              subtitle={t("sections.aboutStaffS1Sub")}
            />
          </AnimatedSection>

          <div className="flex flex-col sm:flex-row gap-4 mt-12 mb-8">
            <div className="flex-1">
              <Input
                iconLeft={<Search className="h-4 w-4" />}
                placeholder={t("common.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveDept(dept)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeDept === dept
                      ? "bg-primary text-warm-white shadow-md"
                      : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                  }`}
                >
                  {dept === "All" ? t("common.filterAll") : dept}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((member, index) => (
              <AnimatedSection key={member.name} delay={index * 0.03}>
                <Card variant="glass" className="p-6 h-full" hover>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-heading font-bold text-primary truncate">{member.name}</h3>
                      <p className="text-sm text-text-secondary truncate">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                    <Badge variant="primary" size="xs">{member.department}</Badge>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-text-muted text-lg">{t("common.noResults")}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
