import { useEffect, useState } from "react";
import axios from "axios";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);


  

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userRole = user?.role;
      setRole(userRole);

      let url = userRole === "doctor"
        ? "http://localhost:8000/api/doctor/appointments"
        : "http://localhost:8000/api/patient/appointments";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setAppointments(Array.isArray(data) ? data : data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleConfirm = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:8000/api/appointments/${id}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAppointments();
    } catch (error) {
      console.error("Error confirming appointment:", error);
    }
  };

  const handleCancel = async (id) => {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        📅 {role === "doctor" ? "Patient Appointments" : "My Appointments"}
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-500">There are no appointments currently.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="bg-white border rounded-xl shadow p-5 hover:shadow-lg transition"
            >
              <p className="text-gray-800 font-medium">
                {role === "doctor"
                  ? `👤 Patient: ${app.patient?.name || "Unknown"}`
                  : `🩺 Doctor: ${app.doctor?.name || "Unknown"}`}
              </p>
              <p className="text-gray-600">
  📅 Date:{" "}
  <span className="font-semibold">
    {new Date(app.appointment_date).toLocaleDateString('EG')}
  </span>
</p>

<p className="text-gray-600">
  🕒 Time:{" "}
  <span className="font-semibold">
    {app.appointment_time}
  </span>
</p>
              <p className="text-gray-600">
                📌 Status:{" "}
                <span
                  className={`font-semibold ${
                    app.status === "pending"
                      ? "text-yellow-600"
                      : app.status === "confirmed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {app.status}
                </span>
              </p>

              {role === "doctor" && app.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleConfirm(app.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    ✅ Confirm
                  </button>
                  <button
                    onClick={() => handleCancel(app.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAppointments;
