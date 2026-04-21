"use client"

import Image from 'next/image'
import { Product } from '@/types/product'
import { useWindows } from '@/context/WindowContext'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { dispatch } = useWindows()

  const handleClick = () => {
    dispatch({ type: 'SET_PRODUCT_DETAIL', productId: product.id })
  }

  return (
    <div className="product-card" onClick={handleClick} style={{ padding: '12px' }}>
      {/* Product image */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          background: '#111',
          border: '1px solid var(--border)',
          marginBottom: '10px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '11px',
          color: 'var(--text)',
          marginBottom: '6px',
          letterSpacing: '0.04em',
          lineHeight: 1.5,
        }}
      >
        {product.name}
      </div>

      {/* Price */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '16px',
          color: 'var(--cyan)',
        }}
      >
        ${product.price.toFixed(2)}
      </div>
    </div>
  )
}
