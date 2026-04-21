"use client"

import { useWindows } from '@/context/WindowContext'

interface Props {
  orderNumber: string
}

export default function OrderConfirmation({ orderNumber }: Props) {
  const { dispatch } = useWindows()

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="terminal">
        <div>{'>'} PROCESSING ORDER...</div>
        <div>{'>'} PAYMENT RECEIVED.</div>
        <div>{'>'} ORDER CONFIRMED.</div>
        <div style={{ marginTop: '12px' }}>
          <span style={{ color: 'var(--text-dim)' }}>order_id: </span>
          <span>{orderNumber}</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-dim)' }}>status: </span>
          <span style={{ color: '#00ff88' }}>CONFIRMED</span>
        </div>
        <div style={{ marginTop: '12px', color: 'var(--text-dim)', fontSize: '11px' }}>
          a confirmation will be sent to your email.<br />
          shipping: 5–7 business days.
        </div>
      </div>

      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--text-dim)', lineHeight: 2 }}>
        thank you for your order.
      </div>

      <button
        className="pixel-btn pixel-btn-purple"
        style={{ alignSelf: 'flex-start' }}
        onClick={() => {
          dispatch({ type: 'CLOSE_WINDOW', id: 'confirmation' })
          dispatch({ type: 'CLOSE_WINDOW', id: 'checkout' })
        }}
      >
        CLOSE
      </button>
    </div>
  )
}
