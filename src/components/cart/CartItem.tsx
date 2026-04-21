"use client"

import { CartItem as CartItemType } from '@/types/cart'
import { useCart } from '@/context/CartContext'

interface Props {
  item: CartItemType
}

export default function CartItem({ item }: Props) {
  const { dispatch } = useCart()

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto auto auto',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Name + size */}
      <div>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', color: 'var(--text)', marginBottom: '4px', lineHeight: 1.5 }}>
          {item.name}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
          sz: {item.size}
        </div>
      </div>

      {/* Qty controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          className="win-btn"
          style={{ width: '20px', height: '20px' }}
          onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { productId: item.productId, size: item.size, quantity: item.quantity - 1 } })}
        >
          -
        </button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text)', minWidth: '16px', textAlign: 'center' }}>
          {item.quantity}
        </span>
        <button
          className="win-btn"
          style={{ width: '20px', height: '20px' }}
          onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { productId: item.productId, size: item.size, quantity: item.quantity + 1 } })}
        >
          +
        </button>
      </div>

      {/* Price */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--cyan)', textAlign: 'right' }}>
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      {/* Remove */}
      <button
        className="win-btn pixel-btn-red"
        style={{ width: '20px', height: '20px', border: 'none' }}
        title="Remove"
        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { productId: item.productId, size: item.size } })}
      >
        ×
      </button>
    </div>
  )
}
