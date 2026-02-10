export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
}

export type CartItemCreate = Omit<CartItem, 'id'>;