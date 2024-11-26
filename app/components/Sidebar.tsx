"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Home, User, Settings, BriefcaseMedical, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';  // Import usePathname

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();  // Get the current pathname

    // Function to toggle the sidebar collapse state
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Determine which menu should be active based on the pathname
    const getActiveMenu = () => {
        if (pathname === "/") return "dashboard";
        if (pathname.startsWith("/employees")) return "employees";
        if (pathname.startsWith("/users")) return "users";
        if (pathname.startsWith("/settings")) return "settings";
        return "dashboard";  // Default if no match
    };

    const activeMenu = getActiveMenu();  // Set active menu based on the current route

    return (
        <div className={`bg-zinc-100 text-black transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} min-h-screen`}>
            <div className="p-4 flex justify-between items-center">
                {!isCollapsed && <h2 className="text-2xl font-bold"><span className='text-violet-500'>Admin</span> Panel</h2>}
                <button onClick={toggleSidebar} className="focus:outline-none">
                    {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft />} 
                </button>
            </div>

            <nav className="mt-10 space-y-2">
                {/* Dashboard Link */}
                <Link 
                    href="/" 
                    className={`py-2.5 px-4 rounded transition duration-200 flex items-center ${activeMenu === 'dashboard' ? 'bg-zinc-300 text-violet-500' : 'hover:bg-zinc-300'}`}
                >
                    <Home size={24} color={activeMenu === 'dashboard' ? 'violet' : 'currentColor'} />
                    <span className={`ml-2 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>Dashboard</span>
                </Link>

                {/* Employees Link */}
                <Link 
                    href="/employees" 
                    className={`py-2.5 px-4 rounded transition duration-200 flex items-center ${activeMenu === 'employees' ? 'bg-zinc-300 text-green-500' : 'hover:bg-zinc-300'}`}
                >
                    <BriefcaseMedical size={24} color={activeMenu === 'employees' ? 'green' : 'currentColor'} />
                    <span className={`ml-2 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>Employees</span>
                </Link>

                {/* Users Link */}
                <Link 
                    href="/users" 
                    className={`py-2.5 px-4 rounded transition duration-200 flex items-center ${activeMenu === 'users' ? 'bg-zinc-300 text-red-500' : 'hover:bg-zinc-300'}`}
                >
                    <User size={24} color={activeMenu === 'users' ? 'red' : 'currentColor'} />
                    <span className={`ml-2 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>Users</span>
                </Link>

                {/* Settings Link */}
                <Link 
                    href="/settings" 
                    className={`py-2.5 px-4 rounded transition duration-200 flex items-center ${activeMenu === 'settings' ? 'bg-zinc-300 text-blue-500' : 'hover:bg-zinc-300'}`}
                >
                    <Settings size={24} color={activeMenu === 'settings' ? 'blue' : 'currentColor'} />
                    <span className={`ml-2 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>Settings</span>
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
