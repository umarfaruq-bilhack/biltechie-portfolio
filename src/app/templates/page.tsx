'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Template } from '@/types'
import NodeNetwork from '@/components/ui/NodeNetwork'
import Logo from '@/components/ui/Logo'

// Categories are derived dynamically from the templates data — no hardcoded list

function PurchaseModal({ template, onClose }: { template: Template; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async () => {
    if (!form.name || !form.email) return
    setStatus('sending')
    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: template.id, template_name: template.name, ...form }),
      })
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-dark-100 border border-neon/20 rounded-xl p-6 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white font-mono text-sm">✕</button>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="font-mono text-sm font-medium text-white mb-2">Request sent!</div>
            <div className="font-mono text-xs text-white/40 leading-relaxed">Biltechie will reach out to <span className="text-neon">{form.email}</span> within 24 hours with payment details.</div>
            <button onClick={onClose} className="mt-6 bg-neon text-dark font-mono text-xs font-medium px-6 py-2.5 rounded hover:bg-neon/90 transition-all">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <div className="font-mono text-xs text-neon tracking-widest uppercase mb-1">Purchase request</div>
              <div className="font-mono text-base font-medium text-white">{template.name}</div>
              <div className="font-mono text-xs text-white/40 mt-1">
                <span className="text-neon font-medium">${template.price}</span> · Full source code · Lifetime access
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {[
                { key: 'name', label: 'Your name', placeholder: 'John Doe', type: 'text' },
                { key: 'email', label: 'Email address', placeholder: 'john@example.com', type: 'email' },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="font-mono text-xs text-white/40 block mb-1">{label}</label>
                  <input type={type} value={(form as Record<string, string>)[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-dark-200 border border-dark-400 rounded px-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-neon/40 transition-colors" />
                </div>
              ))}
              <div>
                <label className="font-mono text-xs text-white/40 block mb-1">Message (optional)</label>
                <textarea value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Any specific requirements or questions..."
                  rows={3}
                  className="w-full bg-dark-200 border border-dark-400 rounded px-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-neon/40 transition-colors resize-none" />
              </div>
            </div>

            {status === 'error' && (
              <div className="mb-3 text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                Something went wrong. Please try again.
              </div>
            )}

            <button onClick={handleSubmit} disabled={status === 'sending' || !form.name || !form.email}
              className="w-full bg-neon text-dark font-mono font-medium text-sm py-3 rounded hover:bg-neon/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {status === 'sending' ? 'Sending...' : 'Send Purchase Request'}
              {status === 'idle' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              )}
            </button>
            <p className="font-mono text-xs text-white/20 text-center mt-3 leading-relaxed">
              Biltechie will reach out within 24hrs with payment details and file transfer.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function TemplateCard({ template, onPurchase, index }: { template: Template; onPurchase: (t: Template) => void; index: number }) {
  const [previewStatus, setPreviewStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')
  const [hovered, setHovered] = useState(false)

  const screenshotUrl = template.preview_url
    ? `https://api.microlink.io/?url=${encodeURIComponent(template.preview_url)}&screenshot=true&meta=false&embed=screenshot.url&waitFor=2000`
    : null

  return (
    <div
      className={`card-drop card-electric drop-delay-${index % 6} bg-dark-100 border rounded-xl overflow-hidden transition-all duration-300 flex flex-col ${hovered ? 'border-neon/25' : 'border-dark-300'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Preview */}
      <div className="h-44 bg-dark-200 relative overflow-hidden border-b border-dark-300">
        {screenshotUrl ? (
          <>
            {previewStatus === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border border-neon/30 border-t-neon rounded-full animate-spin" />
              </div>
            )}
            {previewStatus === 'failed' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="font-mono text-xs text-neon/20 tracking-widest uppercase">{template.name}</div>
              </div>
            )}
            <img src={screenshotUrl} alt={template.name}
              className={`w-full h-full object-cover object-top transition-opacity duration-500 ${previewStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setPreviewStatus('loaded')} onError={() => setPreviewStatus('failed')} />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-mono text-xs text-neon/20 tracking-widest uppercase mb-1">{template.category}</div>
              <div className="font-mono text-sm text-white/15">{template.name}</div>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="font-mono text-xs text-neon/60 bg-dark/70 backdrop-blur-sm border border-dark-400 px-2 py-1 rounded">
            {template.category}
          </span>
          {template.badge && (
            <span className={`font-mono text-xs px-2 py-1 rounded ${
              template.badge === 'Popular'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-neon/10 text-neon border border-neon/20'
            }`}>
              {template.badge}
            </span>
          )}
        </div>

        {/* Hover overlay */}
        {template.preview_url && (
          <div className={`absolute inset-0 bg-dark/70 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <a href={template.preview_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 border border-white/20 text-white/70 hover:text-white font-mono text-xs px-4 py-2 rounded transition-all">
              Live Preview
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-mono text-sm font-medium text-white mb-2">{template.name}</h3>
        <p className="text-white/35 text-xs leading-relaxed mb-4 flex-1">{template.description}</p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-1 mb-4">
          {template.features.slice(0, 4).map(f => (
            <div key={f} className="flex items-center gap-1.5">
              <span className="text-neon text-xs">✓</span>
              <span className="font-mono text-xs text-white/30">{f}</span>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {template.stack.map(t => (
            <span key={t} className="font-mono text-xs text-white/25 bg-dark-300 px-2 py-0.5 rounded">{t}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-300">
          <div className="font-mono text-xl font-medium text-neon">${template.price}</div>
          <div className="flex gap-2">
            {template.preview_url && (
              <a href={template.preview_url} target="_blank" rel="noopener noreferrer"
                className="font-mono text-xs border border-dark-400 text-white/40 hover:text-white px-3 py-2 rounded transition-colors">
                Preview
              </a>
            )}
            <button onClick={() => onPurchase(template)}
              className="font-mono text-xs bg-neon text-dark font-medium px-4 py-2 rounded hover:bg-neon/90 transition-all">
              Get Template
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [purchasing, setPurchasing] = useState<Template | null>(null)

  useEffect(() => {
    fetch('/api/templates').then(r => r.json()).then(data => {
      setTemplates(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }, [])

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category))).sort()]

  const filtered = activeCategory === 'All'
    ? templates
    : templates.filter(t => t.category === activeCategory)

  const countFor = (cat: string) => cat === 'All' ? templates.length : templates.filter(t => t.category === cat).length

  return (
    <main className="min-h-screen bg-dark">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-dark/90 backdrop-blur-md border-b border-dark-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><Logo size={26} /></Link>
          <div className="flex items-center gap-6">
            <Link href="/#work" className="font-mono text-xs text-white/40 hover:text-white transition-colors">Portfolio</Link>
            <Link href="/#contact" className="bg-neon text-dark font-mono text-xs font-medium px-4 py-2 rounded hover:bg-neon/90 transition-all">Hire Me</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 border-b border-dark-300 overflow-hidden dot-grid">
        <NodeNetwork />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon/4 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <span className="font-mono text-xs text-neon tracking-widest uppercase">Templates & Starters</span>
          <h1 className="font-mono text-4xl md:text-6xl font-medium text-white mt-4 mb-4 leading-tight">
            Ready-made templates.<br />
            <span className="text-white/40">Built by a builder.</span>
          </h1>
          <p className="text-white/40 text-sm md:text-base leading-relaxed mb-10 max-w-2xl">
            Production-ready templates for any website or web app you need to launch —
            Web3 projects, e-commerce stores, admin dashboards, real estate sites, blogs and more.
            Buy once, deploy in minutes. Full source code included.
          </p>
          <div className="flex flex-wrap gap-8">
            {[
              { num: `${templates.length || 6}`, label: 'Templates' },
              { num: 'Next.js', label: 'Primary stack' },
              { num: '$29+', label: 'Starting from' },
              { num: '24hrs', label: 'Delivery time' },
            ].map(s => (
              <div key={s.label}>
                <div className="font-mono text-xl font-medium text-neon">{s.num}</div>
                <div className="font-mono text-xs text-white/30 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-dark/95 backdrop-blur-md border-b border-dark-300">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`font-mono text-xs px-4 py-2 rounded-full border transition-all ${
                activeCategory === cat
                  ? 'bg-neon text-dark border-neon font-medium'
                  : 'text-white/40 border-dark-400 hover:border-dark-300 hover:text-white'
              }`}>
              {cat} <span className="opacity-60 ml-1">{countFor(cat)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-dark-100 border border-dark-300 rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="font-mono text-sm text-white/20">No templates in this category yet.</div>
              <div className="font-mono text-xs text-white/10 mt-2">Check back soon.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((t, i) => (
                <TemplateCard key={t.id} template={t} onPurchase={setPurchasing} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 border-t border-dark-300">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-mono text-xs text-neon tracking-widest uppercase">Need something custom?</span>
          <h2 className="font-mono text-3xl font-medium text-white mt-3 mb-3">
            Don't see what you need?
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            I build custom projects from scratch — Web3 apps, e-commerce platforms, dashboards, real estate sites, blogs and more. Let's talk about your project.
          </p>
          <Link href="/#contact"
            className="inline-flex items-center gap-2 bg-neon text-dark font-mono font-medium text-sm px-8 py-3.5 rounded hover:bg-neon/90 transition-all">
            Start a Custom Project
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {purchasing && <PurchaseModal template={purchasing} onClose={() => setPurchasing(null)} />}
    </main>
  )
}
