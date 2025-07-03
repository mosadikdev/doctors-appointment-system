import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UsersIcon, 
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

function AdminSidebar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { path: "/admin", name: "Dashboard", icon: <ChartBarIcon className="h-5 w-5" /> },
    { path: "/admin/users", name: "User Management", icon: <UsersIcon className="h-5 w-5" /> },
    { path: "/admin/reviews", name: "Review Management", icon: <ChatBubbleLeftRightIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        </div>
      </div>
      
      <nav className="py-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
              isActive(item.path)
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-6 border-t mt-auto">
        <Link 
          to="/logout" 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Logout
        </Link>
      </div>
    </div>
  );
}

export default AdminSidebar;