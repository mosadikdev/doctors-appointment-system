import { useState } from 'react';
import axios from '../api/axios';
import { 
  UserIcon, 
  IdentificationIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  KeyIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [form, setForm] = useState({
    name: storedUser?.name || '',
    email: storedUser?.email || '',
    phone: storedUser?.phone || '',
    gender: storedUser?.gender || '',
    specialty: storedUser?.specialty || '',
    city: storedUser?.city || '',
    password: '',
    password_confirmation: ''
  });
  const [avatar, setAvatar] = useState(storedUser?.photo_url || null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');

  try {
    const formData = new FormData();
    
    formData.append('name', form.name);
    formData.append('email', form.email);
    
    if (form.phone !== storedUser.phone) formData.append('phone', form.phone);
    if (form.gender !== storedUser.gender) formData.append('gender', form.gender);
    if (form.specialty !== storedUser.specialty) formData.append('specialty', form.specialty);
    if (form.city !== storedUser.city) formData.append('city', form.city);
    
    if (form.password) {
      formData.append('password', form.password);
      formData.append('password_confirmation', form.password_confirmation);
    }
    
    if (previewAvatar) {
      const fileInput = document.getElementById('avatar-upload');
      if (fileInput.files.length > 0) {
        formData.append('avatar', fileInput.files[0]);
      }
    }

    const res = await axios.post('/profile/update', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    const updatedUser = { 
      ...storedUser, 
      ...res.data.user,
      photo_url: res.data.user.photo_url 
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setAvatar(res.data.user.photo_url);
    setPreviewAvatar(null);
    setForm({...form, password: '', password_confirmation: ''});
    
    setMessage('✅ Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  } catch (err) {
    setError('❌ Failed to update profile. ' + (err.response?.data?.message || ''));
    console.error(err.response?.data || err.message);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Profile Settings
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your personal information and account details
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          {message && (
            <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{message}</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden">
  {previewAvatar ? (
    <img 
      src={previewAvatar} 
      alt="Profile preview" 
      className="w-full h-full object-cover"
    />
  ) : avatar ? (
   <img 
  src={`${avatar}?t=${new Date().getTime()}`} 
  alt="Profile" 
  className="w-full h-full object-cover"
  onError={(e) => {
    e.target.onerror = null; 
    e.target.src = "/placeholder.png";
  }}
/>
  ) : (
    <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
      <UserIcon className="h-16 w-16 text-indigo-500" />
    </div>
  )}
</div>
                <label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-blue-50"
                >
                  <CameraIcon className="h-5 w-5 text-blue-600" />
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-gray-900">{storedUser?.name}</h2>
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
                  {storedUser?.role?.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdentificationIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="gender" 
                    value={form.gender} 
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              
              {storedUser?.role === 'doctor' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialty
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <input 
                        type="text" 
                        name="specialty" 
                        value={form.specialty} 
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Cardiology, Neurology, etc."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        name="city" 
                        value={form.city} 
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your city"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="password" 
                      name="password" 
                      value={form.password} 
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="password" 
                      name="password_confirmation" 
                      value={form.password_confirmation} 
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Strong Password</h4>
                <p className="text-sm text-gray-600">Use a combination of letters, numbers, and symbols</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Secure Connection</h4>
                <p className="text-sm text-gray-600">Always use a secure network when accessing your account</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}