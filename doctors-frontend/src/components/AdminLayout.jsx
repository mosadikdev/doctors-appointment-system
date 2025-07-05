import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UsersIcon, 
  ShieldCheckIcon,
  ChatBubbleLeftIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path) => location.pathname === path;
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
        </div>
        
        <nav className="py-4">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
              isActive('/admin')
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          
          <Link
            to="/admin/users"
            className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
              isActive('/admin/users')
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <UsersIcon className="h-5 w-5" />
            <span>User Management</span>
          </Link>
          
          <Link
            to="/admin/reviews"
            className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
              isActive('/admin/reviews')
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <span>Review Management</span>
          </Link>
        </nav>
        
        <div className="p-6 border-t mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 w-full"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* يجب أن يكون Outlet هنا فقط */}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;