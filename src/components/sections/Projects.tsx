'use client'
import { useState, useEffect } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useCardDrop } from '@/hooks/useCardDrop'
import type { Project } from '@/types'

function ProjectPreview({ url, title, index }: { url: string; title: string; index: number }) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')
  const [imgSrc, setImgSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000) // 8s hard timeout

    fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&waitFor=1000`,
      { signal: controller.signal }
    )
      .then(res => res.json())
      .then(json => {
        if (cancelled) return
        const shot = json?.data?.screenshot?.url
        if (shot) {
          setImgSrc(shot)
        } else {
          setStatus('failed')
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('failed')
      })
      .finally(() => clearTimeout(timeout))

    return () => {
      cancelled = true
      controller.abort()
      clearTimeout(timeout)
    }
  }, [url])

  return (
    <>
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border border-neon/30 border-t-neon rounded-full animate-spin" />
            <span className="font-mono text-xs text-neon/30">Loading preview...</span>
          </div>
        </div>
      )}
      {status === 'failed' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="font-mono text-xs text-neon/30 tracking-widest uppercase mb-1">{String(index + 1).padStart(2, '0')}</div>
            <div className="font-mono text-sm text-white/20">{title}</div>
          </div>
        </div>
      )}
      {imgSrc && (
        <img src={imgSrc} alt={`${title} preview`}
          className={`w-full h-full object-cover object-top transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setStatus('loaded')} onError={() => setStatus('failed')} />
      )}
    </>
  )
}

export default function Projects({ projects }: { projects: Project[] }) {
  const headerRef = useScrollReveal()
  const { ref: gridRef, dropped } = useCardDrop(projects.length)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="work" className="py-16 md:py-24 px-4 sm:px-6 border-t border-dark-300">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="reveal mb-14">
          <span className="font-mono text-xs text-neon tracking-widest uppercase">Selected Work</span>
          <h2 className="font-mono text-3xl md:text-4xl font-medium text-white mt-3">Projects</h2>
          <p className="text-white/40 text-sm mt-3">Real contracts. Live sites. Shipped products.</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`card-drop card-electric drop-delay-${i % 6} relative bg-dark-100 border border-dark-300 rounded-xl overflow-hidden transition-all duration-300 ${
                dropped ? 'dropped' : ''
              } ${hovered === project.id ? 'border-neon/20' : ''}`}
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Preview image */}
              <div className="h-52 bg-dark-200 relative overflow-hidden border-b border-dark-300">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                ) : project.live_url ? (
                  <ProjectPreview url={project.live_url} title={project.title} index={i} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-xs text-neon/30 tracking-widest uppercase mb-1">{String(i + 1).padStart(2, '0')}</div>
                      <div className="font-mono text-sm text-white/20">{project.title}</div>
                    </div>
                  </div>
                )}

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  {project.live_url && (
                    <div className="flex items-center gap-1.5 bg-dark/70 backdrop-blur-sm border border-dark-400 rounded px-2 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
                      <span className="font-mono text-xs text-white/50">Live</span>
                    </div>
                  )}
                  {project.featured && (
                    <div className="ml-auto bg-neon/10 border border-neon/20 text-neon font-mono text-xs px-2 py-1 rounded">Featured</div>
                  )}
                </div>

                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-dark/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${hovered === project.id ? 'opacity-100' : 'opacity-0'}`}>
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" data-hover
                      className="flex items-center gap-2 bg-neon text-dark font-mono font-medium text-xs px-4 py-2 rounded hover:bg-neon/90 transition-all">
                      Visit Site
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-mono text-sm font-medium text-white">{project.title}</h3>
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" data-hover
                      className="text-white/20 hover:text-neon transition-colors ml-2 shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                      </svg>
                    </a>
                  )}
                </div>
                <p className="text-white/35 text-xs leading-relaxed mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map(tag => <span key={tag} className="font-mono text-xs text-neon/60 bg-neon/5 border border-neon/10 px-2 py-0.5 rounded">{tag}</span>)}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map(tech => <span key={tech} className="font-mono text-xs text-white/25 bg-dark-300 px-2 py-0.5 rounded">{tech}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
