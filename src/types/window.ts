export type WindowId =
  | 'shop_women'
  | 'shop_men'
  | 'cart'
  | 'readme'
  | 'product_detail'
  | 'checkout'
  | 'confirmation'

export interface WindowState {
  id: WindowId
  isOpen: boolean
  isMinimized: boolean
  zIndex: number
  meta?: { productId?: string }
}

export type WindowsMap = Record<WindowId, WindowState>
