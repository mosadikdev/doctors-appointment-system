import { useState } from 'react';
import { Routes, Route, useNavigate, NavLink } from 'react-router-dom';
import { 
  HomeIcon,
  UserCircleIcon,
  CalendarIcon,
  UserGroupIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  QueueListIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Login from './pages/Login';
import Register from './pages/Register';
import Doctors from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import DoctorAppointments from './pages/DoctorAppointments';
import AdminDashboard from './pages/AdminDashboard';
import AddUser from './pages/AddUser';
import EditUser from './pages/EditUser';
import AdminHome from './pages/AdminHome';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import Home from './pages/Home';
import Profile from './pages/Profile';
import DoctorAvailability from './pages/DoctorAvailability';

function App() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    if (!token) navigate('/');
    else switch(user?.role) {
      case 'admin': navigate('/admin'); break;
      case 'doctor': navigate('/doctor/dashboard'); break;
      case 'patient': navigate('/patient/dashboard'); break;
      default: navigate('/');
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const renderNavLink = (to, text, Icon) => (
    <NavLink
      to={to}
      onClick={() => setIsMobileMenuOpen(false)}
      className={({ isActive }) => 
        `flex items-center px-3 py-2 rounded-md transition-colors ${
          isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
        }`
    }>
      <Icon className="h-5 w-5 mr-2" />
      {text}
    </NavLink>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <button
                onClick={handleLogoClick}
                className="flex items-center focus:outline-none"
              >
                <span className="text-xl font-bold text-blue-600">
                  Doctors System
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {!token ? (
                <div className="flex items-center space-x-4">
                  {renderNavLink('/login', 'Login', UserCircleIcon)}
                  {renderNavLink('/register', 'Register', UserPlusIcon)}
                </div>
              ) : (
                <div className="flex items-center space-x-6">
                  {user?.role === 'admin' && (
                    <>
                      {renderNavLink('/admin', 'Dashboard', QueueListIcon)}
                      {renderNavLink('/admin/users', 'Manage Users', UserGroupIcon)}
                    </>
                  )}

                  {user?.role === 'patient' && (
                    <>
                      {renderNavLink('/patient/dashboard', 'Dashboard', HomeIcon)}
                      {renderNavLink('/doctors', 'Doctors', UserGroupIcon)}
                      {renderNavLink('/book', 'Book Appointment', PlusCircleIcon)}
                      {renderNavLink('/my-appointments', 'My Appointments', CalendarIcon)}
                    </>
                  )}

                  {user?.role === 'doctor' && (
                    <>
                      {renderNavLink('/doctor/dashboard', 'Dashboard', HomeIcon)}
                      {renderNavLink('/doctor/appointments', 'Appointments', CalendarIcon)}
                      {renderNavLink('/doctor/availability', 'Availability', CalendarIcon)}
                    </>
                  )}

                  <div className="flex items-center space-x-4">
                    {renderNavLink('/profile', 'Profile', Cog6ToothIcon)}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {!token ? (
                <>
                  {renderNavLink('/login', 'Login', UserCircleIcon)}
                  {renderNavLink('/register', 'Register', UserPlusIcon)}
                </>
              ) : (
                <>
                  {user?.role === 'admin' && (
                    <>
                      {renderNavLink('/admin', 'Dashboard', QueueListIcon)}
                      {renderNavLink('/admin/users', 'Manage Users', UserGroupIcon)}
                    </>
                  )}

                  {user?.role === 'patient' && (
                    <>
                      {renderNavLink('/patient/dashboard', 'Dashboard', HomeIcon)}
                      {renderNavLink('/doctors', 'Doctors', UserGroupIcon)}
                      {renderNavLink('/book', 'Book Appointment', PlusCircleIcon)}
                    </>
                  )}

                  {user?.role === 'doctor' && (
                    <>
                      {renderNavLink('/doctor/dashboard', 'Dashboard', HomeIcon)}
                      {renderNavLink('/doctor/appointments', 'Appointments', CalendarIcon)}
                    </>
                  )}

                  {renderNavLink('/profile', 'Profile', Cog6ToothIcon)}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />

        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/availability" element={<DoctorAvailability />} />

        

        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/users" element={<AdminDashboard />} />
        <Route path="/admin/add-user" element={<AddUser />} />
        <Route path="/admin/edit-user/:id" element={<EditUser />} />


        <Route path="/profile" element={<Profile />} />
      </Routes>
      </main>
    </div>
  );
}

export default App;