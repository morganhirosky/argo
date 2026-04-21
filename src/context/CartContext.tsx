"use client"

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { CartState, CartAction, CartItem } from '@/types/cart'

const initialState: CartState = {
  items: [],
  total: 0,
  count: 0,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, name, size, price } = action.payload
      const existing = state.items.find(
        (i) => i.productId === productId && i.size === size
      )
      let items: CartItem[]
      if (existing) {
        items = state.items.map((i) =>
          i.productId === productId && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      } else {
        items = [...state.items, { productId, name, size, price, quantity: 1 }]
      }
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      const count = items.reduce((sum, i) => sum + i.quantity, 0)
      return { items, total, count }
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter(
        (i) => !(i.productId === action.payload.productId && i.size === action.payload.size)
      )
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      const count = items.reduce((sum, i) => sum + i.quantity, 0)
      return { items, total, count }
    }
    case 'UPDATE_QTY': {
      const items = state.items.map((i) =>
        i.productId === action.payload.productId && i.size === action.payload.size
          ? { ...i, quantity: action.payload.quantity }
          : i
      ).filter((i) => i.quantity > 0)
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      const count = items.reduce((sum, i) => sum + i.quantity, 0)
      return { items, total, count }
    }
    case 'CLEAR_CART':
      return initialState
    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
