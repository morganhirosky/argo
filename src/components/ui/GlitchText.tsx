"use client"

import { useEffect, useRef, useState } from 'react'

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________'

interface Props {
  text: string
  style?: React.CSSProperties
  className?: string
  interval?: number
}

export default function GlitchText({ text, style, className, interval = 4000 }: Props) {
  const [display, setDisplay] = useState(text)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const glitch = () => {
      let frame = 0
      const frames = 10
      const iterate = () => {
        if (frame >= frames) {
          setDisplay(text)
          timer.current = setTimeout(glitch, interval)
          return
        }
        setDisplay(
          text
            .split('')
            .map((ch, i) =>
              i < frame ? ch : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
            )
            .join('')
        )
        frame++
        setTimeout(iterate, 40)
      }
      iterate()
    }

    timer.current = setTimeout(glitch, interval)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [text, interval])

  return (
    <span className={className} style={style}>
      {display}
    </span>
  )
}
