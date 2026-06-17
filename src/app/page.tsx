import { supabase } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import Projects from '@/components/sections/Projects'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import TemplatesTeaser from '@/components/sections/TemplatesTeaser'
import type { Project, Service, Stat, AboutContent } from '@/types'

async function getData() {
  const [projectsRes, servicesRes, statsRes, aboutRes] = await Promise.all([
    supabase.from('projects').select('*').eq('visible', true).order('sort_order'),
    supabase.from('services').select('*').eq('visible', true).order('sort_order'),
    supabase.from('stats').select('*').eq('visible', true).order('sort_order'),
    supabase.from('about').select('*').limit(1).single(),
  ])
  return {
    projects: (projectsRes.data || []) as Project[],
    services: (servicesRes.data || []) as Service[],
    stats: (statsRes.data || []) as Stat[],
    about: aboutRes.data as AboutContent,
  }
}

export const revalidate = 30

export default async function Home() {
  const { projects, services, stats, about } = await getData()
  return (
    <main className="min-h-screen bg-dark">
      <Navbar />
      <Hero available={about?.available ?? true} />
      <Services services={services} />
      <Projects projects={projects} />
      <TemplatesTeaser />
      {about && <About about={about} stats={stats} />}
      <Contact about={about} />
      <Footer about={about} />
    </main>
  )
}
