import { useEffect, useState } from "react";
import axios from "axios";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/doctors", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(res.data.doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!selectedDoctor || !appointmentDate) return;
      
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8000/api/doctors/${selectedDoctor}/times`,
          {
            params: { date: appointmentDate },
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setAvailableTimes(res.data.times);
      } catch (err) {
        console.error("Error fetching times:", err);
        setAvailableTimes([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailableTimes();
  }, [selectedDoctor, appointmentDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      setMessage("❌ Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/appointments",
        {
          doctor_id: selectedDoctor,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage("✅ Your reservation has been completed successfully");
      setSelectedDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Booking error:", error);
      setMessage(`❌ Error: ${error.response?.data?.message || "Failed to book"}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        🩺 Book a medical appointment
      </h2>

      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choosing a doctor
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => {
                setSelectedDoctor(e.target.value);
                setAppointmentDate("");
                setAppointmentTime("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="">--Choose a doctor--</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  D. {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment date
            </label>
            <input
              type="date"
              value={appointmentDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setAppointmentDate(e.target.value);
                setAppointmentTime("");
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
              disabled={!selectedDoctor}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading available times...</div>
          ) : (
            availableTimes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Choose the time
                </label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">--Choose the time--</option>
                  {availableTimes.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            )
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Booking..." : "Confirm booking"}
          </button>

          {message && (
            <p className={`mt-4 text-center font-semibold ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default BookAppointment;