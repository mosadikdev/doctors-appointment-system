import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8000/api/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setUsers(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch users:", err);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading data...</p>;

  const handleDelete = (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
  
    const token = localStorage.getItem("token");
  
    axios.delete(`http://localhost:8000/api/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      setUsers(users.filter((u) => u.id !== userId));
    })
    .catch((err) => {
      console.error("Deletion failed:", err);
      alert("A problem occurred while deleting");
    });
  };
  

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🛡️ admin dashboard</h2>
      <div>
        <Link to="/admin/add-user" className="bg-blue-500 text-white px-4 py-2 rounded">
  ➕ add user
</Link>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">name</th>
            <th className="border p-2">email</th>
            <th className="border p-2">role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2 text-center">
  <button
    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
    onClick={() => handleDelete(user.id)}
  >
    delete
  </button>
</td>
<td>
  <Link
    to={`/admin/edit-user/${user.id}`}
    className="text-blue-500 hover:underline"
  >
    edit
  </Link>
</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      

    </div>
  );
}

export default AdminDashboard;
