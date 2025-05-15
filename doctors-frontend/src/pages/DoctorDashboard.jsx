import { Link } from "react-router-dom";

function DoctorDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">🩺 Welcome Dr. {user?.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/doctor/appointments" className="p-6 bg-purple-100 rounded shadow hover:bg-purple-200 transition">
          <h3 className="text-xl font-semibold text-purple-800">📅 View Appointments</h3>
          <p className="text-sm text-gray-700 mt-2">Check and manage your patient appointments.</p>
        </Link>

      </div>
    </div>
  );
}

export default DoctorDashboard;
