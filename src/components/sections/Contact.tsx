'use client'
import { useState } from 'react'
import type { AboutContent } from '@/types'

export default function Contact({ about }: { about?: AboutContent }) {
  const twitter = (about as unknown as Record<string, string>)?.twitter_url || 'https://x.com/biltechie'
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="py-20 md:py-32 px-4 sm:px-6 border-t border-dark-300 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto text-center relative">
        <span className="font-mono text-xs text-neon tracking-widest uppercase">Let's build</span>
        <h2 className="font-mono text-3xl md:text-5xl font-medium text-white mt-4 mb-4">
          Got a <span className="text-neon" style={{ textShadow: '0 0 30px rgba(0,255,136,0.3)' }}>project?</span>
        </h2>
        <p className="text-white/40 text-sm mb-10 leading-relaxed">
          I'm open to freelance projects, collaborations, and full-time opportunities.
          Send a message and I'll get back to you within 24 hours.
        </p>

        {status === 'success' ? (
          <div className="bg-dark-100 border border-neon/20 rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="font-mono text-sm font-medium text-white mb-2">Message sent!</div>
            <div className="font-mono text-xs text-white/40 leading-relaxed">
              Thanks for reaching out. I'll get back to you within 24 hours.
            </div>
            <button onClick={() => setStatus('idle')} data-hover
              className="mt-6 font-mono text-xs text-neon border border-neon/30 px-5 py-2 rounded hover:bg-neon/5 transition-all">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-dark-100 border border-dark-300 rounded-xl p-6 md:p-8 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-mono text-xs text-white/40 block mb-1.5">Your name</label>
                <input
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full bg-dark-200 border border-dark-400 rounded px-3 py-2.5 text-sm font-mono text-white/80 focus:outline-none focus:border-neon/40 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-xs text-white/40 block mb-1.5">Email address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="w-full bg-dark-200 border border-dark-400 rounded px-3 py-2.5 text-sm font-mono text-white/80 focus:outline-none focus:border-neon/40 transition-colors"
                  required
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="font-mono text-xs text-white/40 block mb-1.5">Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell me about your project..."
                rows={5}
                className="w-full bg-dark-200 border border-dark-400 rounded px-3 py-2.5 text-sm font-mono text-white/80 focus:outline-none focus:border-neon/40 transition-colors resize-none"
                required
              />
            </div>

            {status === 'error' && (
              <div className="mb-4 text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                Something went wrong. Please try again or DM me on X instead.
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={status === 'sending'}
                data-hover
                className="flex-1 inline-flex items-center justify-center gap-2 bg-neon text-dark font-mono font-medium text-sm px-6 py-3 rounded hover:bg-neon/90 disabled:opacity-50 transition-all"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
                {status === 'idle' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/60 hover:text-white hover:border-white/30 font-mono text-sm px-6 py-3 rounded transition-all"
              >
                DM on X
              </a>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
