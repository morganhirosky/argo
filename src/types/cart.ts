export interface CartItem {
  productId: string
  name: string
  size: string
  price: number
  quantity: number
}

export interface CartState {
  items: CartItem[]
  total: number
  count: number
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: { productId: string; name: string; size: string; price: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: string } }
  | { type: 'UPDATE_QTY'; payload: { productId: string; size: string; quantity: number } }
  | { type: 'CLEAR_CART' }
