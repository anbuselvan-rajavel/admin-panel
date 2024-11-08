import { Metadata } from 'next';
import React, { ReactNode } from 'react'


interface LayoutProps {
    children: ReactNode;
}

export const metadata: Metadata = {
    title: "Users",
    description: "Generated by create next app",
  };
  

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className='flex'>
            <main className='flex-1 pr-20'>
                {children}
            </main>
        </div>
    )
}

export default Layout