"use client"

import { useWindows } from '@/context/WindowContext'
import { useCart } from '@/context/CartContext'
import { WindowId } from '@/types/window'
import TaskbarButton from './TaskbarButton'

const LABELS: Record<WindowId, string> = {
  shop_women:     'shop_women/',
  shop_men:       'shop_men/',
  cart:           'cart.exe',
  readme:         'readme.txt',
  product_detail: 'product',
  checkout:       'checkout.exe',
  confirmation:   'order_confirm',
}

export default function Taskbar() {
  const { state } = useWindows()
  const { state: cart } = useCart()

  const openWindows = Object.values(state.windows).filter((w) => w.isOpen)
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div className="taskbar">
      {/* argo start button */}
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 100,
          fontSize: '13px',
          color: '#111111',
          padding: '0 12px 0 4px',
          borderRight: '1px solid #dddddd',
          marginRight: '4px',
          letterSpacing: '0.2em',
        }}
      >
        argo
      </span>

      {/* Open window buttons */}
      {openWindows.map((w) => (
        <TaskbarButton
          key={w.id}
          id={w.id}
          label={LABELS[w.id]}
          isActive={w.zIndex === state.topZ}
          isMinimized={w.isMinimized}
        />
      ))}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Cart count + clock */}
      {cart.count > 0 && (
        <span
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '8px',
            color: 'var(--red)',
            marginRight: '12px',
          }}
        >
          [{cart.count}]
        </span>
      )}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#999999',
          padding: '0 8px',
          borderLeft: '1px solid #dddddd',
        }}
      >
        {time}
      </span>
    </div>
  )
}
