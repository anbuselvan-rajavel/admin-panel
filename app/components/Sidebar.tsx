"use client"
import { useState } from 'react';
import Link from 'next/link';
import { Home, User, Settings, ChevronLeft, ChevronRight, Gift } from 'lucide-react';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`h-screen bg-zinc-100 text-black transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="p-4 flex justify-between items-center">
                {!isCollapsed && <h2 className="text-2xl font-bold"><span className='text-violet-500'>Admin</span> Panel</h2>}
                <button onClick={toggleSidebar} className="focus:outline-none">
                    {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                </button>
            </div>
            <nav className="mt-10 space-y-2">
                <Link href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-zinc-300 flex items-center">
                    <Home size={24} color='violet'/>
                    <span className={`ml-2 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>Dashboard</span>
                </Link>
                <Link href="/orders" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-zinc-300 flex items-center">
                    <Gift size={24} color='green'/>
                    <span className={`ml-2 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>Orders</span>
                </Link>
                <Link href="/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-zinc-300 flex items-center">
                    <User size={24} color='red'/>
                    <span className={`ml-2 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>Users</span>
                </Link>
                <Link href="/settings" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-zinc-300 flex items-center">
                    <Settings size={24} color='blue'/>
                    <span className={`ml-2 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>Settings</span>
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
