"use client"

import { WindowId } from '@/types/window'
import { useWindows } from '@/context/WindowContext'

interface Props {
  id: WindowId
  label: string
  isActive: boolean
  isMinimized: boolean
}

export default function TaskbarButton({ id, label, isActive, isMinimized }: Props) {
  const { dispatch } = useWindows()

  return (
    <button
      onClick={() => dispatch({ type: isMinimized ? 'FOCUS_WINDOW' : 'MINIMIZE_WINDOW', id })}
      style={{
        height: '24px',
        padding: '0 10px',
        background: isActive ? '#f0f0f0' : 'transparent',
        border: `1px solid ${isActive ? '#aaaaaa' : '#dddddd'}`,
        color: isActive ? '#111111' : '#888888',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontWeight: 300,
        fontSize: '11px',
        letterSpacing: '0.05em',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.1s',
      }}
    >
      {label}
    </button>
  )
}
