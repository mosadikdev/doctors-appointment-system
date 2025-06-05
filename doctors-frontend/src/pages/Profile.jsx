import { useState } from 'react';
import axios from '../api/axios';

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState({
    name: storedUser?.name || '',
    email: storedUser?.email || '',
    specialty: storedUser?.specialty || '',
    city: storedUser?.city || ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.put('/profile', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      setError('❌ Failed to update profile.');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">👤 My Profile</h2>

      {message && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2" required />
        </div>

        {storedUser?.role === 'doctor' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialty</label>
              <input type="text" name="specialty" value={form.specialty} onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2" />
            </div>

            <div>
  <label className="block text-sm font-medium text-gray-700">New Password</label>
  <input type="password" name="password" onChange={handleChange}
    className="w-full border rounded-lg px-4 py-2" />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
  <input type="password" name="password_confirmation" onChange={handleChange}
    className="w-full border rounded-lg px-4 py-2" />
</div>

          </>
        )}

        <button type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Update Profile
        </button>
      </form>
    </div>
  );
}
