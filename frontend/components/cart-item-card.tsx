import { useCreateCartitemContext } from '@/context/create-cart-item-context'
import { useDeleteCartItem } from '@/hooks/use-delete-cart-item'
import { formatToNaira } from '@/lib/utils'
import { CartItem } from '@/types'
import { Pencil, Trash2 } from 'lucide-react'

interface CartItemCardProps {
    cartItem: CartItem
}

const CartItemCard = ({ cartItem }: CartItemCardProps) => {
    const { setIsEditMode, setCreateCartItemData, setShowCartItem } = useCreateCartitemContext()
    const { mutate: deleteCartItem, isPending: isDeleting } = useDeleteCartItem()

    return (
        <div className='w-full border border-[#8F5F55] py-3 px-4 flex items-center justify-between bg-white' key={cartItem.id}>
            <div className='text-left flex flex-col items-left gap-2.5'>
                <h2>{cartItem.name}</h2>
                <p>{formatToNaira(cartItem.price)}</p>
            </div>
            <div className='flex flex-col items-center gap-2.5'>
                <p>Quantity:{cartItem.quantity}</p>
                <div className='flex items-center gap-3'>
                    <span className='w-5 h-5 rounded-full bg-[#8F5F55] text-white flex items-center justify-center cursor-pointer'><Pencil size={14} onClick={() => { setIsEditMode(true); setShowCartItem(true); setCreateCartItemData(cartItem); console.log('🔵 EDIT CLICKED - Cart Item:', cartItem); }} /></span>
                    <span className='w-5 h-5 rounded-full border border-[#8F5F55] bg-white text-red-500 flex items-center justify-center cursor-pointer'><Trash2 size={14} onClick={() => deleteCartItem(cartItem.id)} /></span>
                </div>
            </div>
        </div>
    )
}

export default CartItemCard