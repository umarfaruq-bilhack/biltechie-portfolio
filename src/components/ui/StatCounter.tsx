'use client'
import { useEffect, useRef, useState } from 'react'

interface StatCounterProps {
  value: string
  label: string
}

function parseValue(val: string): { num: number; suffix: string } {
  const match = val.match(/^(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return { num: 0, suffix: val }
  return { num: parseFloat(match[1]), suffix: match[2] }
}

export default function StatCounter({ value, label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState('0')
  const [started, setStarted] = useState(false)
  const { num, suffix } = parseValue(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true)
        observer.disconnect()
        let start: number
        const duration = 1800
        const isDecimal = num % 1 !== 0

        const step = (timestamp: number) => {
          if (!start) start = timestamp
          const progress = Math.min((timestamp - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          const current = eased * num
          setDisplay(isDecimal ? current.toFixed(1) : Math.floor(current).toString())
          if (progress < 1) requestAnimationFrame(step)
          else setDisplay(num.toString())
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [num, started])

  return (
    <div ref={ref}>
      <div className="font-mono text-xl md:text-2xl font-medium text-neon">
        {display}{suffix}
      </div>
      <div className="font-mono text-xs text-white/30 mt-1 leading-tight">{label}</div>
    </div>
  )
}
