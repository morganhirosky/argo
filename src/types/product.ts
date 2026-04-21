export type Category = 'women' | 'men'
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL'

export interface Product {
  id: string
  name: string
  category: Category
  price: number
  sizes: Size[]
  description: string
  image: string
  tags?: string[]
}
