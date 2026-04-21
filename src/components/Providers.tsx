"use client"

import { CartProvider } from '@/context/CartContext'
import { WindowProvider } from '@/context/WindowContext'
import { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WindowProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </WindowProvider>
  )
}
