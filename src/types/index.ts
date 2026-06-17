export interface Project {
  id: string
  title: string
  description: string
  long_description?: string
  tags: string[]
  stack: string[]
  live_url?: string
  github_url?: string
  image_url?: string
  featured: boolean
  visible: boolean
  sort_order: number
  created_at: string
}

export interface Service {
  id: string
  name: string
  description: string
  icon: string
  visible: boolean
  sort_order: number
}

export interface Stat {
  id: string
  label: string
  value: string
  visible: boolean
  sort_order: number
}

export interface AboutContent {
  id: string
  bio: string
  availability_status: string
  available: boolean
}

export interface SocialLinks {
  twitter?: string
  github?: string
  tiktok?: string
  email?: string
}

export interface Template {
  id: string
  name: string
  description: string
  long_description?: string
  category: string
  price: number
  preview_url?: string
  stack: string[]
  features: string[]
  badge?: string
  visible: boolean
  sort_order: number
  created_at: string
}

export interface PurchaseRequest {
  id: string
  template_id: string
  template_name: string
  name: string
  email: string
  message?: string
  status: 'pending' | 'contacted' | 'completed'
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  status: 'unread' | 'read'
  created_at: string
}
