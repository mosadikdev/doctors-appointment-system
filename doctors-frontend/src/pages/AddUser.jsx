import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  UserPlusIcon, 
  UserIcon,
  HomeIcon, 
  AtSymbolIcon, 
  LockClosedIcon,
  PhoneIcon,
  CameraIcon
} from "@heroicons/react/24/outline";
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
    phone: "",
    gender: "",
    city: "",
    specialty: ""
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(form).forEach(key => {
        if (form[key]) formData.append(key, form[key]);
      });
      
      // Append avatar if selected
      if (avatar) {
        formData.append('avatar', avatar);
      }

      const response = await axios.post("http://localhost:8000/api/admin/add-user", formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data'
        }
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
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-white shadow-md overflow-hidden">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-sm hover:bg-gray-100"
              >
                <CameraIcon className="h-5 w-5 text-blue-600" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Click to upload profile photo</p>
          </div>

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

          <FormInput
            label="Phone Number"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            icon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
          />

          <FormSelect
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            options={[
              { value: "", label: "Select Gender" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
              { value: "prefer_not_to_say", label: "Prefer not to say" },
            ]}
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
            <>
              <FormInput
                label="Specialty"
                name="specialty"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                required
                icon={<UserIcon className="h-5 w-5 text-gray-400" />}
              />

              <FormInput
                label="City"
                name="city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
                icon={<HomeIcon className="h-5 w-5 text-gray-400" />}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-70"
          >
            {loading ? "Adding..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;