import { useEffect, useRef, useState } from 'react'

export function useCardDrop(count: number, threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [dropped, setDropped] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !dropped) {
        setDropped(true)
        observer.disconnect()
      }
    }, { threshold })

    observer.observe(el)
    return () => observer.disconnect()
  }, [dropped, threshold])

  return { ref, dropped }
}
