import { useEffect, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'

export function useScramble(target: string, delay = 300, speed = 40) {
  const [display, setDisplay] = useState(target)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplay(target.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join(''))
    let frame = 0
    const total = target.length * 5
    let timeout: ReturnType<typeof setTimeout>

    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        frame++
        const resolved = Math.floor(frame / 5)
        setDisplay(
          target.split('').map((char, i) => {
            if (i < resolved) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          }).join('')
        )
        if (frame >= total) {
          clearInterval(interval)
          setDisplay(target)
          setDone(true)
        }
      }, speed)
    }, delay)

    return () => { clearTimeout(timeout) }
  }, [target, delay, speed])

  return { display, done }
}
