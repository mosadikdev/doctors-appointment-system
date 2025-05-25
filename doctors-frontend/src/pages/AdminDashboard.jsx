import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    doctors: 0,
    patients: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const res = await axios.get("http://localhost:8000/api/admin/allusers", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data;
        setUsers(data);
        setStats({
          total: data.length,
          admins: data.filter(u => u.role === "admin").length,
          doctors: data.filter(u => u.role === "doctor").length,
          patients: data.filter(u => u.role === "patient").length,
        });
      } catch (err) {
        console.error("Failed to fetch users:", err);
        alert("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async userId => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem("token");
    
    try {
      await axios.delete(`http://localhost:8000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      console.error("Deletion failed:", err);
      alert("An error occurred while attempting to delete");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">
    <Spinner size="lg" variant="primary" />
  </div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hello, admin!</h1>
            <p className="text-gray-600 mt-2">Manage all users in the system</p>
          </div>
          <Link
            to="/admin/add-user"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add a new user
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users"
            value={stats.total}
            icon="👥"
            color="bg-blue-100"
          />
          <StatCard
            title="Admins"
            value={stats.admins}
            icon="🛡️"
            color="bg-purple-100"
          />
          <StatCard
            title="doctors"
            value={stats.doctors}
            icon="⚕️"
            color="bg-green-100"
          />
          <StatCard
            title="patients"
            value={stats.patients}
            icon="👤"
            color="bg-pink-100"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">User list</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>E-mail</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader align="text-center">procedures</TableHeader>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Link
                          to={`/admin/edit-user/${user.id}`}
                          className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, color }) => (
  <div className={`${color} p-6 rounded-xl shadow-sm`}>
    <div className="flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const TableHeader = ({ children, align = "text-left" }) => (
  <th className={`px-6 py-3 ${align} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
    {children}
  </th>
);

const TableCell = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    {children}
  </td>
);

export default AdminDashboard;