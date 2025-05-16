import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (token && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (user.role === "patient") {
        navigate("/patient/dashboard");
      }
    }
  }, [token, user, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-600">
        Welcome to the Doctors Appointment System
      </h1>
    </div>
  );
}

export default Home;
