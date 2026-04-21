"use client"

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { WindowId } from '@/types/window'
import { useWindows } from '@/context/WindowContext'
import { useCart } from '@/context/CartContext'

interface Props {
  id?: WindowId
  label: string
  icon: string
  color?: string
  href?: string
  hideLabel?: boolean
  onDoubleClick?: () => void
}

export default function DesktopIcon({ id, label, icon, color, href, hideLabel, onDoubleClick }: Props) {
  const { dispatch } = useWindows()
  const { state: cart } = useCart()
  const router = useRouter()
  const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clickCount = useRef(0)

  const handleClick = () => {
    clickCount.current += 1
    if (clickCount.current === 1) {
      clickTimeout.current = setTimeout(() => {
        clickCount.current = 0
      }, 300)
    } else if (clickCount.current >= 2) {
      if (clickTimeout.current) clearTimeout(clickTimeout.current)
      clickCount.current = 0
      if (onDoubleClick) {
        onDoubleClick()
      } else if (href) {
        router.push(href)
      } else if (id) {
        dispatch({ type: 'OPEN_WINDOW', id })
      }
    }
  }

  const showBadge = id === 'cart' && cart.count > 0

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '8px',
        cursor: 'default',
        userSelect: 'none',
        width: '88px',
        position: 'relative',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          position: 'relative',
          transition: 'opacity 0.15s',
        }}
      >
        {icon}
        {showBadge && (
          <span className="cart-badge">{cart.count}</span>
        )}
      </div>

      {/* Label */}
      {!hideLabel && (
        <span
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 300,
            fontSize: '11px',
            color: '#333333',
            textAlign: 'center',
            lineHeight: '1.4',
            wordBreak: 'break-word',
          }}
        >
          {label}
        </span>
      )}
    </div>
  )
}
