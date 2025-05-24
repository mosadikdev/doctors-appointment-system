import { Routes, Route, Link, useNavigate } from 'react-router-dom';
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (!token) {
      navigate('/');
    } else if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'doctor') {
      navigate('/doctor/dashboard');
    } else if (user?.role === 'patient') {
      navigate('/patient/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <span
            onClick={handleLogoClick}
            className="text-white font-bold text-2xl cursor-pointer"
          >
            Doctors Appointment System
          </span>

          {/* Navigation Links */}
          <div className="space-x-4 hidden md:flex items-center">
            {!token ? (
              <>
                <Link to="/login" className="text-white">Login</Link>
                <Link to="/register" className="text-white">Sign up</Link>
              </>
            ) : (
              <>
                {user?.role === 'admin' && (
                  <>
                    <Link to="/admin" className="text-white">Dashboard</Link>
                    <Link to="/admin/users" className="text-white">Users</Link>
                  </>
                )}

                {user?.role === 'patient' && (
                  <>
                    <Link to="/patient/dashboard" className="text-white">Dashboard</Link>
                    <Link to="/doctors" className="text-white">Doctors</Link>
                    <Link to="/book" className="text-white">Book Appointment</Link>
                    <Link to="/my-appointments" className="text-white">My Appointments</Link>
                    <Link to="/profile" className="text-white">Profile</Link>
                  </>
                )}

                {user?.role === 'doctor' && (
                  <>
                    <Link to="/doctor/dashboard" className="text-white">Dashboard</Link>
                    <Link to="/doctor/appointments" className="text-white">Appointments</Link>
                    <Link to="/doctor/availability" className="text-white">Availability</Link>
                    <Link to="/profile" className="text-white">Profile</Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button className="text-white" onClick={() => alert("Add mobile menu here")}>
              ☰
            </button>
          </div>
        </div>
      </nav>

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
    </div>
  );
}

export default App;
