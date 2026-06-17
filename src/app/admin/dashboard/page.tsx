'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Project, Service, Stat, AboutContent, Template, PurchaseRequest, ContactMessage } from '@/types'

type Tab = 'projects' | 'services' | 'stats' | 'about' | 'templates' | 'purchases' | 'messages'

const ICONS = ['code', 'image', 'layout', 'server', 'sparkles', 'wand', 'globe', 'lock', 'zap', 'box']
const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  contacted: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  completed: 'text-neon border-neon/30 bg-neon/10',
}

function Input({ label, value, onChange, placeholder, textarea }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean
}) {
  const cls = "w-full bg-dark-200 border border-dark-400 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-neon/40 transition-colors"
  return (
    <div>
      <label className="font-mono text-xs text-white/40 block mb-1">{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div onClick={() => onChange(!checked)}
        className={`w-8 h-4 rounded-full transition-colors relative ${checked ? 'bg-neon' : 'bg-dark-400'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-dark transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="font-mono text-xs text-white/40">{label}</span>
    </label>
  )
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [about, setAbout] = useState<AboutContent | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [purchases, setPurchases] = useState<PurchaseRequest[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null)
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null)
  const [editingStat, setEditingStat] = useState<Partial<Stat> | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<Partial<Template> | null>(null)
  const [aboutForm, setAboutForm] = useState<Partial<AboutContent> | null>(null)

  const router = useRouter()

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [pr, sr, str, ab, tm, pu, msgs] = await Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/services').then(r => r.json()),
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/about').then(r => r.json()),
      fetch('/api/templates').then(r => r.json()),
      fetch('/api/purchase').then(r => r.json()),
      fetch('/api/contact').then(r => r.json()),
    ])
    setProjects(Array.isArray(pr) ? pr : [])
    setServices(Array.isArray(sr) ? sr : [])
    setStats(Array.isArray(str) ? str : [])
    setAbout(ab?.id ? ab : null)
    setAboutForm(ab?.id ? ab : null)
    setTemplates(Array.isArray(tm) ? tm : [])
    setPurchases(Array.isArray(pu) ? pu : [])
    setMessages(Array.isArray(msgs) ? msgs : [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  // PROJECTS
  const saveProject = async () => {
    if (!editingProject) return
    setSaving(true)
    const toArr = (v: unknown) => Array.isArray(v) ? v : String(v || '').split(',').map((t: string) => t.trim()).filter(Boolean)
    const body = { ...editingProject, tags: toArr(editingProject.tags), stack: toArr(editingProject.stack) }
    const method = editingProject.id ? 'PATCH' : 'POST'
    const url = editingProject.id ? `/api/projects/${editingProject.id}` : '/api/projects'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setEditingProject(null); setSaving(false); showToast('Project saved'); fetchData()
  }
  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    showToast('Project deleted'); fetchData()
  }
  const toggleProject = async (id: string, visible: boolean) => {
    await fetch(`/api/projects/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visible: !visible }) })
    fetchData()
  }

  // SERVICES
  const saveService = async () => {
    if (!editingService) return
    setSaving(true)
    const method = editingService.id ? 'PATCH' : 'POST'
    const url = editingService.id ? `/api/services/${editingService.id}` : '/api/services'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingService) })
    setEditingService(null); setSaving(false); showToast('Service saved'); fetchData()
  }
  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return
    await fetch(`/api/services/${id}`, { method: 'DELETE' })
    showToast('Service deleted'); fetchData()
  }
  const toggleService = async (id: string, visible: boolean) => {
    await fetch(`/api/services/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visible: !visible }) })
    fetchData()
  }

  // STATS
  const saveStat = async () => {
    if (!editingStat) return
    setSaving(true)
    const method = editingStat.id ? 'PATCH' : 'POST'
    const url = editingStat.id ? `/api/stats/${editingStat.id}` : '/api/stats'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingStat) })
    setEditingStat(null); setSaving(false); showToast('Stat saved'); fetchData()
  }
  const deleteStat = async (id: string) => {
    if (!confirm('Delete this stat?')) return
    await fetch(`/api/stats/${id}`, { method: 'DELETE' })
    showToast('Stat deleted'); fetchData()
  }

  // TEMPLATES
  const saveTemplate = async () => {
    if (!editingTemplate) return
    setSaving(true)
    const toArr = (v: unknown) => Array.isArray(v) ? v : String(v || '').split(',').map((t: string) => t.trim()).filter(Boolean)
    const body = { ...editingTemplate, stack: toArr(editingTemplate.stack), features: toArr(editingTemplate.features), price: Number(editingTemplate.price) || 0 }
    const method = editingTemplate.id ? 'PATCH' : 'POST'
    const url = editingTemplate.id ? `/api/templates/${editingTemplate.id}` : '/api/templates'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setEditingTemplate(null); setSaving(false); showToast('Template saved'); fetchData()
  }
  const deleteTemplate = async (id: string) => {
    if (!confirm('Delete this template?')) return
    await fetch(`/api/templates/${id}`, { method: 'DELETE' })
    showToast('Template deleted'); fetchData()
  }
  const toggleTemplate = async (id: string, visible: boolean) => {
    await fetch(`/api/templates/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visible: !visible }) })
    fetchData()
  }

  // PURCHASES
  const updatePurchaseStatus = async (id: string, status: string) => {
    await fetch('/api/purchase', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    showToast('Status updated'); fetchData()
  }

  // ABOUT
  const saveAbout = async () => {
    if (!aboutForm) return
    setSaving(true)
    await fetch('/api/about', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(aboutForm) })
    setSaving(false); showToast('About updated'); fetchData()
  }

  const inputClass = "w-full bg-dark-200 border border-dark-400 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-neon/40"
  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'projects', label: 'Projects', count: projects.length },
    { key: 'services', label: 'Services', count: services.length },
    { key: 'stats', label: 'Stats', count: stats.length },
    { key: 'templates', label: 'Templates', count: templates.length },
    { key: 'purchases', label: 'Purchases', count: purchases.filter(p => p.status === 'pending').length },
    { key: 'messages', label: 'Messages', count: messages.filter(m => m.status === 'unread').length },
    { key: 'about', label: 'About' },
  ]

  return (
    <div className="min-h-screen bg-dark text-white">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-neon text-dark font-mono text-xs font-medium px-4 py-2.5 rounded">
          {toast}
        </div>
      )}

      <div className="border-b border-dark-300 px-6 py-4 flex items-center justify-between bg-dark-100">
        <div>
          <div className="font-mono text-neon text-sm">biltechie<span className="animate-blink">_</span></div>
          <div className="font-mono text-xs text-white/30">Admin Dashboard</div>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" className="font-mono text-xs text-white/30 hover:text-white border border-dark-400 px-3 py-1.5 rounded transition-colors">View Site ↗</a>
          <a href="/templates" target="_blank" className="font-mono text-xs text-white/30 hover:text-white border border-dark-400 px-3 py-1.5 rounded transition-colors">Templates ↗</a>
          <button onClick={logout} className="font-mono text-xs text-white/30 hover:text-red-400 border border-dark-400 px-3 py-1.5 rounded transition-colors">Logout</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-dark-100 border border-dark-300 rounded-lg p-1 flex-wrap">
          {TABS.map(({ key, label, count }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`font-mono text-xs px-3 py-2 rounded transition-all flex items-center gap-1.5 ${tab === key ? 'bg-neon text-dark font-medium' : 'text-white/40 hover:text-white'}`}>
              {label}
              {count !== undefined && count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-dark/20' : key === 'purchases' && count > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-dark-400 text-white/30'}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="font-mono text-xs text-white/30 animate-pulse">Loading...</div>
        ) : (
          <>
            {/* PROJECTS */}
            {tab === 'projects' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-mono text-sm text-white/60">Projects ({projects.length})</h2>
                  <button onClick={() => setEditingProject({ title: '', description: '', tags: [], stack: [], visible: true, featured: false, sort_order: projects.length + 1 })}
                    className="bg-neon text-dark font-mono text-xs font-medium px-4 py-2 rounded hover:bg-neon/90 transition-all">+ Add Project</button>
                </div>
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div key={p.id} className="bg-dark-100 border border-dark-300 rounded-lg p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm text-white">{p.title}</div>
                        <div className="font-mono text-xs text-white/30 truncate mt-0.5">{p.description}</div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {p.tags.slice(0, 3).map(tag => <span key={tag} className="font-mono text-xs text-neon/50 bg-neon/5 px-2 py-0.5 rounded">{tag}</span>)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => toggleProject(p.id, p.visible)} className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${p.visible ? 'text-neon border-neon/30 bg-neon/5' : 'text-white/30 border-dark-400'}`}>{p.visible ? 'Live' : 'Hidden'}</button>
                        <button onClick={() => setEditingProject({ ...p, tags: p.tags as unknown as string[], stack: p.stack as unknown as string[] })} className="font-mono text-xs text-white/40 hover:text-white border border-dark-400 px-3 py-1.5 rounded transition-colors">Edit</button>
                        <button onClick={() => deleteProject(p.id)} className="font-mono text-xs text-red-400/60 hover:text-red-400 border border-dark-400 px-3 py-1.5 rounded transition-colors">Del</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SERVICES */}
            {tab === 'services' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-mono text-sm text-white/60">Services ({services.length})</h2>
                  <button onClick={() => setEditingService({ name: '', description: '', icon: 'code', visible: true, sort_order: services.length + 1 })}
                    className="bg-neon text-dark font-mono text-xs font-medium px-4 py-2 rounded hover:bg-neon/90 transition-all">+ Add Service</button>
                </div>
                <div className="space-y-3">
                  {services.map((s) => (
                    <div key={s.id} className="bg-dark-100 border border-dark-300 rounded-lg p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm text-white">{s.name}</div>
                        <div className="font-mono text-xs text-white/30 truncate mt-0.5">{s.description}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => toggleService(s.id, s.visible)} className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${s.visible ? 'text-neon border-neon/30 bg-neon/5' : 'text-white/30 border-dark-400'}`}>{s.visible ? 'Visible' : 'Hidden'}</button>
                        <button onClick={() => setEditingService(s)} className="font-mono text-xs text-white/40 hover:text-white border border-dark-400 px-3 py-1.5 rounded transition-colors">Edit</button>
                        <button onClick={() => deleteService(s.id)} className="font-mono text-xs text-red-400/60 hover:text-red-400 border border-dark-400 px-3 py-1.5 rounded transition-colors">Del</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STATS */}
            {tab === 'stats' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-mono text-sm text-white/60">Stats ({stats.length})</h2>
                  <button onClick={() => setEditingStat({ label: '', value: '', visible: true, sort_order: stats.length + 1 })}
                    className="bg-neon text-dark font-mono text-xs font-medium px-4 py-2 rounded hover:bg-neon/90 transition-all">+ Add Stat</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((s) => (
                    <div key={s.id} className="bg-dark-100 border border-dark-300 rounded-lg p-4">
                      <div className="font-mono text-2xl text-neon mb-1">{s.value}</div>
                      <div className="font-mono text-xs text-white/30 mb-3">{s.label}</div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingStat(s)} className="font-mono text-xs text-white/40 hover:text-white border border-dark-400 px-3 py-1.5 rounded transition-colors flex-1">Edit</button>
                        <button onClick={() => deleteStat(s.id)} className="font-mono text-xs text-red-400/60 hover:text-red-400 border border-dark-400 px-3 py-1.5 rounded transition-colors">Del</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TEMPLATES */}
            {tab === 'templates' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-mono text-sm text-white/60">Templates ({templates.length})</h2>
                  <button onClick={() => setEditingTemplate({ name: '', description: '', category: 'Mint Page', price: 49, stack: [], features: [], visible: true, sort_order: templates.length + 1 })}
                    className="bg-neon text-dark font-mono text-xs font-medium px-4 py-2 rounded hover:bg-neon/90 transition-all">+ Add Template</button>
                </div>
                <div className="space-y-3">
                  {templates.map((t) => (
                    <div key={t.id} className="bg-dark-100 border border-dark-300 rounded-lg p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="font-mono text-sm text-white">{t.name}</div>
                          <span className="font-mono text-xs text-neon/60 bg-neon/5 px-2 py-0.5 rounded">{t.category}</span>
                          {t.badge && <span className="font-mono text-xs text-amber-400/60 bg-amber-500/5 px-2 py-0.5 rounded">{t.badge}</span>}
                        </div>
                        <div className="font-mono text-xs text-white/30 truncate">{t.description}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="font-mono text-sm text-neon font-medium">${t.price}</span>
                          {t.preview_url && <span className="font-mono text-xs text-white/20 truncate">{t.preview_url}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => toggleTemplate(t.id, t.visible)} className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${t.visible ? 'text-neon border-neon/30 bg-neon/5' : 'text-white/30 border-dark-400'}`}>{t.visible ? 'Live' : 'Hidden'}</button>
                        <button onClick={() => setEditingTemplate({ ...t, stack: t.stack as unknown as string[], features: t.features as unknown as string[] })} className="font-mono text-xs text-white/40 hover:text-white border border-dark-400 px-3 py-1.5 rounded transition-colors">Edit</button>
                        <button onClick={() => deleteTemplate(t.id)} className="font-mono text-xs text-red-400/60 hover:text-red-400 border border-dark-400 px-3 py-1.5 rounded transition-colors">Del</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PURCHASES */}
            {tab === 'purchases' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-mono text-sm text-white/60">Purchase Requests ({purchases.length})</h2>
                  <div className="flex gap-2">
                    {['pending', 'contacted', 'completed'].map(s => (
                      <span key={s} className={`font-mono text-xs px-2 py-1 rounded border ${STATUS_COLORS[s]}`}>
                        {purchases.filter(p => p.status === s).length} {s}
                      </span>
                    ))}
                  </div>
                </div>
                {purchases.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-dark-400 rounded-xl">
                    <div className="font-mono text-xs text-white/20">No purchase requests yet.</div>
                    <div className="font-mono text-xs text-white/10 mt-1">They'll appear here when someone buys a template.</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {purchases.map((p) => (
                      <div key={p.id} className="bg-dark-100 border border-dark-300 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <div className="font-mono text-sm text-white">{p.name}</div>
                              <span className={`font-mono text-xs px-2 py-0.5 rounded border ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                            </div>
                            <div className="font-mono text-xs text-neon/60 mb-1">{p.template_name}</div>
                            <a href={`mailto:${p.email}`} className="font-mono text-xs text-white/40 hover:text-neon transition-colors">{p.email}</a>
                            {p.message && <div className="font-mono text-xs text-white/25 mt-2 border-l border-dark-400 pl-3 leading-relaxed">{p.message}</div>}
                            <div className="font-mono text-xs text-white/15 mt-2">{new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            {p.status === 'pending' && (
                              <button onClick={() => updatePurchaseStatus(p.id, 'contacted')}
                                className="font-mono text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded hover:bg-blue-500/20 transition-colors">
                                Mark contacted
                              </button>
                            )}
                            {p.status === 'contacted' && (
                              <button onClick={() => updatePurchaseStatus(p.id, 'completed')}
                                className="font-mono text-xs bg-neon/10 text-neon border border-neon/20 px-3 py-1.5 rounded hover:bg-neon/20 transition-colors">
                                Mark completed
                              </button>
                            )}
                            <a href={`mailto:${p.email}?subject=Your ${p.template_name} purchase request&body=Hi ${p.name},%0A%0AThanks for your interest in ${p.template_name}.`}
                              className="font-mono text-xs text-white/30 hover:text-white border border-dark-400 px-3 py-1.5 rounded transition-colors text-center">
                              Reply
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MESSAGES */}
            {tab === 'messages' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-mono text-sm text-white/60">Contact Messages ({messages.length})</h2>
                  <div className="flex gap-2">
                    <span className="font-mono text-xs px-2 py-1 rounded border text-amber-400 border-amber-500/30 bg-amber-500/10">
                      {messages.filter(m => m.status === 'unread').length} unread
                    </span>
                  </div>
                </div>
                {messages.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-dark-400 rounded-xl">
                    <div className="font-mono text-xs text-white/20">No messages yet.</div>
                    <div className="font-mono text-xs text-white/10 mt-1">They'll appear here when someone uses the contact form.</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((m) => (
                      <div key={m.id} className={`bg-dark-100 border rounded-lg p-4 ${m.status === 'unread' ? 'border-neon/20' : 'border-dark-300'}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <div className="font-mono text-sm text-white">{m.name}</div>
                              {m.status === 'unread' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-neon" />
                              )}
                            </div>
                            <a href={`mailto:${m.email}`} className="font-mono text-xs text-white/40 hover:text-neon transition-colors">{m.email}</a>
                            <div className="font-mono text-xs text-white/45 mt-2 border-l border-dark-400 pl-3 leading-relaxed whitespace-pre-wrap">{m.message}</div>
                            <div className="font-mono text-xs text-white/15 mt-2">
                              {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            {m.status === 'unread' && (
                              <button onClick={async () => {
                                await fetch('/api/contact', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: m.id, status: 'read' }) })
                                showToast('Marked as read'); fetchData()
                              }}
                                className="font-mono text-xs bg-neon/10 text-neon border border-neon/20 px-3 py-1.5 rounded hover:bg-neon/20 transition-colors">
                                Mark read
                              </button>
                            )}
                            <a href={`mailto:${m.email}?subject=Re: your message&body=Hi ${m.name},%0A%0A`}
                              className="font-mono text-xs text-white/30 hover:text-white border border-dark-400 px-3 py-1.5 rounded transition-colors text-center">
                              Reply
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ABOUT */}
            {tab === 'about' && aboutForm && (
              <div>
                <h2 className="font-mono text-sm text-white/60 mb-5">About & Contact</h2>
                <div className="bg-dark-100 border border-dark-300 rounded-xl p-6 space-y-4">
                  <div>
                    <label className="font-mono text-xs text-white/40 block mb-1">Bio</label>
                    <textarea value={aboutForm.bio || ''} onChange={e => setAboutForm(prev => ({ ...prev, bio: e.target.value }))} rows={5} className={inputClass} />
                  </div>
                  <div>
                    <label className="font-mono text-xs text-white/40 block mb-1">Availability status</label>
                    <input value={aboutForm.availability_status || ''} onChange={e => setAboutForm(prev => ({ ...prev, availability_status: e.target.value }))} className={inputClass} />
                  </div>
                  <Toggle label="Currently available" checked={aboutForm.available ?? true} onChange={v => setAboutForm(prev => ({ ...prev, available: v }))} />
                  <div className="border-t border-dark-300 pt-4 space-y-3">
                    <div className="font-mono text-xs text-white/30 uppercase tracking-widest">Social links</div>
                    {[
                      { key: 'twitter_url', label: 'X / Twitter URL' },
                      { key: 'github_url', label: 'GitHub URL' },
                      { key: 'tiktok_url', label: 'TikTok URL' },
                      { key: 'email', label: 'Email address' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="font-mono text-xs text-white/40 block mb-1">{label}</label>
                        <input value={(aboutForm as Record<string, unknown>)[key] as string || ''} onChange={e => setAboutForm(prev => ({ ...prev, [key]: e.target.value }))} className={inputClass} />
                      </div>
                    ))}
                  </div>
                  <button onClick={saveAbout} disabled={saving} className="w-full bg-neon text-dark font-mono font-medium text-xs py-3 rounded hover:bg-neon/90 disabled:opacity-50 transition-all">
                    {saving ? 'Saving...' : 'Save About'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* PROJECT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 border border-dark-300 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-mono text-sm text-white">{editingProject.id ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setEditingProject(null)} className="text-white/30 hover:text-white font-mono text-xs">✕</button>
            </div>
            <div className="space-y-3">
              {[
                { key: 'title', label: 'Title', placeholder: 'Project name' },
                { key: 'description', label: 'Description', placeholder: 'Short description' },
                { key: 'live_url', label: 'Live URL', placeholder: 'https://...' },
                { key: 'github_url', label: 'GitHub URL', placeholder: 'https://github.com/...' },
                { key: 'image_url', label: 'Image URL (optional)', placeholder: 'Leave blank for live preview' },
              ].map(({ key, label, placeholder }) => (
                <Input key={key} label={label} placeholder={placeholder}
                  value={(editingProject as Record<string, unknown>)[key] as string || ''}
                  onChange={v => setEditingProject(prev => ({ ...prev, [key]: v }))} />
              ))}
              <Input label="Tags (comma separated)" placeholder="NFT, Live, Mainnet"
                value={Array.isArray(editingProject.tags) ? (editingProject.tags as unknown as string[]).join(', ') : String(editingProject.tags || '')}
                onChange={v => setEditingProject(prev => ({ ...prev, tags: v as unknown as string[] }))} />
              <Input label="Stack (comma separated)" placeholder="Next.js, Solidity, Supabase"
                value={Array.isArray(editingProject.stack) ? (editingProject.stack as unknown as string[]).join(', ') : String(editingProject.stack || '')}
                onChange={v => setEditingProject(prev => ({ ...prev, stack: v as unknown as string[] }))} />
              <div className="flex gap-4">
                <Toggle label="Featured" checked={editingProject.featured || false} onChange={v => setEditingProject(prev => ({ ...prev, featured: v }))} />
                <Toggle label="Visible" checked={editingProject.visible ?? true} onChange={v => setEditingProject(prev => ({ ...prev, visible: v }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveProject} disabled={saving} className="flex-1 bg-neon text-dark font-mono font-medium text-xs py-2.5 rounded hover:bg-neon/90 disabled:opacity-50">{saving ? 'Saving...' : 'Save Project'}</button>
              <button onClick={() => setEditingProject(null)} className="border border-dark-400 text-white/40 font-mono text-xs px-4 py-2.5 rounded hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE MODAL */}
      {editingService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 border border-dark-300 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-mono text-sm text-white">{editingService.id ? 'Edit Service' : 'New Service'}</h3>
              <button onClick={() => setEditingService(null)} className="text-white/30 hover:text-white font-mono text-xs">✕</button>
            </div>
            <div className="space-y-3">
              <Input label="Name" placeholder="Smart Contracts" value={editingService.name || ''} onChange={v => setEditingService(prev => ({ ...prev, name: v }))} />
              <Input label="Description" placeholder="What this service covers..." value={editingService.description || ''} onChange={v => setEditingService(prev => ({ ...prev, description: v }))} />
              <div>
                <label className="font-mono text-xs text-white/40 block mb-2">Icon</label>
                <div className="grid grid-cols-5 gap-2">
                  {ICONS.map(icon => (
                    <button key={icon} onClick={() => setEditingService(prev => ({ ...prev, icon }))}
                      className={`font-mono text-xs py-1.5 rounded border transition-all ${editingService.icon === icon ? 'border-neon text-neon bg-neon/5' : 'border-dark-400 text-white/30 hover:text-white'}`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <Toggle label="Visible" checked={editingService.visible ?? true} onChange={v => setEditingService(prev => ({ ...prev, visible: v }))} />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveService} disabled={saving} className="flex-1 bg-neon text-dark font-mono font-medium text-xs py-2.5 rounded hover:bg-neon/90 disabled:opacity-50">{saving ? 'Saving...' : 'Save Service'}</button>
              <button onClick={() => setEditingService(null)} className="border border-dark-400 text-white/40 font-mono text-xs px-4 py-2.5 rounded hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* STAT MODAL */}
      {editingStat && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 border border-dark-300 rounded-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-mono text-sm text-white">{editingStat.id ? 'Edit Stat' : 'New Stat'}</h3>
              <button onClick={() => setEditingStat(null)} className="text-white/30 hover:text-white font-mono text-xs">✕</button>
            </div>
            <div className="space-y-3">
              <Input label="Value" placeholder="24k+" value={editingStat.value || ''} onChange={v => setEditingStat(prev => ({ ...prev, value: v }))} />
              <Input label="Label" placeholder="NFTs generated" value={editingStat.label || ''} onChange={v => setEditingStat(prev => ({ ...prev, label: v }))} />
              <Toggle label="Visible" checked={editingStat.visible ?? true} onChange={v => setEditingStat(prev => ({ ...prev, visible: v }))} />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveStat} disabled={saving} className="flex-1 bg-neon text-dark font-mono font-medium text-xs py-2.5 rounded hover:bg-neon/90 disabled:opacity-50">{saving ? 'Saving...' : 'Save Stat'}</button>
              <button onClick={() => setEditingStat(null)} className="border border-dark-400 text-white/40 font-mono text-xs px-4 py-2.5 rounded hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATE MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 border border-dark-300 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-mono text-sm text-white">{editingTemplate.id ? 'Edit Template' : 'New Template'}</h3>
              <button onClick={() => setEditingTemplate(null)} className="text-white/30 hover:text-white font-mono text-xs">✕</button>
            </div>
            <div className="space-y-3">
              <Input label="Name" placeholder="NFT Mint Page Pro" value={editingTemplate.name || ''} onChange={v => setEditingTemplate(prev => ({ ...prev, name: v }))} />
              <Input label="Description" placeholder="Short description shown on cards" value={editingTemplate.description || ''} onChange={v => setEditingTemplate(prev => ({ ...prev, description: v }))} />
              <Input label="Long description (optional)" placeholder="Full description for detail view" value={editingTemplate.long_description || ''} onChange={v => setEditingTemplate(prev => ({ ...prev, long_description: v }))} textarea />
              <div>
                <label className="font-mono text-xs text-white/40 block mb-1">Category</label>
                <input
                  value={editingTemplate.category || ''}
                  onChange={e => setEditingTemplate(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g. E-commerce, Admin Dashboard, Real Estate, Blog, Mint Page..."
                  className={inputClass}
                  list="category-suggestions"
                />
                <datalist id="category-suggestions">
                  {Array.from(new Set(templates.map(t => t.category))).map(c => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <p className="font-mono text-xs text-white/20 mt-1">Type any category — it'll show up as a filter automatically.</p>
              </div>
              <div>
                <label className="font-mono text-xs text-white/40 block mb-1">Price (USD)</label>
                <input type="number" value={editingTemplate.price || ''} onChange={e => setEditingTemplate(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="49" className={inputClass} />
              </div>
              <Input label="Preview URL (Vercel demo)" placeholder="https://your-template.vercel.app" value={editingTemplate.preview_url || ''} onChange={v => setEditingTemplate(prev => ({ ...prev, preview_url: v }))} />
              <Input label="Stack (comma separated)" placeholder="Next.js, RainbowKit, Tailwind" value={Array.isArray(editingTemplate.stack) ? (editingTemplate.stack as unknown as string[]).join(', ') : String(editingTemplate.stack || '')} onChange={v => setEditingTemplate(prev => ({ ...prev, stack: v as unknown as string[] }))} />
              <Input label="Features (comma separated)" placeholder="Wallet connection, Dark theme, Mobile responsive" value={Array.isArray(editingTemplate.features) ? (editingTemplate.features as unknown as string[]).join(', ') : String(editingTemplate.features || '')} onChange={v => setEditingTemplate(prev => ({ ...prev, features: v as unknown as string[] }))} />
              <div>
                <label className="font-mono text-xs text-white/40 block mb-2">Badge (optional)</label>
                <div className="flex gap-2">
                  {['', 'New', 'Popular', 'Hot'].map(b => (
                    <button key={b} onClick={() => setEditingTemplate(prev => ({ ...prev, badge: b || undefined }))}
                      className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${editingTemplate.badge === b || (!editingTemplate.badge && b === '') ? 'border-neon text-neon bg-neon/5' : 'border-dark-400 text-white/30 hover:text-white'}`}>
                      {b || 'None'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <Toggle label="Visible" checked={editingTemplate.visible ?? true} onChange={v => setEditingTemplate(prev => ({ ...prev, visible: v }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveTemplate} disabled={saving} className="flex-1 bg-neon text-dark font-mono font-medium text-xs py-2.5 rounded hover:bg-neon/90 disabled:opacity-50">{saving ? 'Saving...' : 'Save Template'}</button>
              <button onClick={() => setEditingTemplate(null)} className="border border-dark-400 text-white/40 font-mono text-xs px-4 py-2.5 rounded hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
