"use client"

import { Category } from '@/types/product'
import productsData from '@/data/products.json'
import ProductCard from './ProductCard'

interface Props {
  category: Category
}

export default function ProductGrid({ category }: Props) {
  const products = productsData.products.filter((p) => p.category === category)

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
        {products.length} items — double-click item to view
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
      }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p as import('@/types/product').Product} />
        ))}
      </div>
    </div>
  )
}
