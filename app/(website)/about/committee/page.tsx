"use client"

import Link from "next/link"
import { ChevronRight, User } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageBanner } from "@/components/PageBanner"
import { useState, useEffect } from "react"
import { useTranslation } from "@/lib/i18n"

interface Member {
  name: string
  role: string
  bio: string
  type: string
}


function ProfileCard({ person, index }: { person: Member; index: number }) {
  return (
    <AnimatedSection delay={index * 0.05}>
      <Card variant="elevated" className="p-6 lg:p-8 h-full text-center" hover>
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-secondary/20 flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-secondary" />
        </div>
        <h3 className="text-xl font-heading font-bold text-primary">{person.name}</h3>
        <Badge variant="secondary" size="sm" className="mt-2">{person.role}</Badge>
        <p className="text-text-secondary text-sm mt-3 leading-relaxed">{person.bio}</p>
      </Card>
    </AnimatedSection>
  )
}

function Section({ title, subtitle, people, id }: { title: string; subtitle?: string; people: Member[]; id: string }) {
  return (
    <section id={id} className="scroll-mt-24">
      <AnimatedSection>
        <SectionHeading title={title} subtitle={subtitle} />
      </AnimatedSection>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {people.map((person, index) => (
          <ProfileCard key={person.name} person={person} index={index} />
        ))}
      </div>
    </section>
  )
}

export default function CommitteePage() {
  const { t } = useTranslation()
  const [members, setMembers] = useState<Member[]>([])
  useEffect(() => {
    fetch("/api/committee")
      .then((r) => r.json())
      .then((data) =>
        setMembers(
          data.map((d: any) => ({
            name: d.name,
            role: d.role,
            bio: d.biography,
            type: d.type,
          }))
        )
      )
  }, [])

  const committeeMembers = members.filter((m) => m.type === "MEMBER")
  const trustees = members.filter((m) => m.type === "TRUSTEE")
  const priests = members.filter((m) => m.type === "PRIEST")
  const staff = members.filter((m) => m.type === "STAFF" || m.type === "VOLUNTEER")

  return (
    <div className="min-h-screen">
      <PageBanner
        title={t("pages.aboutCommittee.title")}
        subtitle={t("pages.aboutCommittee.subtitle")}
        eyebrow={t("pages.aboutCommittee.eyebrow")}
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/about" className="hover:text-secondary transition-colors">{t("nav.about")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.committee")}</span>
          </div>

          <div className="space-y-24">
            <Section
              id="committee"
              title={t("sections.aboutCommitteeS1Title")}
              subtitle={t("sections.aboutCommitteeS1Sub")}
              people={committeeMembers}
            />
            <Section
              id="trustees"
              title={t("sections.aboutCommitteeS2Title")}
              subtitle={t("sections.aboutCommitteeS2Sub")}
              people={trustees}
            />
            <Section
              id="priests"
              title={t("sections.aboutCommitteeS3Title")}
              subtitle={t("sections.aboutCommitteeS3Sub")}
              people={priests}
            />
            <Section
              id="staff"
              title={t("sections.aboutCommitteeS4Title")}
              subtitle={t("sections.aboutCommitteeS4Sub")}
              people={staff}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
