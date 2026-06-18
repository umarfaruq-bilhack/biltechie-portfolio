'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Template } from '@/types'

export default function TemplatesTeaser() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/templates')
      .then(res => res.json())
      .then(data => {
        setTemplates(Array.isArray(data) ? data.slice(0, 3) : [])
      })
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && templates.length === 0) return null

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 border-t border-dark-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-xs text-neon tracking-widest uppercase">Templates</span>
            <h2 className="font-mono text-3xl md:text-4xl font-medium text-white mt-3">Ready-made starters</h2>
            <p className="text-white/40 text-sm mt-3 max-w-md">Production-ready templates for any project. Buy once, deploy in minutes. Full source code included.</p>
          </div>
          <Link href="/templates"
            className="inline-flex items-center gap-2 border border-neon/30 text-neon font-mono text-xs px-5 py-2.5 rounded hover:bg-neon/5 transition-all whitespace-nowrap self-start md:self-auto">
            Browse all templates
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-dark-100 border border-dark-300 rounded-xl h-56 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((t, i) => (
              <Link href="/templates" key={t.id}
                className="group bg-dark-100 border border-dark-300 hover:border-neon/20 rounded-xl overflow-hidden transition-all duration-300">
                <div className="h-36 bg-dark-200 border-b border-dark-300 relative flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-mono text-xs text-neon/20 tracking-widest uppercase mb-1">{String(i+1).padStart(2,'0')}</div>
                    <div className="font-mono text-sm text-white/15">{t.category}</div>
                  </div>
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-mono text-xs text-neon/50 bg-dark/70 border border-dark-400 px-2 py-0.5 rounded">{t.category}</span>
                    {t.badge && (
                      <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                        t.badge === 'Popular' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-neon/10 text-neon border border-neon/20'
                      }`}>{t.badge}</span>
                    )}
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xs font-medium text-white">{t.name}</div>
                  </div>
                  <div className="font-mono text-base font-medium text-neon">${t.price}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/templates"
            className="inline-flex items-center gap-2 bg-neon text-dark font-mono font-medium text-sm px-8 py-3 rounded hover:bg-neon/90 transition-all">
            View All Templates
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
