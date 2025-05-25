import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import SuccessAlert from "../components/Alerts/SuccessAlert";
import ErrorAlert from "../components/Alerts/ErrorAlert";
import Spinner from "../components/Spinner";


function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", role: "patient" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setForm(data);
      } catch (err) {
        setError("Failed to load user data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:8000/api/admin/users/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setSuccess(true);
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner size="lg" variant="primary" />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserCircleIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
        </div>

        {success && <SuccessAlert message="User updated successfully!" />}
        {error && <ErrorAlert message={error} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Full Name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <FormSelect
            label="User Role"
            name="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={[
              { value: "patient", label: "Patient" },
              { value: "doctor", label: "Doctor" },
              { value: "admin", label: "Admin" },
            ]}
          />

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;