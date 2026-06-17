'use client'
import StatCounter from '@/components/ui/StatCounter'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { AboutContent, Stat } from '@/types'

export default function About({ about, stats }: { about: AboutContent; stats: Stat[] }) {
  const headerRef = useScrollReveal()
  const textRef = useScrollReveal()
  const statsRef = useScrollReveal()

  return (
    <section id="about" className="py-16 md:py-24 px-4 sm:px-6 border-t border-dark-300">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="reveal mb-14">
          <span className="font-mono text-xs text-neon tracking-widest uppercase">Who I am</span>
          <h2 className="font-mono text-3xl md:text-4xl font-medium text-white mt-3">About Biltechie</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div ref={textRef} className="reveal">
            <p className="text-white/50 text-base leading-relaxed mb-6">{about.bio}</p>
            <div className="flex flex-wrap gap-3">
              {['Solidity', 'Next.js', 'TypeScript', 'Python', 'Foundry', 'Supabase', 'Rive', 'ERC721A'].map((skill) => (
                <span key={skill} className="font-mono text-xs text-white/40 border border-dark-400 px-3 py-1.5 rounded hover:border-neon/30 hover:text-neon/70 transition-all">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div ref={statsRef} className="reveal grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-dark-100 border border-dark-300 rounded-lg p-5 hover:border-neon/20 transition-all glow-border">
                <StatCounter value={stat.value} label={stat.label} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
