'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark/90 backdrop-blur-md border-b border-dark-300' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono text-neon font-medium tracking-wider text-sm">
          biltechie<span className="animate-blink">_</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {['Work', 'Services', 'About'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-xs text-white/40 hover:text-white/80 transition-colors font-mono tracking-wide uppercase">
              {item}
            </a>
          ))}
        </div>
        <a href="#contact"
          className="hidden md:inline-flex bg-neon text-dark text-xs font-medium font-mono px-4 py-2 rounded hover:bg-neon/90 transition-all">
          Hire Me
        </a>
        <button className="md:hidden text-white/60 hover:text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <div className="w-5 flex flex-col gap-1">
            <span className={`h-px bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`h-px bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-px bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-dark-100 border-t border-dark-300 px-6 py-4 flex flex-col gap-4">
          {['Work', 'Services', 'About', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-sm text-white/50 hover:text-white font-mono" onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
