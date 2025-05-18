import { useState, useEffect } from "react";
import axios from "axios";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");

  const fetchDoctors = async (selectedCity = "", selectedSpecialty = "") => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:8000/api/doctors", {
        params: { city: selectedCity, specialty: selectedSpecialty },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDoctors(response.data.doctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchDoctors(city, specialty);
  }, [city, specialty]);

  return (
    <div className="p-4">
      <div className="space-x-2 mb-4 flex flex-wrap gap-2">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Cities</option>
          <option value="Casablanca">Casablanca</option>
          <option value="Rabat">Rabat</option>
          <option value="Fes">Fes</option>
        </select>

        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Specialties</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dentist">Dentist</option>
          <option value="Dermatology">Dermatology</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {doctors.length === 0 ? (
          <p className="text-gray-500 col-span-full">No doctors found.</p>
        ) : (
          doctors.map((doc) => (
            <div key={doc.id} className="border p-4 rounded shadow">
              <h2 className="font-bold">{doc.name}</h2>
              <p>Email: {doc.email}</p>
              <p>City: {doc.city || "N/A"}</p>
              <p>Specialty: {doc.specialty || "N/A"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Doctors;
