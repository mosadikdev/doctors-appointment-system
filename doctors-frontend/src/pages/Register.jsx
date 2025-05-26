import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { 
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput';
import SuccessAlert from '../components/Alerts/SuccessAlert';
import ErrorAlert from '../components/Alerts/ErrorAlert';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match');
      return false;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const { data } = await axios.post('/register', form);
      
      setSuccess('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 
        'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create New Account"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Sign in here"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <ErrorAlert message={error} />}
        {success && <SuccessAlert message={success} />}

        <FormInput
          label="Full Name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="John Doe"
          icon={<UserIcon className="h-5 w-5 text-gray-400" />}
          required
        />

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
              className="text-gray-500 hover:text-blue-600 text-sm"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          }
          required
        />

        <FormInput
          label="Confirm Password"
          name="password_confirmation"
          type={showPassword ? "text" : "password"}
          value={form.password_confirmation}
          onChange={handleChange}
          placeholder="••••••••"
          icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </AuthLayout>
  );
}