import React from 'react'
import NavLogo from './nav-logo'
import UserButton from './user-button'
import { auth } from '@/server/auth'
import { ModeToggle } from '@/components/mode-button'

const AppNav = async() => {
    const session = await auth();
    console.log(session);

  return (
      <div className='w-full h-16 border-b border-b-slate-200 flex items-center justify-between px-4'>
      <NavLogo />
      <div className='flex gap-2 '>
        
        <UserButton user={session?.user} />
        <ModeToggle/>
      </div>
    </div>
  )
}

export default AppNav