"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Home, User, Settings, Gift, PanelRightClose, PanelLeftClose } from 'lucide-react';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string>('dashboard');  // Track active menu

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu); // Update active menu when a link is clicked
    };

    return (
        <div className={`bg-zinc-100 text-black transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} min-h-screen`}>
            <div className="p-4 flex justify-between items-center">
                {!isCollapsed && <h2 className="text-2xl font-bold"><span className='text-violet-500'>Admin</span> Panel</h2>}
                <button onClick={toggleSidebar} className="focus:outline-none">
                    {isCollapsed ? <PanelRightClose size={24} /> : <PanelLeftClose />}
                </button>
            </div>

            <nav className="mt-10 space-y-2">
                {/* Dashboard Link */}
                <Link 
                    href="/" 
                    className={`block py-2.5 px-4 rounded transition duration-200 flex items-center ${activeMenu === 'dashboard' ? 'bg-zinc-300 text-violet-500' : 'hover:bg-zinc-300'}`}
                    onClick={() => handleMenuClick('dashboard')}
                >
                    <Home size={24} color={activeMenu === 'dashboard' ? 'violet' : 'currentColor'} />
                    <span className={`ml-2 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>Dashboard</span>
                </Link>

                {/* Orders Link */}
                <Link 
                    href="/orders" 
                    className={`block py-2.5 px-4 rounded transition duration-200 flex items-center ${activeMenu === 'orders' ? 'bg-zinc-300 text-green-500' : 'hover:bg-zinc-300'}`}
                    onClick={() => handleMenuClick('orders')}
                >
                    <Gift size={24} color={activeMenu === 'orders' ? 'green' : 'currentColor'} />
                    <span className={`ml-2 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>Orders</span>
                </Link>

                {/* Users Link */}
                <Link 
                    href="/users" 
                    className={`block py-2.5 px-4 rounded transition duration-200 flex items-center ${activeMenu === 'users' ? 'bg-zinc-300 text-red-500' : 'hover:bg-zinc-300'}`}
                    onClick={() => handleMenuClick('users')}
                >
                    <User size={24} color={activeMenu === 'users' ? 'red' : 'currentColor'} />
                    <span className={`ml-2 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>Users</span>
                </Link>

                {/* Settings Link */}
                <Link 
                    href="/settings" 
                    className={`block py-2.5 px-4 rounded transition duration-200 flex items-center ${activeMenu === 'settings' ? 'bg-zinc-300 text-blue-500' : 'hover:bg-zinc-300'}`}
                    onClick={() => handleMenuClick('settings')}
                >
                    <Settings size={24} color={activeMenu === 'settings' ? 'blue' : 'currentColor'} />
                    <span className={`ml-2 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>Settings</span>
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
