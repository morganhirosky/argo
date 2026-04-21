"use client"

import { useState, useCallback, useRef } from 'react'

interface Position { x: number; y: number }

export function useWindowDrag(initialPosition: Position) {
  const [position, setPosition] = useState<Position>(initialPosition)
  const dragging = useRef(false)
  const origin = useRef<{ mouseX: number; mouseY: number; posX: number; posY: number } | null>(null)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    dragging.current = true
    origin.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    }

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current || !origin.current) return
      setPosition({
        x: origin.current.posX + (ev.clientX - origin.current.mouseX),
        y: origin.current.posY + (ev.clientY - origin.current.mouseY),
      })
    }

    const onMouseUp = () => {
      dragging.current = false
      origin.current = null
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [position])

  return { position, onMouseDown }
}
