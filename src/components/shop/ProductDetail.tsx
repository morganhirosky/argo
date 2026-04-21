"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import productsData from '@/data/products.json'
import { Product, Size } from '@/types/product'

interface Props {
  productId: string
}

export default function ProductDetail({ productId }: Props) {
  const product = productsData.products.find((p) => p.id === productId) as Product | undefined
  const { dispatch } = useCart()
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div style={{ padding: '24px', fontFamily: 'var(--font-pixel)', fontSize: '9px', color: 'var(--red)' }}>
        PRODUCT_NOT_FOUND
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) return
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        name: product.name,
        size: selectedSize,
        price: product.price,
      },
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Product image */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        aspectRatio: '1',
        background: '#111',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        alignSelf: 'center',
        position: 'relative',
      }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{ objectFit: 'contain', objectPosition: 'center' }}
        />
      </div>

      {/* Name */}
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--text)', letterSpacing: '0.05em', lineHeight: 1.6 }}>
        {product.name}
      </div>

      {/* Price */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--cyan)' }}>
        ${product.price.toFixed(2)}
      </div>

      {/* Description */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.6 }}>
        {product.description}
      </div>

      {/* Sizes */}
      <div>
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--text-dim)', marginBottom: '8px', letterSpacing: '0.06em' }}>
          SELECT SIZE
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {product.sizes.map((size) => (
            <button
              key={size}
              className={`size-btn${selectedSize === size ? ' selected' : ''}`}
              onClick={() => setSelectedSize(size as Size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add to cart */}
      <button
        className="pixel-btn"
        style={{ alignSelf: 'flex-start', opacity: selectedSize ? 1 : 0.4 }}
        onClick={handleAddToCart}
        disabled={!selectedSize}
      >
        {added ? '✓ ADDED' : '+ ADD_TO_CART'}
      </button>

      {!selectedSize && (
        <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', color: 'var(--red)' }}>
          select a size first
        </div>
      )}
    </div>
  )
}
