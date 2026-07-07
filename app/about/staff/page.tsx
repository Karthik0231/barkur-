"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, User, Search } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const staffMembers = [
  { name: "Sri. Subrahmanya Bhat", role: "Chief Priest", department: "Priests", experience: "30+ years" },
  { name: "Sri. Raghunatha Bhat", role: "Assistant Priest", department: "Priests", experience: "20 years" },
  { name: "Sri. Vasudeva Bhat", role: "Priest", department: "Priests", experience: "15 years" },
  { name: "Sri. Manjunath", role: "Administrative Officer", department: "Administration", experience: "12 years" },
  { name: "Smt. Sudha", role: "Accountant", department: "Administration", experience: "8 years" },
  { name: "Sri. Purushottama", role: "Maintenance Supervisor", department: "Maintenance", experience: "18 years" },
  { name: "Sri. Harish", role: "Security Supervisor", department: "Security", experience: "10 years" },
  { name: "Smt. Lakshmi", role: "Cleanliness Staff", department: "Maintenance", experience: "6 years" },
  { name: "Sri. Ganesh", role: "Electrician", department: "Maintenance", experience: "9 years" },
  { name: "Sri. Ramesh", role: "Gardener", department: "Maintenance", experience: "14 years" },
  { name: "Smt. Parvati", role: "Kitchen Staff", department: "Kitchen", experience: "7 years" },
  { name: "Sri. Ananda", role: "Prasada Manager", department: "Kitchen", experience: "11 years" },
]

const departments = ["All", ...new Set(staffMembers.map((s) => s.department))]

export default function StaffPage() {
  const [activeDept, setActiveDept] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = staffMembers.filter((member) => {
    const matchesDept = activeDept === "All" || member.department === activeDept
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDept && matchesSearch
  })

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Temple Personnel
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Staff Directory
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              The dedicated team that serves the temple and its devotees with devotion and care.
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/about" className="hover:text-secondary transition-colors">About</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Staff</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title="Temple Staff"
              subtitle="Meet the dedicated individuals who serve at Sri Kalikamba Temple."
            />
          </AnimatedSection>

          <div className="flex flex-col sm:flex-row gap-4 mt-12 mb-8">
            <div className="flex-1">
              <Input
                iconLeft={<Search className="h-4 w-4" />}
                placeholder="Search by name or role..."
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
                  {dept}
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
                    <Badge variant="default" size="xs">{member.experience}</Badge>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-text-muted text-lg">No staff members found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
