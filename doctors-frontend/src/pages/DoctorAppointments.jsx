import { useEffect, useState } from "react";
import axios from "axios";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);

  

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/doctor/appointments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data.appointments || []);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status } : app
      ));
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">📅 Patient appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-600 text-center">There are no appointments currently.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((app) => (
            <li
              key={app.id}
              className="border p-4 rounded shadow-sm bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    👤 The patient: <span className="text-blue-700">{app.patient?.name || "unknown"}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    📅 Date: {new Date(app.appointment_date).toLocaleDateString('EG')}
                  </p>
                  <p className="text-sm text-gray-600">
                    🕒 Time: {app.appointment_time}
                  </p>
                  <p className="text-sm text-gray-600">
                    📌 Status: <span className={
                      app.status === 'pending' ? 'text-yellow-600' :
                      app.status === 'confirmed' ? 'text-green-600' :
                      'text-red-600'
                    }>{app.status}</span>
                  </p>
                </div>

                <div className="mt-2 md:mt-0">
                  <label className="text-sm font-semibold text-gray-700 mr-2">Change status:</label>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DoctorAppointments;