"use client"

import { useEffect, useState } from 'react'
import { Category } from '@/types/product'
import productsData from '@/data/products.json'
import ProductCard from './ProductCard'

interface Props {
  category: Category
}

export default function ProductGrid({ category }: Props) {
  const products = productsData.products.filter((p) => p.category === category)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
      {/* Header */}
      <div style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: '8px',
        color: 'var(--text-dim)',
        marginBottom: '12px',
        letterSpacing: '0.08em',
      }}>
        {products.length} items — {isMobile ? 'tap' : 'double-click'} item to view
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: '8px',
      }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p as import('@/types/product').Product} />
        ))}
      </div>
    </div>
  )
}
