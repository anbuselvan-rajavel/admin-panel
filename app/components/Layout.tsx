import React, { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface LayoutProps{
    children: ReactNode;
}

const Layout = ({children}: LayoutProps) => {
  return (
    <div className='flex min-h-screen'>
        <Sidebar/>
        <main className='flex-1 p-5 bg-zinc-100'>
            {children}
        </main>
    </div>
  )
}

export default Layout