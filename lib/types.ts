export interface Announcement {
  id: string
  title: string
  content?: string
  type: string
  isActive: boolean
  isPopup: boolean
  startDate?: Date
  endDate?: Date
  link?: string
  linkText?: string
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
  createdBy?: string
}

export interface Festival {
  id: string
  name: string
  slug: string
  description?: string
  shortDescription?: string
  category?: string
  date?: Date
  startDate?: Date
  endDate?: Date
  isMultiDay: boolean
  image?: string
  images?: unknown
  rituals?: unknown
  significance?: string
  history?: string
  isActive: boolean
  isFeatured: boolean
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  updatedBy?: string
}

export interface DailySchedule {
  id: string
  dayOfWeek: number
  title: string
  description?: string
  startTime?: string
  endTime?: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface Gallery {
  id: string
  title: string
  slug: string
  description?: string
  image?: string
  images?: unknown
  videoUrl?: string
  type: string
  category: string
  tags?: unknown
  isFeatured: boolean
  isPublished: boolean
  sortOrder: number
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
  createdBy?: string
}
