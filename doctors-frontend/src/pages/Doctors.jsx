import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Doctors() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);


  useEffect(() => {
    if (user?.role !== "patient") {
      navigate("/my-appointments");
    }
  }, []);

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
    <div>
      <h2>List of doctors</h2>
      <ul>
        {doctors.map((doc) => (
          <li key={doc.id}>{doc.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Doctors;
