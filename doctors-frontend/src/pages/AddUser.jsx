import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserPlusIcon,  UserIcon,HomeIcon, AtSymbolIcon , LockClosedIcon } from "@heroicons/react/24/outline";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import SuccessAlert from "../components/Alerts/SuccessAlert";
import ErrorAlert from "../components/Alerts/ErrorAlert";
import Spinner from "../components/Spinner";

function AddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    city: "",
    specialty: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await axios.post("http://localhost:8000/api/admin/add-user", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setSuccess(true);
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
  return (
    <div className="min-h-screen">
      <Spinner size="lg" variant="primary" />
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserPlusIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
        </div>

        {success && <SuccessAlert message="User added successfully!" />}
        {error && <ErrorAlert message={error} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormInput
            label="Full Name"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            icon={<UserIcon className="h-5 w-5 text-gray-400" />}
          />

          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            icon={<AtSymbolIcon className="h-5 w-5 text-gray-400" />}
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
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

          {form.role === "doctor" && (
  <FormInput
    label="Specialty"
    name="specialty"
    value={form.specialty}
    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
    required
    icon={<UserIcon className="h-5 w-5 text-gray-400" />}
  />
)}


{form.role === "doctor" && (
  <FormInput
    label="city"
    name="city"
    value={form.city}
    onChange={(e) => setForm({ ...form, city: e.target.value })}
    required
    icon={<HomeIcon className="h-5 w-5 text-gray-400" />}
  />
)}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
          >
            {loading ? "Adding..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;