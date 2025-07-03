import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  DocumentTextIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

function PatientDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    completedAppointments: 0,
    savedDoctors: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [savedDoctors, setSavedDoctors] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        };

        const baseURL = "http://localhost:8000"; 
        
        const statsRes = await fetch(`${baseURL}/api/patient/stats`, { headers });
        if (!statsRes.ok) {
          const error = await statsRes.json();
          throw new Error(`Stats request failed: ${error.message || statsRes.statusText}`);
        }
        const statsData = await statsRes.json();
        setStats(statsData);

        const upcomingRes = await fetch(`${baseURL}/api/patient/upcoming-appointments`, { headers });
        if (!upcomingRes.ok) {
          const error = await upcomingRes.json();
          throw new Error(`Appointments request failed: ${error.error || error.message || upcomingRes.statusText}`);
        }
        const upcomingData = await upcomingRes.json();
        setUpcomingAppointments(upcomingData);

        const savedRes = await fetch(`${baseURL}/api/patient/bookmarks`, { headers });
        if (!savedRes.ok) {
          const error = await savedRes.json();
          throw new Error(`Doctors request failed: ${error.error || error.message || savedRes.statusText}`);
        }
        const savedData = await savedRes.json();
        console.log("Saved Doctors Data:", savedData);
        setSavedDoctors(savedData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <UserIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your health appointments with ease
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Patient
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Active
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<CalendarIcon className="h-6 w-6 text-blue-600" />}
            label="Upcoming Appointments"
            value={stats.upcomingAppointments}
            bg="bg-blue-100"
          />
          <StatCard
            icon={<DocumentTextIcon className="h-6 w-6 text-green-600" />}
            label="Completed Appointments"
            value={stats.completedAppointments}
            bg="bg-green-100"
          />
          <StatCard
            icon={<HeartIcon className="h-6 w-6 text-purple-600" />}
            label="Saved Doctors"
            value={stats.savedDoctors}
            bg="bg-purple-100"
          />
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/doctors" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <MagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Find Doctors</h3>
              <p className="text-sm text-gray-600 mt-1">Search specialists near you</p>
            </Link>
            
            <Link to="/book" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Book Appointment</h3>
              <p className="text-sm text-gray-600 mt-1">Schedule a new visit</p>
            </Link>
            
            <Link to="/my-appointments" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="bg-yellow-100 p-3 rounded-full mb-3">
                <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900">My Appointments</h3>
              <p className="text-sm text-gray-600 mt-1">View your schedule</p>
            </Link>
            
            <Link to="/medical-records" className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <DocumentTextIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Medical Records</h3>
              <p className="text-sm text-gray-600 mt-1">Access your health history</p>
            </Link>
          </div>
        </div>
        
        {/* Upcoming Appointments */}
        <Section title="Upcoming Appointments" link="/my-appointments">
  {upcomingAppointments.length === 0 ? (
    <p className="text-gray-500">No upcoming appointments.</p>
  ) : (
    upcomingAppointments.map((appointment) => (
      <div
        key={appointment.id}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Dr. {appointment.doctorName}
            </h3>
            <p className="text-sm text-gray-600">{appointment.reason}</p>
            <div className="flex gap-2 mt-1">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {appointment.day}
              </span>
              <span className="text-gray-500 text-xs">
                {appointment.timeStart} - {appointment.timeEnd}
              </span>
            </div>
          </div>
        </div>
        <Link
          to={`/appointment/${appointment.id}`}
          className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          View Details
        </Link>
      </div>
    ))
  )}
</Section>
        
        {/* Saved Doctors */}
       <Section title="Your Favorite Doctors" link="/doctors">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {savedDoctors.map((doctor) => {
  // Convert rating to number and handle null/undefined
  const rating = parseFloat(doctor.rating);
  const displayRating = isNaN(rating) ? 4.5 : rating;
  const reviewCount = doctor.reviewsCount || 12;
  
  return (
    <div
      key={doctor.id}
      className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <img
          src={doctor.photo || "/placeholder.png"}
          alt={doctor.name}
          className="w-16 h-16 rounded-xl object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">
            Dr. {doctor.name}
          </h3>
          <p className="text-sm text-gray-600">{doctor.specialty}</p>
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 fill-current ${i < Math.round(displayRating) ? "" : "text-gray-300"}`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-500 text-sm ml-2">
              {displayRating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Link
          to={`/doctor/${doctor.id}`}
          className="flex-1 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
        >
          View Profile
        </Link>
        <Link
          to={`/book/${doctor.id}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
})}
  </div>
</Section>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
      <div className={`${bg} p-3 rounded-lg`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, link, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <Link
          to={link}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All
        </Link>
      </div>
      {children}
    </div>
  );
}

export default PatientDashboard;