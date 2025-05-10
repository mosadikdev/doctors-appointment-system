import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Doctors() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== "patient") {
      navigate("/my-appointments");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/doctors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctors(res.data.doctors);
      } catch (err) {
        console.error("Failure to bring doctors:", err);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        🩺 Available Doctors
      </h2>

      {doctors.length === 0 ? (
        <p className="text-center text-gray-500">No doctors available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {doc.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{doc.email}</p>
              <button
                onClick={() => navigate(`/book-appointment/${doc.id}`)}
                className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Doctors;
