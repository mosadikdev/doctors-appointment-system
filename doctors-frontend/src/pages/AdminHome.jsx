import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminHome() {
  const [stats, setStats] = useState({
    total_users: 0,
    open_tickets: 0,
    closed_tickets: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
  axios.get("http://localhost:8000/api/admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => setStats(response.data))
  .catch(error => console.error("Error fetching stats:", error));
}, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🛡️ Admin Home</h2>
      <p className="text-gray-700 mb-6">
        Welcome, Admin! Here you can manage the system, view users, and see stats.
      </p>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 text-green-800 p-4 rounded shadow">
          <h4 className="text-sm font-medium">Total Users</h4>
          <p className="text-2xl font-bold">{stats.total_users}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded shadow">
          <h4 className="text-sm font-medium">Open Tickets</h4>
          <p className="text-2xl font-bold">{stats.open_tickets}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded shadow">
          <h4 className="text-sm font-medium">Closed Tickets</h4>
          <p className="text-2xl font-bold">{stats.closed_tickets}</p>
        </div>
      </div>

      {/* Manage Users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white shadow p-4 rounded border">
          <h3 className="font-semibold text-lg mb-2">👥 Manage Users</h3>
          <p className="text-sm text-gray-600">Add, edit or delete users.</p>
          <Link
            to="/admin/users"
            className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Users
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
