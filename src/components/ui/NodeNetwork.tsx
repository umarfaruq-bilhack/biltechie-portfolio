'use client'
import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  pulse: number
  opacity: number
}

export default function NodeNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const NEON = '#00ff88'
    const NODE_COUNT = 55
    const MAX_DIST = 140
    const MOUSE_RADIUS = 160

    let nodes: Node[] = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 1,
        pulse: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.4 + 0.2,
      }))
    }

    const draw = () => {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      nodes.forEach(n => {
        n.pulse += 0.018

        // Mouse repulsion
        const mdx = n.x - mx
        const mdy = n.y - my
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < MOUSE_RADIUS) {
          const force = (1 - mdist / MOUSE_RADIUS) * 0.6
          n.vx += (mdx / mdist) * force
          n.vy += (mdy / mdist) * force
        }

        // Speed damping
        n.vx *= 0.99
        n.vy *= 0.99

        n.x += n.vx
        n.y += n.vy

        // Bounce off edges
        if (n.x < 0) { n.x = 0; n.vx *= -1 }
        if (n.x > canvas.width) { n.x = canvas.width; n.vx *= -1 }
        if (n.y < 0) { n.y = 0; n.vy *= -1 }
        if (n.y > canvas.height) { n.y = canvas.height; n.vy *= -1 }
      })

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.18
            ctx.globalAlpha = alpha
            ctx.strokeStyle = NEON
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const pulsed = n.opacity * (0.7 + 0.3 * Math.sin(n.pulse))

        // Mouse proximity brightens node
        const mdx = n.x - mx
        const mdy = n.y - my
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        const boost = mdist < MOUSE_RADIUS ? (1 - mdist / MOUSE_RADIUS) * 0.5 : 0

        ctx.globalAlpha = Math.min(pulsed + boost, 0.9)
        ctx.fillStyle = NEON
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r + boost * 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animRef.current = requestAnimationFrame(draw)
    }

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouse, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55 }}
      aria-hidden="true"
    />
  )
}
