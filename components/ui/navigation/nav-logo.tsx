import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NavLogo = () => {
  return (
      <Link href={'/'} className='flex items-center'>
          <ShoppingCart className='mr-2' size={20} />
          <span className='font-bold text-lg'>TechStore</span>
        </Link>
  )
}

export default NavLogo