import { useEffect, useState } from "react";
import axios from "axios";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/doctor/appointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8000/api/appointments/${id}/status`, {
        status,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

  return (
    <div>
      <h2>📅 Patient appointments</h2>
      {appointments.length === 0 ? (
        <p>There are no appointments currently.</p>
      ) : (
        <ul>
          {appointments.map((app) => (
            <li key={app.id}>
              patient: {app.patient?.name} | 
              time: {new Date(app.appointment_time).toLocaleString()} | 
              status: {app.status}{" "}
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DoctorAppointments;
