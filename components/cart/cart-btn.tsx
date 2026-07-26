"use client"
import { ShoppingBag } from 'lucide-react'
import CartDrawer from '../cart/cart-drawer'
import { useCartStore } from '@/store/cart-store'

const CartBtn = () => {
      const cartLength = useCartStore((state)=> state.cart.length)
  return (
     <CartDrawer>
          <div className='relative'>
          <ShoppingBag size={22} />
        {
          cartLength > 0 && <span className='absolute top-[-10px] right-[-10px] bg-primary text-white w-4 h-4 rounded-full flex items-center justify-center text-xs'>{cartLength}</span>
          }
        </div>
        </CartDrawer>
  )
}

export default CartBtn