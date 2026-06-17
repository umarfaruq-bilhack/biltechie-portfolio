'use client'
import SpotlightCard from '@/components/ui/SpotlightCard'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useCardDrop } from '@/hooks/useCardDrop'
import type { Service } from '@/types'

const ICONS: Record<string, React.ReactNode> = {
  code: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  image: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  layout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  server: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  sparkles: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
  wand: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 4V2m0 2v2m0-2h-2m2 0h2M3 14l9-9 5 5-9 9-5-5z"/></svg>,
}

export default function Services({ services }: { services: Service[] }) {
  const headerRef = useScrollReveal()
  const { ref: gridRef, dropped } = useCardDrop(services.length)

  return (
    <section id="services" className="py-16 md:py-24 px-4 sm:px-6 border-t border-dark-300">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="reveal mb-14">
          <span className="font-mono text-xs text-neon tracking-widest uppercase">What I do</span>
          <h2 className="font-mono text-3xl md:text-4xl font-medium text-white mt-3">Services</h2>
          <p className="text-white/40 text-sm mt-3 max-w-md">Everything you need to launch a Web3 product, from contract to frontend.</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {services.map((service, i) => (
            <div
              key={service.id}
              className={`card-drop card-electric drop-delay-${i % 6} relative rounded-lg ${dropped ? 'dropped' : ''}`}
            >
              <SpotlightCard className="p-6 bg-dark-100 border border-dark-300 rounded-lg h-full">
                <div className="w-9 h-9 rounded-md flex items-center justify-center mb-4 bg-dark-300 text-white/40 border border-dark-400 transition-all">
                  {ICONS[service.icon] || ICONS['code']}
                </div>
                <h3 className="font-mono text-sm font-medium text-white mb-2">{service.name}</h3>
                <p className="text-white/35 text-xs leading-relaxed">{service.description}</p>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
