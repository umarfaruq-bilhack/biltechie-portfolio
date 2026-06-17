'use client'
import { useEffect, useRef } from 'react'

export default function FloatingOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -999, y: -999 })
  const raf = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => { mouse.current = { x: -999, y: -999 } }
    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    let t = 0
    const draw = () => {
      t += 0.015
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width * 0.82 + Math.sin(t * 0.6) * 12
      const cy = canvas.height * 0.38 + Math.cos(t * 0.4) * 16

      const mx = mouse.current.x, my = mouse.current.y
      const dx = mx - cx, dy = my - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const proximity = Math.max(0, 1 - dist / 200)

      const r = 80 + Math.sin(t) * 10 + proximity * 20

      // Outer glow
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      g1.addColorStop(0, `rgba(0,255,136,${0.12 + proximity * 0.08})`)
      g1.addColorStop(0.5, `rgba(0,255,136,${0.04 + proximity * 0.04})`)
      g1.addColorStop(1, 'rgba(0,255,136,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = g1
      ctx.fill()

      // Inner ring
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.3 + Math.sin(t * 2) * 4, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0,255,136,${0.3 + proximity * 0.3})`
      ctx.lineWidth = 0.8
      ctx.stroke()

      // Outer ring
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.7 + Math.cos(t) * 6, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0,255,136,${0.1 + proximity * 0.15})`
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Orbiting dot
      const orbitR = r * 0.55
      const ox = cx + Math.cos(t * 1.5) * orbitR
      const oy = cy + Math.sin(t * 1.5) * orbitR
      ctx.beginPath()
      ctx.arc(ox, oy, 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0,255,136,${0.6 + proximity * 0.4})`
      ctx.fill()

      raf.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
