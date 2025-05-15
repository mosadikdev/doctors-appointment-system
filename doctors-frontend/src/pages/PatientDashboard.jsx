import { Link } from "react-router-dom";

function PatientDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">👤 Welcome, {user?.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/doctors" className="p-6 bg-blue-100 rounded shadow hover:bg-blue-200 transition">
          <h3 className="text-xl font-semibold text-blue-800">🔍 Browse Doctors</h3>
          <p className="text-sm text-gray-700 mt-2">Find and book appointments with doctors.</p>
        </Link>

        <Link to="/book" className="p-6 bg-green-100 rounded shadow hover:bg-green-200 transition">
          <h3 className="text-xl font-semibold text-green-800">📅 Book Appointment</h3>
          <p className="text-sm text-gray-700 mt-2">Easily book a new appointment.</p>
        </Link>

        <Link to="/my-appointments" className="p-6 bg-yellow-100 rounded shadow hover:bg-yellow-200 transition">
          <h3 className="text-xl font-semibold text-yellow-800">📋 My Appointments</h3>
          <p className="text-sm text-gray-700 mt-2">View or manage your scheduled appointments.</p>
        </Link>
      </div>
    </div>
  );
}

export default PatientDashboard;
