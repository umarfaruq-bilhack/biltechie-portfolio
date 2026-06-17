'use client'
import { useEffect, useState } from 'react'
import NodeNetwork from '@/components/ui/NodeNetwork'
import FloatingOrb from '@/components/ui/FloatingOrb'
import { useScramble } from '@/hooks/useScramble'
import StatCounter from '@/components/ui/StatCounter'
import Logo from '@/components/ui/Logo'

const ROLES = [
  'Full-Stack Developer',
  'Web3 Developer',
  'Smart Contract Engineer',
  'UI/UX Builder',
  'Product Engineer',
]

export default function Hero({ available = true }: { available?: boolean }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { display: bilDisplay } = useScramble('Bil', 200, 45)
  const { display: techieDisplay } = useScramble('techie', 400, 45)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const role = ROLES[roleIndex]
    let i = typing ? 0 : role.length
    const speed = typing ? 60 : 30
    const interval = setInterval(() => {
      if (typing) {
        setDisplayed(role.slice(0, i + 1)); i++
        if (i === role.length) { clearInterval(interval); setTimeout(() => setTyping(false), 1800) }
      } else {
        setDisplayed(role.slice(0, i - 1)); i--
        if (i === 0) { clearInterval(interval); setRoleIndex(p => (p + 1) % ROLES.length); setTyping(true) }
      }
    }, speed)
    return () => clearInterval(interval)
  }, [roleIndex, typing])

  return (
    <section id="home" className="relative min-h-screen flex items-center dot-grid pt-16 md:pt-20 overflow-hidden">
      <NodeNetwork />
      <FloatingOrb />

      <div className="absolute top-1/3 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-neon/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full relative z-10">
        <div className="max-w-2xl">
          {/* Logo mark */}
          <div className={`mb-6 md:mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Logo size={44} showWordmark={false} />
          </div>

          {/* Availability */}
          <div className={`inline-flex items-center gap-2 mb-5 md:mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${available ? 'bg-neon animate-pulse' : 'bg-white/30'}`} />
            <span className="font-mono text-xs text-white/50 tracking-widest uppercase">
              {available ? 'Available for Web3 projects' : 'Currently unavailable'}
            </span>
          </div>

          {/* Scramble name */}
          <h1 className={`font-mono text-5xl sm:text-6xl md:text-7xl font-medium mb-3 md:mb-4 leading-none transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="text-white">{bilDisplay}</span>
            <span className="text-neon" style={{ textShadow: '0 0 40px rgba(0,255,136,0.35)' }}>{techieDisplay}</span>
          </h1>

          {/* Typewriter */}
          <div className={`h-7 md:h-8 mb-5 md:mb-6 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="font-mono text-base md:text-lg text-white/50">
              {displayed}<span className="animate-blink text-neon">|</span>
            </p>
          </div>

          {/* Description */}
          <p className={`text-white/40 text-sm md:text-base leading-relaxed mb-8 md:mb-10 font-light transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            I build full-stack products end to end — from Web3 smart contracts and NFT systems
            to e-commerce platforms, admin dashboards, and modern web apps. Every project
            I touch, I build like it's my own.
          </p>

          {/* CTAs */}
          <div className={`flex flex-wrap gap-3 md:gap-4 mb-10 md:mb-16 transition-all duration-700 delay-[400ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <a href="#work" data-hover
              className="inline-flex items-center gap-2 bg-neon text-dark font-mono font-medium text-sm px-5 md:px-6 py-2.5 md:py-3 rounded hover:bg-neon/90 transition-all hover:scale-105">
              View My Work
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#contact" data-hover
              className="inline-flex items-center gap-2 border border-white/15 text-white/60 hover:text-white hover:border-white/30 font-mono text-sm px-5 md:px-6 py-2.5 md:py-3 rounded transition-all">
              Let's Talk
            </a>
          </div>

          {/* Stat counters */}
          <div className={`grid grid-cols-3 gap-4 md:flex md:gap-10 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <StatCounter value="3+" label="Mainnet contracts" />
            <StatCounter value="24k+" label="NFTs generated" />
            <StatCounter value="5+" label="Live projects" />
          </div>
        </div>
      </div>

      {/* Scroll */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="font-mono text-xs text-white/20 tracking-widest uppercase">Scroll</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  )
}
