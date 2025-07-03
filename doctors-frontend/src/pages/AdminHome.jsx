import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner"; 
import { 
  UsersIcon, 
  ShieldCheckIcon, 
  ChartBarIcon ,
  ChatBubbleLeftRightIcon , 
  ChatBubbleLeftIcon 
} from "@heroicons/react/24/outline";

function AdminHome() {
  const [stats, setStats] = useState({ total_users: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(data);
      } catch (error) {
        setError("Failed to load dashboard data");
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShieldCheckIcon className="h-10 w-10 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Manage your system efficiently with real-time insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Users"
            value={stats.total_users}
            icon={<UsersIcon className="h-6 w-6 text-white" />}
            color="bg-blue-600"
          />
          <StatCard 
  title="Pending Reviews"
  value={stats.pending_reviews || 0}
  icon={<ChatBubbleLeftIcon className="h-6 w-6 text-white" />}
  color="bg-yellow-600"
/>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ManagementCard
            title="User Management"
            description="Manage all system users, roles and permissions"
            icon={<UsersIcon className="h-8 w-8 text-blue-600" />}
            link="/admin/users"
            linkText="Manage Users"
          />
          
        </div>
      </div>
    </>
  );
}

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className={`${color} p-6 rounded-xl text-white shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="bg-white/20 p-3 rounded-lg">{icon}</div>
    </div>
  </div>
);

// Reusable Management Card Component
const ManagementCard = ({ title, description, icon, link, linkText }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="bg-blue-50 p-3 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
        <Link
          to={link}
          className="inline-flex items-center gap-2 mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {linkText}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </Link>
      </div>
    </div>
  </div>
);

export default AdminHome;