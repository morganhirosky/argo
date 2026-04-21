"use client"

import { useCart } from '@/context/CartContext'
import { useWindows } from '@/context/WindowContext'
import CartItem from './CartItem'

export default function CartWindow() {
  const { state } = useCart()
  const { dispatch } = useWindows()

  if (state.items.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '24px' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--text-dim)', textAlign: 'center', lineHeight: 2 }}>
          cart is empty<br/>
          <span style={{ color: 'var(--text-dim)', fontSize: '7px' }}>add items from the shop</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {state.items.map((item) => (
          <CartItem key={`${item.productId}-${item.size}`} item={item} />
        ))}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '12px 16px',
        background: 'var(--chrome)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--text-dim)' }}>TOTAL</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', color: 'var(--cyan)' }}>
            ${state.total.toFixed(2)}
          </span>
        </div>
        <button
          className="pixel-btn"
          style={{ width: '100%' }}
          onClick={() => dispatch({ type: 'OPEN_WINDOW', id: 'checkout' })}
        >
          PROCEED_TO_CHECKOUT.exe
        </button>
      </div>
    </div>
  )
}
