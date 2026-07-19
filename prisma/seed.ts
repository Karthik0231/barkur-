import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

// prisma: { seed: "tsx prisma/seed.ts" }

async function main() {
  console.log("Seeding database...")

  // ─── USERS ───────────────────────────────────────────────────────────────────

  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@kalikambatemple.org" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@kalikambatemple.org",
      phone: "9999999999",
      password: adminPassword,
      role: "ADMIN",
      isActive: true,
    },
  })
  console.log("Admin user seeded")

  const superAdminPassword = await bcrypt.hash("superadmin123", 10)
  await prisma.user.upsert({
    where: { email: "superadmin@kalikambatemple.org" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@kalikambatemple.org",
      phone: "8888888888",
      password: superAdminPassword,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  })
  console.log("Super admin user seeded")

  // ─── SEVA CATEGORIES ─────────────────────────────────────────────────────────

  const categorySlugs: Record<string, string> = {}
  const categories = [
    { name: "Daily Poojas", slug: "daily-poojas", description: "Nitya poojas performed every day at the temple", sortOrder: 1 },
    { name: "Special Sevas", slug: "special-sevas", description: "Special archana and offering sevas for devotees", sortOrder: 2 },
    { name: "Homas & Yagnas", slug: "homas-yagnas", description: "Sacred fire rituals for blessings and prosperity", sortOrder: 3 },
    { name: "Shashwatha Sevas", slug: "shashwatha-sevas", description: "Annual recurring sevas for permanent blessings", sortOrder: 4 },
    { name: "Rituals & Samskaras", slug: "rituals-samskaras", description: "Traditional rites and ceremonies for life events", sortOrder: 5 },
  ]

  for (const cat of categories) {
    const result = await prisma.sevaCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, createdBy: admin.id },
    })
    categorySlugs[cat.slug] = result.id
  }
  console.log("Seva categories seeded")

  // ─── SEVAS ───────────────────────────────────────────────────────────────────

  const sevas = [
    {
      name: "Nitya Pooja",
      slug: "nitya-pooja",
      categorySlug: "daily-poojas",
      description: "Daily morning pooja to the presiding deity with vedic mantras and offerings",
      shortDescription: "Daily vedic pooja to the deity",
      price: 151,
      duration: 60,
      maxDevotees: 25,
      minDevotees: 1,
      bookingNotice: 24,
      sortOrder: 1,
    },
    {
      name: "Abhishekam",
      slug: "abhishekam",
      categorySlug: "daily-poojas",
      description: "Holy bathing of the deity with milk, curd, honey, ghee, and panchamrita",
      shortDescription: "Sacred bathing ritual of the deity",
      price: 501,
      duration: 90,
      maxDevotees: 15,
      minDevotees: 1,
      bookingNotice: 48,
      sortOrder: 2,
    },
    {
      name: "Archana",
      slug: "archana",
      categorySlug: "daily-poojas",
      description: "Offering of flowers and chanted prayers with 108 sacred names of the deity",
      shortDescription: "Floral offering with 108 divine names",
      price: 251,
      duration: 30,
      maxDevotees: 50,
      minDevotees: 1,
      bookingNotice: 12,
      sortOrder: 3,
    },
    {
      name: "Sahasranama Archana",
      slug: "sahasranama-archana",
      categorySlug: "special-sevas",
      description: "Recitation of 1000 sacred names of the deity with flower offerings",
      shortDescription: "Thousand-name chanting with flowers",
      price: 1001,
      duration: 60,
      maxDevotees: 25,
      minDevotees: 1,
      bookingNotice: 48,
      sortOrder: 1,
    },
    {
      name: "Kumkumarchana",
      slug: "kumkumarchana",
      categorySlug: "special-sevas",
      description: "Offering of kumkuma to the goddess with vedic hymns for prosperity and protection",
      shortDescription: "Vermilion offering to the goddess",
      price: 751,
      duration: 45,
      maxDevotees: 30,
      minDevotees: 1,
      bookingNotice: 24,
      sortOrder: 2,
    },
    {
      name: "Vastra Samarpane",
      slug: "vastra-samarpane",
      categorySlug: "special-sevas",
      description: "Offering of new silk clothes to the deity on behalf of the devotee",
      shortDescription: "Offering of silk garments to the deity",
      price: 501,
      duration: 30,
      maxDevotees: 10,
      minDevotees: 1,
      bookingNotice: 48,
      sortOrder: 3,
    },
    {
      name: "Ganapathi Homa",
      slug: "ganapathi-homa",
      categorySlug: "homas-yagnas",
      description: "Fire ritual invoking Lord Ganapathi to remove obstacles and bestow success",
      shortDescription: "Fire ritual for obstacle removal",
      price: 1501,
      duration: 120,
      maxDevotees: 20,
      minDevotees: 3,
      bookingNotice: 72,
      sortOrder: 1,
      rules: ["Participants to sit through the homa", "Traditional attire mandatory"],
    },
    {
      name: "Mrutyunjaya Homa",
      slug: "mrutyunjaya-homa",
      categorySlug: "homas-yagnas",
      description: "Powerful fire ritual dedicated to Lord Shiva for health, longevity, and protection",
      shortDescription: "Homa for health and longevity",
      price: 2001,
      duration: 150,
      maxDevotees: 20,
      minDevotees: 3,
      bookingNotice: 72,
      sortOrder: 2,
      rules: ["Participants to observe fasting", "Traditional attire mandatory"],
    },
    {
      name: "Sudarshana Homa",
      slug: "sudarshana-homa",
      categorySlug: "homas-yagnas",
      description: "Fire ritual invoking Lord Sudarshana for victory over enemies and protection from negative forces",
      shortDescription: "Homa for protection and victory",
      price: 2501,
      duration: 150,
      maxDevotees: 15,
      minDevotees: 3,
      bookingNotice: 72,
      sortOrder: 3,
      rules: ["Participants to observe fasting", "Traditional attire mandatory"],
    },
    {
      name: "Shashwatha Nitya Pooja",
      slug: "shashwatha-nitya-pooja",
      categorySlug: "shashwatha-sevas",
      description: "Annual recurring daily pooja on behalf of the devotee and family for a year",
      shortDescription: "Year-long daily pooja subscription",
      price: 5001,
      maxDevotees: 100,
      minDevotees: 1,
      bookingNotice: 168,
      sortOrder: 1,
      isShashwatha: true,
      shashwathaType: "NITYA_POOJA",
      requiresApproval: true,
    },
    {
      name: "Shashwatha Navaratri Pooja",
      slug: "shashwatha-navaratri-pooja",
      categorySlug: "shashwatha-sevas",
      description: "Annual special pooja during the nine nights of Navaratri on behalf of the devotee",
      shortDescription: "Annual Navaratri pooja subscription",
      price: 10001,
      maxDevotees: 50,
      minDevotees: 1,
      bookingNotice: 168,
      sortOrder: 2,
      isShashwatha: true,
      shashwathaType: "NAVARATRI",
      requiresApproval: true,
    },
    {
      name: "Upanayana",
      slug: "upanayana",
      categorySlug: "rituals-samskaras",
      description: "Sacred thread ceremony for boys with full vedic rituals according to family tradition",
      shortDescription: "Sacred thread ceremony",
      price: 2501,
      duration: 180,
      maxDevotees: 50,
      minDevotees: 1,
      bookingNotice: 336,
      sortOrder: 1,
      requiresApproval: true,
    },
    {
      name: "Gruha Pravesha",
      slug: "gruha-pravesha",
      categorySlug: "rituals-samskaras",
      description: "Housewarming ceremony with vedic rituals to bless the new home and its occupants",
      shortDescription: "Housewarming ceremony",
      price: 3501,
      duration: 120,
      maxDevotees: 25,
      minDevotees: 3,
      bookingNotice: 336,
      sortOrder: 2,
      requiresApproval: true,
    },
    {
      name: "Satyanarayana Vrata",
      slug: "satyanarayana-vrata",
      categorySlug: "rituals-samskaras",
      description: "Vedic ritual dedicated to Lord Satyanarayana for prosperity, peace, and fulfillment of wishes",
      shortDescription: "Vow-keeping ritual for prosperity",
      price: 1501,
      duration: 120,
      maxDevotees: 30,
      minDevotees: 1,
      bookingNotice: 48,
      sortOrder: 3,
    },
  ]

  for (const seva of sevas) {
    await prisma.seva.upsert({
      where: { slug: seva.slug },
      update: {},
      create: {
        name: seva.name,
        slug: seva.slug,
        categoryId: categorySlugs[seva.categorySlug],
        description: seva.description,
        shortDescription: seva.shortDescription,
        price: seva.price,
        duration: seva.duration ?? null,
        maxDevotees: seva.maxDevotees ?? null,
        minDevotees: seva.minDevotees ?? null,
        rules: (seva as any).rules ? JSON.parse(JSON.stringify((seva as any).rules)) : null,
        isShashwatha: (seva as any).isShashwatha ?? false,
        shashwathaType: (seva as any).shashwathaType ?? null,
        requiresApproval: (seva as any).requiresApproval ?? false,
        bookingNotice: seva.bookingNotice,
        sortOrder: seva.sortOrder,
        createdBy: admin.id,
      },
    })
  }
  console.log("Sevas seeded")

  // ─── FESTIVALS ───────────────────────────────────────────────────────────────

  const festivals = [
    {
      name: "Makara Sankranti",
      slug: "makara-sankranti",
      description: "Harvest festival marking the sun's transit into Makara rasi. Special poojas and offerings to the Sun God.",
      shortDescription: "Harvest festival and Sun God worship",
      category: "Seasonal",
      date: new Date("2026-01-14"),
      isMultiDay: false,
      significance: "Marks the end of winter solstice and beginning of harvest season. Auspicious for charity and holy dip.",
      sortOrder: 1,
    },
    {
      name: "Maha Shivaratri",
      slug: "maha-shivaratri",
      description: "The great night of Lord Shiva observed with night-long vigil, abhishekam, and chanting of Rudram.",
      shortDescription: "Great night of Lord Shiva",
      category: "Major Festival",
      startDate: new Date("2026-02-15"),
      endDate: new Date("2026-02-16"),
      isMultiDay: true,
      significance: "Celebrates the divine marriage of Shiva and Parvati. Night-long vigil grants moksha.",
      sortOrder: 2,
    },
    {
      name: "Ugadi",
      slug: "ugadi",
      description: "Kannada New Year as per the lunar calendar. Special poojas and panchanga shravana.",
      shortDescription: "Kannada New Year",
      category: "Seasonal",
      date: new Date("2026-03-19"),
      isMultiDay: false,
      significance: "Welcoming the new year with bevu-bella (neem and jaggery) symbolizing life's dualities.",
      sortOrder: 3,
    },
    {
      name: "Sri Rama Navami",
      slug: "sri-rama-navami",
      description: "Birth anniversary of Lord Sri Rama celebrated with special poojas, bhajans, and cultural programs.",
      shortDescription: "Birth of Lord Rama",
      category: "Major Festival",
      date: new Date("2026-03-27"),
      isMultiDay: false,
      significance: "Celebrates the incarnation of Lord Vishnu as Sri Rama. Reading of Ramayana.",
      sortOrder: 4,
    },
    {
      name: "Akshaya Tritiya",
      slug: "akshaya-tritiya",
      description: "Auspicious third day of Vaishakha month. New ventures, purchases, and marriages are initiated.",
      shortDescription: "Auspicious day for new beginnings",
      category: "Seasonal",
      date: new Date("2026-04-19"),
      isMultiDay: false,
      significance: "Believed to bring eternal prosperity. Any investment made multiplies infinitely.",
      sortOrder: 5,
    },
    {
      name: "Guru Poornima",
      slug: "guru-poornima",
      description: "Full moon day dedicated to spiritual gurus and teachers. Special poojas and discourses.",
      shortDescription: "Honoring spiritual teachers",
      category: "Major Festival",
      date: new Date("2026-07-29"),
      isMultiDay: false,
      significance: "Birthday of Sage Vyasa. Day to honor one's guru and seek blessings.",
      sortOrder: 6,
    },
    {
      name: "Sri Krishna Janmashtami",
      slug: "sri-krishna-janmashtami",
      description: "Birth anniversary of Lord Krishna celebrated with midnight pooja, bhajans, and Dahi Handi.",
      shortDescription: "Birth of Lord Krishna",
      category: "Major Festival",
      startDate: new Date("2026-09-04"),
      endDate: new Date("2026-09-05"),
      isMultiDay: true,
      significance: "Celebrates the divine incarnation of Lord Vishnu as Sri Krishna. Midnight birth celebration.",
      sortOrder: 7,
    },
    {
      name: "Ganesha Chaturthi",
      slug: "ganesha-chaturthi",
      description: "Birth anniversary of Lord Ganesha with installation of idols and 10-day celebrations.",
      shortDescription: "Birth of Lord Ganesha",
      category: "Major Festival",
      startDate: new Date("2026-09-14"),
      endDate: new Date("2026-09-23"),
      isMultiDay: true,
      significance: "Lord Ganesha removes obstacles. Grand celebration with eco-friendly immersion on Ananta Chaturdashi.",
      sortOrder: 8,
    },
    {
      name: "Maha Navami",
      slug: "maha-navami",
      description: "Final day of Navaratri. Grand pooja of weapons and tools, Ayudha Pooja.",
      shortDescription: "Grand Navaratri finale",
      category: "Major Festival",
      date: new Date("2026-10-19"),
      isMultiDay: false,
      significance: "Victory of Goddess Durga over Mahishasura. Worship of implements and vehicles.",
      sortOrder: 9,
    },
    {
      name: "Deepavali",
      slug: "deepavali",
      description: "Festival of lights with Lakshmi pooja, rangoli, and bursting of crackers.",
      shortDescription: "Festival of lights",
      category: "Major Festival",
      startDate: new Date("2026-11-07"),
      endDate: new Date("2026-11-09"),
      isMultiDay: true,
      significance: "Victory of light over darkness. Naraka Chaturdashi and Lakshmi Pooja.",
      sortOrder: 10,
    },
    {
      name: "Karthika Poornima",
      slug: "karthika-poornima",
      description: "Full moon in Karthika month. Special deepa pooja and circumambulation of the temple.",
      shortDescription: "Full moon festival",
      category: "Seasonal",
      date: new Date("2026-11-24"),
      isMultiDay: false,
      significance: "Highly auspicious full moon. Lighting lamps in the temple brings immense merit.",
      sortOrder: 11,
    },
    {
      name: "Geeta Jayanti",
      slug: "geeta-jayanti",
      description: "Celebration of the day Lord Krishna taught the Bhagavad Geeta to Arjuna. Discourses and recitation.",
      shortDescription: "Birthday of Bhagavad Geeta",
      category: "Special",
      date: new Date("2026-12-24"),
      isMultiDay: false,
      significance: "Commemorates the divine discourse of Bhagavad Geeta. Mass recitation and study.",
      sortOrder: 12,
    },
  ]

  for (const festival of festivals) {
    await prisma.festival.upsert({
      where: { slug: festival.slug },
      update: {},
      create: {
        name: festival.name,
        slug: festival.slug,
        description: festival.description,
        shortDescription: festival.shortDescription,
        category: festival.category,
        date: festival.date ?? null,
        startDate: (festival as any).startDate ?? null,
        endDate: (festival as any).endDate ?? null,
        isMultiDay: festival.isMultiDay,
        significance: festival.significance,
        isFeatured: true,
        createdBy: admin.id,
      },
    })
  }
  console.log("Festivals seeded")

  // ─── COMMITTEES ──────────────────────────────────────────────────────────────

  const committeeMembers = [
    { name: "Sri K. S. Hegde", role: "President", type: "TRUSTEE" as const, sortOrder: 1 },
    { name: "Sri G. S. Acharya", role: "Vice President", type: "TRUSTEE" as const, sortOrder: 2 },
    { name: "Sri M. S. Bhat", role: "Secretary", type: "TRUSTEE" as const, sortOrder: 3 },
    { name: "Sri R. S. Nayak", role: "Joint Secretary", type: "TRUSTEE" as const, sortOrder: 4 },
    { name: "Sri H. S. Shetty", role: "Treasurer", type: "TRUSTEE" as const, sortOrder: 5 },
    { name: "Sri P. S. Pai", role: "Member", type: "MEMBER" as const, sortOrder: 6 },
    { name: "Sri D. S. Rao", role: "Member", type: "MEMBER" as const, sortOrder: 7 },
    { name: "Sri V. S. Kini", role: "Member", type: "MEMBER" as const, sortOrder: 8 },
    { name: "Sri S. S. Upadhyaya", role: "Member", type: "MEMBER" as const, sortOrder: 9 },
    { name: "Sri K. S. Acharya", role: "Priest Representative", type: "PRIEST" as const, sortOrder: 10 },
  ]

  for (const member of committeeMembers) {
    const exists = await prisma.committee.findFirst({ where: { name: member.name } })
    if (!exists) {
      await prisma.committee.create({ data: member })
    }
  }
  console.log("Committee members seeded")

  // ─── TEMPLE STAFF ────────────────────────────────────────────────────────────

  const staffMembers = [
    { name: "Sri K. S. Bhatta", role: "Chief Priest", designation: "Head Priest", type: "PRIEST" as const, sortOrder: 1 },
    { name: "Sri V. S. Sharma", role: "Priest", designation: "Senior Priest", type: "PRIEST" as const, sortOrder: 2 },
    { name: "Sri H. S. Rao", role: "Priest", designation: "Priest", type: "PRIEST" as const, sortOrder: 3 },
    { name: "Sri M. S. Hegde", role: "Assistant Priest", designation: "Junior Priest", type: "PRIEST" as const, sortOrder: 4 },
    { name: "Sri G. S. Nayak", role: "Executive Officer", designation: "CEO", type: "STAFF" as const, sortOrder: 5 },
    { name: "Sri R. S. Pai", role: "Office Manager", designation: "Manager", type: "STAFF" as const, sortOrder: 6 },
    { name: "Smt. L. S. Shetty", role: "Accountant", designation: "Senior Accountant", type: "STAFF" as const, sortOrder: 7 },
    { name: "Sri P. S. Kamath", role: "Admin Assistant", designation: "Administrative Officer", type: "STAFF" as const, sortOrder: 8 },
    { name: "Sri K. S. Shenoy", role: "Temple Caretaker", designation: "Caretaker", type: "STAFF" as const, sortOrder: 9 },
    { name: "Sri S. S. Acharya", role: "Volunteer Coordinator", designation: "Coordinator", type: "VOLUNTEER" as const, sortOrder: 10 },
  ]

  for (const staff of staffMembers) {
    const exists = await prisma.templeStaff.findFirst({ where: { name: staff.name } })
    if (!exists) {
      await prisma.templeStaff.create({ data: staff })
    }
  }
  console.log("Temple staff seeded")

  // ─── SUB DEITIES ─────────────────────────────────────────────────────────────

  const subDeities = [
    {
      name: "Sri Maha Ganapathi",
      slug: "sri-maha-ganapathi",
      description: "Lord Ganesha, the remover of obstacles, worshipped at the entrance of the main temple",
      significance: "Worshipped first in all rituals. Removes obstacles and grants wisdom.",
      templeLocation: "North-east corner of the main temple complex",
      sortOrder: 1,
    },
    {
      name: "Sri Subrahmanya",
      slug: "sri-subrahmanya",
      description: "Lord Subrahmanya (Muruga), the commander of the divine army, with his consorts Valli and Devasena",
      significance: "God of war and victory. Grants courage and destroys negativity.",
      templeLocation: "Southern shrine adjacent to the main temple",
      sortOrder: 2,
    },
    {
      name: "Sri Krishna",
      slug: "sri-krishna",
      description: "Lord Krishna, the divine cowherd and charioteer of the Bhagavad Geeta",
      significance: "Complete incarnation of Lord Vishnu. Symbol of love, compassion, and divine wisdom.",
      templeLocation: "Eastern side shrine within the temple complex",
      sortOrder: 3,
    },
    {
      name: "Sri Durga Parameshwari",
      slug: "sri-durga-parameshwari",
      description: "Goddess Durga, the mother goddess in her fierce form, slayer of Mahishasura",
      significance: "Protector against evil forces. Grants strength, courage, and liberation.",
      templeLocation: "Northern shrine facing the main deity",
      sortOrder: 4,
    },
    {
      name: "Sri Anjaneya",
      slug: "sri-anjaneya",
      description: "Lord Hanuman, the mighty vanara devotee of Lord Rama, symbol of devotion and strength",
      significance: "Embodiment of devotion and service. Protector against fear and evil spirits.",
      templeLocation: "South-west corner of the temple premises",
      sortOrder: 5,
    },
    {
      name: "Sri Chandramoulishwara",
      slug: "sri-chandramoulishwara",
      description: "Lord Shiva in his form adorned with the crescent moon on his matted locks",
      significance: "Represents the cyclical nature of time. Grants peace and destroys ego.",
      templeLocation: "Western side of the main temple sanctum",
      sortOrder: 6,
    },
    {
      name: "Sri Bhootanatha",
      slug: "sri-bhootanatha",
      description: "Lord Shiva as the lord of all beings and elements, protector of the temple boundaries",
      significance: "Guardian of the temple and its surroundings. Protects from negative energies.",
      templeLocation: "Outer prakara (boundary wall) of the temple",
      sortOrder: 7,
    },
    {
      name: "Sri Navagraha",
      slug: "sri-navagraha",
      description: "The nine planetary deities installed in a designated shrine for planetary blessings",
      significance: "Worship of the nine planets to mitigate doshas and receive cosmic blessings.",
      templeLocation: "Open-air platform in the north-east corner of the temple",
      sortOrder: 8,
    },
  ]

  for (const deity of subDeities) {
    await prisma.subDeity.upsert({
      where: { slug: deity.slug },
      update: {},
      create: deity,
    })
  }
  console.log("Sub deities seeded")

  // ─── FAQS ────────────────────────────────────────────────────────────────────

  const faqs = [
    { question: "What are the temple timings?", answer: "The temple is open from 5:00 AM to 12:00 PM and 4:00 PM to 8:30 PM daily. Special timings apply during festivals.", category: "Visiting", sortOrder: 1 },
    { question: "Is there a dress code for visiting the temple?", answer: "Traditional Indian attire is preferred. Men may wear dhoti or pants with shirt. Women are requested to wear saree, salwar kameez, or churidar.", category: "Visiting", sortOrder: 2 },
    { question: "Can I bring offerings from home?", answer: "Yes, devotees may bring flowers, fruits, coconut, and other traditional offerings. Please check with the temple staff for any restrictions during specific days.", category: "Visiting", sortOrder: 3 },
    { question: "How do I book a seva online?", answer: "You can book sevas through our website by selecting the desired seva, choosing a date, and completing the payment. A confirmation will be sent to your email.", category: "Sevas & Poojas", sortOrder: 4 },
    { question: "Can I cancel or reschedule a booking?", answer: "Bookings can be cancelled up to 48 hours before the scheduled time. Cancellation charges may apply. Refunds are processed within 7-10 working days.", category: "Sevas & Poojas", sortOrder: 5 },
    { question: "What is Shashwatha Seva?", answer: "Shashwatha Seva is an annual recurring pooja performed on your behalf every day (Nitya), during Navaratri, or on special occasions. A certificate is issued for the same.", category: "Sevas & Poojas", sortOrder: 6 },
    { question: "How can I donate to the temple?", answer: "Donations can be made online through our website, via bank transfer, or in person at the temple office. All donations are eligible for tax exemption under 80G.", category: "Donations", sortOrder: 7 },
    { question: "Are donations tax exempted?", answer: "Yes, donations made to Sri Kalikamba Temple are exempt under Section 80G of the Income Tax Act. You will receive a receipt with the necessary details.", category: "Donations", sortOrder: 8 },
    { question: "When is the annual temple festival?", answer: "The annual Brahmotsava is celebrated during the month of Phalguna (February-March). Please check our festival calendar for exact dates.", category: "Festivals", sortOrder: 9 },
    { question: "Can I participate in festival celebrations?", answer: "Absolutely! All devotees are welcome to participate in festival celebrations. Special sevas can be booked during festivals for personal participation.", category: "Festivals", sortOrder: 10 },
    { question: "Is the temple accessible for differently-abled visitors?", answer: "Yes, the temple has ramps and wheelchair accessibility at the main entrance. Assistance is available on request.", category: "General", sortOrder: 11 },
    { question: "Does the temple have parking facilities?", answer: "Yes, free parking is available for devotees. Two-wheeler and four-wheeler parking areas are separate and monitored by security.", category: "General", sortOrder: 12 },
  ]

  for (const faq of faqs) {
    const exists = await prisma.fAQ.findFirst({ where: { question: faq.question } })
    if (!exists) {
      await prisma.fAQ.create({ data: faq })
    }
  }
  console.log("FAQs seeded")

  // ─── ANNOUNCEMENTS ───────────────────────────────────────────────────────────

  const announcements = [
    { title: "Monthly Kruttanga Pooja", content: "Monthly Kruttanga Pooja will be held on the first Sunday of every month at 8:00 AM. Devotees may participate.", type: "EVENT" as const, isActive: true, isPopup: false },
    { title: "Temple Renovation Update", content: "The Raja Gopura renovation work has commenced. Devotees are requested to use the side entrance until further notice.", type: "INFO" as const, isActive: true, isPopup: true },
    { title: "Annadana Sponsorship", content: "Sponsor annadana for a day at just Rs. 5,001. Feed devotees and earn blessings. Contact temple office for details.", type: "INFO" as const, isActive: true, isPopup: false },
    { title: "Deepavali Special Poojas", content: "Special Deepavali pooja schedule: Naraka Chaturdashi early morning abhishekam at 5:00 AM, Lakshmi Pooja at 7:30 PM.", type: "EVENT" as const, isActive: true, isPopup: true },
    { title: "Volunteers Required for Brahmotsava", content: "Volunteers are needed for the upcoming Brahmotsava festival. Interested devotees may register at the temple office.", type: "URGENT" as const, isActive: true, isPopup: false },
    { title: "Security Advisory", content: "Devotees are requested not to leave valuables in vehicles. CCTV surveillance is active across the premises.", type: "WARNING" as const, isActive: true, isPopup: false },
  ]

  for (const announcement of announcements) {
    const exists = await prisma.announcement.findFirst({ where: { title: announcement.title } })
    if (!exists) {
      await prisma.announcement.create({
        data: {
          ...announcement,
          startDate: new Date("2026-01-01"),
          endDate: new Date("2026-12-31"),
          createdBy: admin.id,
        },
      })
    }
  }
  console.log("Announcements seeded")

  // ─── NEWS ────────────────────────────────────────────────────────────────────

  const newsItems = [
    {
      title: "Sri Kalikamba Temple Celebrates 50 Years of Brahmotsava",
      slug: "50-years-brahmotsava-2026",
      excerpt: "The historic Brahmotsava festival completes 50 years with grand celebrations planned throughout the week.",
      content: "The Sri Kalikamba Temple Trust announces the golden jubilee of the annual Brahmotsava festival. Special cultural programs, processions, and poojas have been planned. Devotees from across the state are expected to participate.",
      category: "Festival",
      source: "Temple Trust",
      isPublished: true,
      publishedAt: new Date("2026-02-01"),
    },
    {
      title: "New Digital Booking System Launched",
      slug: "digital-booking-system-2026",
      excerpt: "Temple launches online booking platform for sevas, hall reservations, and donations.",
      content: "Sri Kalikamba Temple has launched a comprehensive digital platform for devotees to book sevas, reserve the temple hall, and make donations online. The system supports secure payments and instant confirmations.",
      category: "Announcement",
      source: "Temple Administration",
      isPublished: true,
      publishedAt: new Date("2026-01-15"),
    },
    {
      title: "Annadana Seva Completes 1 Lakh Meals Served",
      slug: "annadana-1-lakh-meals",
      excerpt: "Temple's free food distribution program reaches milestone of serving one lakh meals.",
      content: "The Annadana Seva program at Sri Kalikamba Temple has crossed the milestone of serving one lakh free meals to devotees and visitors. The program was started in 2020 and has grown significantly with community support.",
      category: "Social Service",
      source: "Temple Trust",
      isPublished: true,
      publishedAt: new Date("2026-03-10"),
    },
    {
      title: "Vedic School Admissions Open for 2026-27",
      slug: "vedic-school-admissions-2026",
      excerpt: "Applications invited for the upcoming academic year at the temple's Vedic learning center.",
      content: "Sri Kalikamba Temple Vedic Pathashala invites applications for the academic year 2026-27. Courses in Veda Adhyayana, Sanskrit, and Agama Shastra are offered with free boarding and lodging for selected students.",
      category: "Education",
      source: "Vedic School",
      isPublished: true,
      publishedAt: new Date("2026-04-01"),
    },
    {
      title: "Temple Receives Heritage Conservation Award",
      slug: "heritage-conservation-award-2026",
      excerpt: "Sri Kalikamba Temple honored with state-level heritage conservation award.",
      content: "The temple has been recognized by the Karnataka State Heritage Commission for its excellent conservation of ancient architecture and traditional rituals. The award was presented at a ceremony in Bengaluru.",
      category: "Achievement",
      source: "Heritage Commission",
      isPublished: true,
      publishedAt: new Date("2026-05-20"),
    },
    {
      title: "Go Seva Initiative Expands with New Shelter",
      slug: "go-seva-shelter-expansion",
      excerpt: "Temple's cow shelter expands capacity to house 100 cows with modern amenities.",
      content: "The Go Seva initiative at Sri Kalikamba Temple has expanded with a new state-of-the-art shelter facility. The new goshala can accommodate up to 100 cows with automated feeding and health monitoring systems.",
      category: "Social Service",
      source: "Temple Trust",
      isPublished: true,
      publishedAt: new Date("2026-06-12"),
    },
  ]

  for (const news of newsItems) {
    await prisma.news.upsert({
      where: { slug: news.slug },
      update: {},
      create: { ...news, createdBy: admin.id },
    })
  }
  console.log("News seeded")

  // ─── GALLERY ─────────────────────────────────────────────────────────────────

  const galleryItems = [
    { title: "Brahmotsava Rathotsava", slug: "brahmotsava-rathotsava", description: "Grand chariot procession during annual Brahmotsava", type: "IMAGE" as const, category: "FESTIVAL" as const, isFeatured: true, sortOrder: 1 },
    { title: "Temple Gopura - Sunrise View", slug: "temple-gopura-sunrise", description: "The majestic Raja Gopura at dawn", type: "IMAGE" as const, category: "TEMPLE" as const, isFeatured: true, sortOrder: 2 },
    { title: "Abhishekam Ceremony", slug: "abhishekam-ceremony", description: "Sacred abhishekam being performed to the presiding deity", type: "IMAGE" as const, category: "POOJA" as const, isFeatured: true, sortOrder: 3 },
    { title: "Deepavali Celebrations", slug: "deepavali-celebrations", description: "Temple illuminated with thousands of lamps during Deepavali", type: "IMAGE" as const, category: "FESTIVAL" as const, isFeatured: false, sortOrder: 4 },
    { title: "Annadana Seva Hall", slug: "annadana-seva-hall", description: "Community dining hall where free meals are served daily", type: "IMAGE" as const, category: "TEMPLE" as const, isFeatured: false, sortOrder: 5 },
    { title: "Navaratri Golu Display", slug: "navaratri-golu-display", description: "Traditional golu (doll) display during Navaratri festival", type: "IMAGE" as const, category: "FESTIVAL" as const, isFeatured: false, sortOrder: 6 },
    { title: "Vedic Chanting by Students", slug: "vedic-chanting-students", description: "Students of the Vedic pathashala performing sandhya vandanam", type: "VIDEO" as const, category: "EVENT" as const, isFeatured: false, sortOrder: 7 },
    { title: "Temple Heritage Walk", slug: "temple-heritage-walk", description: "A guided tour of the temple's ancient architecture and history", type: "VIDEO" as const, category: "TEMPLE" as const, isFeatured: false, sortOrder: 8 },
    { title: "Homa at Sunrise", slug: "homa-at-sunrise", description: "Ganapathi Homa being performed at sunrise", type: "IMAGE" as const, category: "POOJA" as const, isFeatured: false, sortOrder: 9 },
    { title: "Mahotsava Cultural Programs", slug: "mahotsava-cultural-programs", description: "Cultural performances by renowned artists during the annual festival", type: "IMAGE" as const, category: "EVENT" as const, isFeatured: false, sortOrder: 10 },
  ]

  for (const gallery of galleryItems) {
    await prisma.gallery.upsert({
      where: { slug: gallery.slug },
      update: {},
      create: { ...gallery, createdBy: admin.id },
    })
  }
  console.log("Gallery seeded")

  // ─── DAILY SCHEDULE ──────────────────────────────────────────────────────────

  const scheduleTemplates: { dayOfWeek: number; slots: { title: string; description: string; startTime: string; endTime: string; sortOrder: number }[] }[] = [
    {
      dayOfWeek: 0, // Sunday
      slots: [
        { title: "Suprabhata", description: "Wake-up ritual of the deity", startTime: "05:00", endTime: "05:30", sortOrder: 1 },
        { title: "Vishweshwara Pooja", description: "Special Sunday abhishekam", startTime: "06:00", endTime: "07:30", sortOrder: 2 },
        { title: "Archana", description: "Floral offering with devotees", startTime: "07:30", endTime: "08:30", sortOrder: 3 },
        { title: "Maha Nivedana", description: "Grand food offering to the deity", startTime: "09:00", endTime: "09:30", sortOrder: 4 },
        { title: "Deeparadhana", description: "Evening lamp offering", startTime: "18:00", endTime: "18:30", sortOrder: 5 },
        { title: "Sahasranama Archana", description: "Thousand-name chanting", startTime: "18:30", endTime: "19:30", sortOrder: 6 },
      ],
    },
    {
      dayOfWeek: 1, // Monday
      slots: [
        { title: "Suprabhata", description: "Wake-up ritual of the deity", startTime: "05:00", endTime: "05:30", sortOrder: 1 },
        { title: "Rudra Abhishekam", description: "Monday special abhishekam", startTime: "06:00", endTime: "07:00", sortOrder: 2 },
        { title: "Archana", description: "Floral offering with devotees", startTime: "07:00", endTime: "08:00", sortOrder: 3 },
        { title: "Maha Nivedana", description: "Grand food offering to the deity", startTime: "08:30", endTime: "09:00", sortOrder: 4 },
        { title: "Deeparadhana", description: "Evening lamp offering", startTime: "18:00", endTime: "18:30", sortOrder: 5 },
        { title: "Laghu Rudra", description: "Partial Rudra chanting", startTime: "18:30", endTime: "19:30", sortOrder: 6 },
      ],
    },
    {
      dayOfWeek: 2, // Tuesday
      slots: [
        { title: "Suprabhata", description: "Wake-up ritual of the deity", startTime: "05:00", endTime: "05:30", sortOrder: 1 },
        { title: "Abhishekam", description: "Panchamrita abhishekam", startTime: "06:00", endTime: "07:00", sortOrder: 2 },
        { title: "Archana", description: "Floral offering with devotees", startTime: "07:00", endTime: "08:00", sortOrder: 3 },
        { title: "Maha Nivedana", description: "Grand food offering to the deity", startTime: "08:30", endTime: "09:00", sortOrder: 4 },
        { title: "Deeparadhana", description: "Evening lamp offering", startTime: "18:00", endTime: "18:30", sortOrder: 5 },
        { title: "Kumkumarchana", description: "Tuesday special kumkumarchana", startTime: "18:30", endTime: "19:30", sortOrder: 6 },
      ],
    },
    {
      dayOfWeek: 3, // Wednesday
      slots: [
        { title: "Suprabhata", description: "Wake-up ritual of the deity", startTime: "05:00", endTime: "05:30", sortOrder: 1 },
        { title: "Abhishekam", description: "Panchamrita abhishekam", startTime: "06:00", endTime: "07:00", sortOrder: 2 },
        { title: "Archana", description: "Floral offering with devotees", startTime: "07:00", endTime: "08:00", sortOrder: 3 },
        { title: "Maha Nivedana", description: "Grand food offering to the deity", startTime: "08:30", endTime: "09:00", sortOrder: 4 },
        { title: "Deeparadhana", description: "Evening lamp offering", startTime: "18:00", endTime: "18:30", sortOrder: 5 },
        { title: "Sahasranama Archana", description: "Thousand-name chanting", startTime: "18:30", endTime: "19:30", sortOrder: 6 },
      ],
    },
    {
      dayOfWeek: 4, // Thursday
      slots: [
        { title: "Suprabhata", description: "Wake-up ritual of the deity", startTime: "05:00", endTime: "05:30", sortOrder: 1 },
        { title: "Abhishekam", description: "Panchamrita abhishekam", startTime: "06:00", endTime: "07:00", sortOrder: 2 },
        { title: "Sri Sukta Archana", description: "Goddess Lakshmi special archana", startTime: "07:00", endTime: "08:00", sortOrder: 3 },
        { title: "Maha Nivedana", description: "Grand food offering to the deity", startTime: "08:30", endTime: "09:00", sortOrder: 4 },
        { title: "Deeparadhana", description: "Evening lamp offering", startTime: "18:00", endTime: "18:30", sortOrder: 5 },
        { title: "Bhajana", description: "Devotional bhajan singing", startTime: "18:30", endTime: "19:30", sortOrder: 6 },
      ],
    },
    {
      dayOfWeek: 5, // Friday
      slots: [
        { title: "Suprabhata", description: "Wake-up ritual of the deity", startTime: "05:00", endTime: "05:30", sortOrder: 1 },
        { title: "Kumkumarchana", description: "Friday special goddess archana", startTime: "06:00", endTime: "07:00", sortOrder: 2 },
        { title: "Archana", description: "Floral offering with devotees", startTime: "07:00", endTime: "08:00", sortOrder: 3 },
        { title: "Maha Nivedana", description: "Grand food offering to the deity", startTime: "08:30", endTime: "09:00", sortOrder: 4 },
        { title: "Deeparadhana", description: "Evening lamp offering", startTime: "18:00", endTime: "18:30", sortOrder: 5 },
        { title: "Devi Sahasranama", description: "Thousand names of the goddess", startTime: "18:30", endTime: "19:30", sortOrder: 6 },
      ],
    },
    {
      dayOfWeek: 6, // Saturday
      slots: [
        { title: "Suprabhata", description: "Wake-up ritual of the deity", startTime: "05:00", endTime: "05:30", sortOrder: 1 },
        { title: "Vishesha Abhishekam", description: "Special Saturday abhishekam with devotees", startTime: "06:00", endTime: "07:30", sortOrder: 2 },
        { title: "Archana", description: "Floral offering with devotees", startTime: "07:30", endTime: "08:30", sortOrder: 3 },
        { title: "Maha Nivedana", description: "Grand food offering to the deity", startTime: "09:00", endTime: "09:30", sortOrder: 4 },
        { title: "Deeparadhana", description: "Evening lamp offering", startTime: "18:00", endTime: "18:30", sortOrder: 5 },
        { title: "Kalyanotsava", description: "Weekly celestial wedding ceremony", startTime: "18:30", endTime: "20:00", sortOrder: 6 },
      ],
    },
  ]

  for (const day of scheduleTemplates) {
    for (const slot of day.slots) {
      const exists = await prisma.dailySchedule.findFirst({
        where: { dayOfWeek: day.dayOfWeek, title: slot.title },
      })
      if (!exists) {
        await prisma.dailySchedule.create({
          data: { dayOfWeek: day.dayOfWeek, ...slot },
        })
      }
    }
  }
  console.log("Daily schedule seeded")

  // ─── TESTIMONIALS ────────────────────────────────────────────────────────────

  const testimonials = [
    {
      name: "Smt. Lakshmi Rao",
      role: "Devotee from Mangaluru",
      content: "Sri Kalikamba Temple has been my spiritual home for decades. The peace I experience during the morning poojas is unmatched. The temple trust does wonderful work with annadana and community service.",
      rating: 5,
      isFeatured: true,
      isApproved: true,
      sortOrder: 1,
    },
    {
      name: "Sri Venkatesh Pai",
      role: "Devotee from Udupi",
      content: "I booked the Sahasranama Archana online and the experience was seamless. The priests performed the seva with great devotion. The digital booking system is very convenient.",
      rating: 5,
      isFeatured: true,
      isApproved: true,
      sortOrder: 2,
    },
    {
      name: "Smt. Parvati Hegde",
      role: "Devotee from Bengaluru",
      content: "The Shashwatha Nitya Pooja has brought immense peace and prosperity to our family. Knowing that daily prayers are offered at the temple gives us great spiritual comfort.",
      rating: 5,
      isFeatured: false,
      isApproved: true,
      sortOrder: 3,
    },
    {
      name: "Sri Narayana Bhat",
      role: "Devotee from Kundapura",
      content: "The temple premises are always clean and well-maintained. The staff is courteous and helpful. I especially enjoy the Saturday Kalyanotsava with my family.",
      rating: 4,
      isFeatured: false,
      isApproved: true,
      sortOrder: 4,
    },
  ]

  for (const testimonial of testimonials) {
    const exists = await prisma.testimonial.findFirst({ where: { name: testimonial.name } })
    if (!exists) {
      await prisma.testimonial.create({ data: testimonial })
    }
  }
  console.log("Testimonials seeded")

  console.log("Database seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

export {}
