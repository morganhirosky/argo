"use client"

import { ReactNode, useState, useCallback, useRef, useEffect } from 'react'
import { WindowId } from '@/types/window'
import { useWindows } from '@/context/WindowContext'
import { useWindowDrag } from './useWindowDrag'
import WindowTitleBar from './WindowTitleBar'

interface Props {
  id: WindowId
  title: string
  initialPosition: { x: number; y: number }
  width: number
  height: number
  zIndex: number
  isMinimized: boolean
  children: ReactNode
}

export default function Window({
  id,
  title,
  initialPosition,
  width: initialWidth,
  height: initialHeight,
  zIndex,
  isMinimized,
  children,
}: Props) {
  const { state, dispatch } = useWindows()
  const { position, onMouseDown } = useWindowDrag(initialPosition)
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight })
  const [isMobile, setIsMobile] = useState(false)
  const resizing = useRef(false)
  const resizeOrigin = useRef<{ mouseX: number; mouseY: number; w: number; h: number } | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const isActive = state.windows[id].zIndex === state.topZ

  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    resizing.current = true
    resizeOrigin.current = { mouseX: e.clientX, mouseY: e.clientY, w: size.width, h: size.height }

    const onMouseMove = (ev: MouseEvent) => {
      if (!resizing.current || !resizeOrigin.current) return
      setSize({
        width:  Math.max(300, resizeOrigin.current.w + (ev.clientX - resizeOrigin.current.mouseX)),
        height: Math.max(200, resizeOrigin.current.h + (ev.clientY - resizeOrigin.current.mouseY)),
      })
    }

    const onMouseUp = () => {
      resizing.current = false
      resizeOrigin.current = null
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [size])

  if (isMobile) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          bottom: '36px',
          zIndex,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--chrome)',
          border: '1px solid var(--border)',
        }}
        onMouseDown={() => dispatch({ type: 'FOCUS_WINDOW', id })}
      >
        <WindowTitleBar id={id} title={title} isActive={true} onMouseDown={() => {}} />
        <div style={{ display: isMinimized ? 'none' : 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
        zIndex,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--chrome)',
        border: '1px solid var(--border)',
        ...(isActive
          ? { boxShadow: '0 0 0 1px var(--border), 0 4px 32px rgba(0,0,0,0.8), 0 0 24px rgba(147,51,234,0.12)' }
          : { boxShadow: '0 0 0 1px var(--border), 0 4px 16px rgba(0,0,0,0.6)' }),
      }}
      onMouseDown={() => dispatch({ type: 'FOCUS_WINDOW', id })}
    >
      <WindowTitleBar id={id} title={title} isActive={isActive} onMouseDown={onMouseDown} />

      {/* Content */}
      <div
        style={{
          display: isMinimized ? 'none' : 'flex',
          flexDirection: 'column',
          height: size.height,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>

      {/* Resize handle — bottom right corner */}
      {!isMinimized && (
        <div
          onMouseDown={onResizeMouseDown}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '16px',
            height: '16px',
            cursor: 'nwse-resize',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '3px',
          }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M7 1L1 7M7 4L4 7M7 7L7 7" stroke="var(--text-dim)" strokeWidth="1"/>
          </svg>
        </div>
      )}
    </div>
  )
}
