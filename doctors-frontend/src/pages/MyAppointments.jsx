import { useEffect, useState } from "react";
import axios from "axios";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Token:", localStorage.getItem("token"));
console.log("User from localStorage:", localStorage.getItem("user"));
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const userRole = user?.role;
        setRole(userRole);
  
        let url = "";
        if (userRole === "doctor") {
          url = "http://localhost:8000/api/doctor/appointments";
        } else if (userRole === "patient") {
          url = "http://localhost:8000/api/patient/appointments";
        }
  
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = res.data;

if (Array.isArray(data)) {
  setAppointments(data);
} else if (Array.isArray(data.appointments)) {
  setAppointments(data.appointments);
} else {
  console.error("The retrieved data is not an array:", data);
  setAppointments([]);
}
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
}, []);

  return (
    <div>
      <h2>📅 {role === "doctor" ? "Patient appointments" : "My appointments"}</h2>
      {appointments.length === 0 ? (
  <p>There are no appointments currently.</p>
) : (
  <ul>
    {loading ? (
  <p>Loading appointments...</p>
) : appointments.length === 0 ? (
  <p>There are no appointments currently.</p>
) : (
  <ul>
    {appointments.map((app) => (
      <li key={app.id}>
        {role === "doctor" ? (
          <>patient: {app.patient?.name || "unknown"}</>
        ) : (
          <>doctor: {app.doctor?.name || "unknown"}</>
        )}{" "}
        | time: {new Date(app.appointment_time).toLocaleString()} | status:{" "}
        {app.status}
      </li>
    ))}
  </ul>
)}

  </ul>
)}
    </div>
  );
}

export default MyAppointments;
