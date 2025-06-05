import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from '../api/axios';
import { 
  EnvelopeIcon,
  LockClosedIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import ErrorAlert from '../components/Alerts/ErrorAlert';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await axios.post('/login', form);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setTimeout(() => {
        const redirectPaths = {
          admin: '/admin',
          doctor: '/doctor/dashboard',
          patient: '/patient/dashboard'
        };
        
        navigate(redirectPaths[data.user.role] || '/');
      }, 1000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 
        'Network error. Please try again later.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Please sign in to continue"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Create account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <ErrorAlert message={error} />}

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="name@example.com"
          icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
          required
        />

        <FormInput
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-blue-600"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
          required
        />


        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 rounded-xl font-medium hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}