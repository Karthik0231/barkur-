"use client"

import Link from "next/link"
import { ChevronRight, User } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const committeeMembers = [
  { name: "Sri. Ramachandra Bhat", role: "President", bio: "Leading the temple administration with decades of dedicated service and spiritual guidance." },
  { name: "Sri. Narayana Acharya", role: "Vice President", bio: "Experienced administrator overseeing temple operations and development projects." },
  { name: "Sri. Gopala Krishna", role: "Secretary", bio: "Managing day-to-day affairs, correspondence, and committee coordination." },
  { name: "Sri. Venkatesh Rao", role: "Joint Secretary", bio: "Assisting in administrative functions and community outreach programs." },
  { name: "Sri. Suresh Kamath", role: "Treasurer", bio: "Managing temple finances, donations, and financial planning with transparency." },
  { name: "Sri. Mohan Shenoy", role: "Member", bio: "Contributing to temple development and maintenance initiatives." },
]

const trustees = [
  { name: "Sri. Srinivasa Hegde", role: "Managing Trustee", bio: "Oversees the trust's operations and long-term strategic planning for the temple." },
  { name: "Smt. Lakshmi Bhat", role: "Trustee", bio: "Brings valuable perspective on community needs and women's participation in temple activities." },
  { name: "Sri. Krishna Murthy", role: "Trustee", bio: "Expertise in legal and regulatory compliance for temple trust management." },
  { name: "Sri. Padmanabha Upadhyaya", role: "Trustee", bio: "Specializes in educational initiatives and the Sanskrit Vidyapeetha programs." },
]

const priests = [
  { name: "Sri. Subrahmanya Bhat", role: "Chief Priest", bio: "Performing daily rituals and special ceremonies with deep Vedic knowledge spanning over 30 years." },
  { name: "Sri. Raghunatha Bhat", role: "Assistant Priest", bio: "Assisting in daily poojas and specialized rituals with expertise in Vedic chanting." },
  { name: "Sri. Vasudeva Bhat", role: "Priest", bio: "Specializing in abhishekams and homams, serving the temple with devotion." },
]

const staff = [
  { name: "Sri. Manjunath", role: "Administrative Officer", bio: "Managing temple office operations, bookings, and devotee services." },
  { name: "Sri. Purushottama", role: "Maintenance Supervisor", bio: "Ensuring the temple premises are well-maintained and clean at all times." },
  { name: "Smt. Sudha", role: "Accountant", bio: "Handling financial records, donation receipts, and daily accounting." },
  { name: "Sri. Harish", role: "Security Supervisor", bio: "Coordinating security arrangements for the temple and during festivals." },
]

function ProfileCard({ person, index }: { person: typeof committeeMembers[0]; index: number }) {
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

function Section({ title, subtitle, people, id }: { title: string; subtitle?: string; people: typeof committeeMembers; id: string }) {
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
  return (
    <div className="min-h-screen">
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Temple Administration
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Committee
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Dedicated individuals guiding the temple's spiritual and administrative affairs with devotion and integrity.
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
            <span className="text-text-primary font-medium">Committee</span>
          </div>

          <div className="space-y-24">
            <Section
              id="committee"
              title="Committee Members"
              subtitle="The temple committee oversees all aspects of temple management and development."
              people={committeeMembers}
            />
            <Section
              id="trustees"
              title="Board of Trustees"
              subtitle="The trust board ensures the temple's resources are managed responsibly for the benefit of the community."
              people={trustees}
            />
            <Section
              id="priests"
              title="Priests"
              subtitle="Our dedicated priests perform daily rituals and ceremonies with deep Vedic knowledge and devotion."
              people={priests}
            />
            <Section
              id="staff"
              title="Temple Staff"
              subtitle="Support staff ensuring smooth operation of temple services and facilities."
              people={staff}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
