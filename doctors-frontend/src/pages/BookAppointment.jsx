import { useEffect, useState } from "react";
import axios from "axios";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(res.data.doctors);
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8000/api/appointments",
        {
          doctor_id: selectedDoctor,
          appointment_time: appointmentTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("✅ Your reservation has been completed successfully");
    } catch (error) {
      console.error(error);
      setMessage("❌ An error occurred during booking.");
    }
  };

  return (
    <div>
      <h2>📆 Book an appointment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Choosing a doctor:</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">--Choose a doctor--</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>time:</label>
          <input
            type="datetime-local"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Book an appointment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default BookAppointment;
