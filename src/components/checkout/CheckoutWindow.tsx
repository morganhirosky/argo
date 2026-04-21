"use client"

import { useState, FormEvent } from 'react'
import { useCart } from '@/context/CartContext'
import { useWindows } from '@/context/WindowContext'

interface Props {
  onConfirm: (orderNumber: string) => void
}

export default function CheckoutWindow({ onConfirm }: Props) {
  const { state: cart, dispatch: cartDispatch } = useCart()
  const { dispatch: windowDispatch } = useWindows()
  const [processing, setProcessing] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', address: '', city: '', zip: '', country: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    const orderNumber = 'ARGO-' + Math.random().toString(36).slice(2, 9).toUpperCase()
    setTimeout(() => {
      cartDispatch({ type: 'CLEAR_CART' })
      setProcessing(false)
      onConfirm(orderNumber)
    }, 1800)
  }

  const fields: { name: keyof typeof form; label: string; type?: string }[] = [
    { name: 'name',    label: 'FULL NAME' },
    { name: 'email',   label: 'EMAIL',   type: 'email' },
    { name: 'address', label: 'ADDRESS' },
    { name: 'city',    label: 'CITY' },
    { name: 'zip',     label: 'ZIP / POSTAL CODE' },
    { name: 'country', label: 'COUNTRY' },
  ]

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Order summary */}
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--text-dim)', marginBottom: '8px', letterSpacing: '0.06em' }}>
          ORDER SUMMARY
        </div>
        {cart.items.map((item) => (
          <div key={`${item.productId}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text)', marginBottom: '4px' }}>
            <span>{item.name} ×{item.quantity} [{item.size}]</span>
            <span style={{ color: 'var(--cyan)' }}>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '14px', marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
          <span style={{ color: 'var(--text-dim)' }}>TOTAL</span>
          <span style={{ color: 'var(--cyan)' }}>${cart.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--text-dim)', letterSpacing: '0.06em' }}>
          SHIPPING INFO
        </div>
        {fields.map(({ name, label, type }) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
              {label}
            </label>
            <input
              className="win-input"
              name={name}
              type={type ?? 'text'}
              value={form[name]}
              onChange={handleChange}
              required
              disabled={processing}
            />
          </div>
        ))}

        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', color: 'var(--text-dim)', marginTop: '4px', lineHeight: 1.8, padding: '8px', border: '1px solid var(--border)' }}>
          DEMO MODE: no real charges will be made.
        </div>

        <button
          type="submit"
          className="pixel-btn"
          disabled={processing}
          style={{ marginTop: '4px' }}
        >
          {processing ? 'PROCESSING...' : 'PLACE_ORDER.exe'}
        </button>
      </form>
    </div>
  )
}
