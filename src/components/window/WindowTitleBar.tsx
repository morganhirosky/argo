"use client"

import { WindowId } from '@/types/window'
import { useWindows } from '@/context/WindowContext'

interface Props {
  id: WindowId
  title: string
  isActive: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

export default function WindowTitleBar({ id, title, isActive, onMouseDown }: Props) {
  const { dispatch } = useWindows()

  return (
    <div
      className={isActive ? 'win-titlebar' : 'win-titlebar-inactive'}
      style={{ display: 'flex', alignItems: 'center', height: '28px', padding: '0 6px', gap: '6px', cursor: 'move' }}
      onMouseDown={onMouseDown}
    >
      {/* Title */}
      <span
        style={{
          flex: 1,
          fontFamily: 'var(--font-pixel)',
          fontSize: '9px',
          color: isActive ? '#fff' : 'var(--text-dim)',
          letterSpacing: '0.05em',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </span>

      {/* Control buttons */}
      <div style={{ display: 'flex', gap: '3px' }} onMouseDown={(e) => e.stopPropagation()}>
        <button
          className="win-btn"
          style={{ width: '16px', height: '16px' }}
          title="Minimize"
          onClick={() => dispatch({ type: 'MINIMIZE_WINDOW', id })}
        >
          _
        </button>
        <button
          className="win-btn"
          style={{ width: '24px', height: '24px', fontSize: '14px' }}
          title="Close"
          onClick={() => dispatch({ type: 'CLOSE_WINDOW', id })}
        >
          ×
        </button>
      </div>
    </div>
  )
}
