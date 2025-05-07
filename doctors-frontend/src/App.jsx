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

function App() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ marginBottom: '20px' }}>
        {!token ? (
          <>
            <Link to="/login">Login</Link> | <Link to="/register">Sign up</Link>
          </>
        ) : (
          <>
          {user?.role === "admin" && (
  <Link to="/admin" className="text-sm text-blue-500">dashboard</Link>
)}

          {user?.role === "patient" && (
  <>
            <Link to="/doctors">Doctors</Link> |{' '}
            </>
)}
            {user?.role === "patient" && (
  <>
    <Link to="/book">Book</Link> |{" "}
  </>
)}

{(user?.role === "patient" || user?.role === "doctor")  && (
  <>
            <Link to="/my-appointments">My appointments</Link>
            </>
)}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/doctor-appointments" element={<DoctorAppointments />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-user" element={<AddUser />} />
        <Route path="/admin/edit-user/:id" element={<EditUser />} />
      </Routes>
    </div>
  );
}

export default App;
