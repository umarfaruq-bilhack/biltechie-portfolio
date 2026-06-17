'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  useEffect(() => {
    if (isTouch) return

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
      const el = e.target as HTMLElement
      setHovering(!!el.closest('a, button, [data-hover]'))
    }
    const onLeave = (e: MouseEvent) => {
      if (e.relatedTarget === null) setVisible(false)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseout', onLeave, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [isTouch, pathname])

  if (!mounted || isTouch) return null

  return createPortal(
    <>
      <div
        style={{
          position: 'fixed',
          top: pos.y,
          left: pos.x,
          zIndex: 2147483647,
          pointerEvents: 'none',
          width: hovering ? '6px' : '8px',
          height: hovering ? '6px' : '8px',
          borderRadius: '50%',
          background: '#00ff88',
          opacity: visible ? 1 : 0,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.15s, height 0.15s, opacity 0.2s',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: pos.y,
          left: pos.x,
          zIndex: 2147483647,
          pointerEvents: 'none',
          width: hovering ? '40px' : '28px',
          height: hovering ? '40px' : '28px',
          borderRadius: '50%',
          border: `1px solid ${hovering ? 'rgba(0,255,136,0.7)' : 'rgba(0,255,136,0.3)'}`,
          opacity: visible ? 1 : 0,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s, opacity 0.2s, top 0.08s linear, left 0.08s linear',
        }}
      />
    </>,
    document.body
  )
}
