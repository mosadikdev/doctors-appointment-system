import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDaysIcon, UserGroupIcon, ClockIcon } from "@heroicons/react/24/outline";

function DoctorDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    confirmedAppointments: 0,
    pendingAppointments: 0,
    availableSlots: 0,
    totalPatients: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
    const response = await fetch('http://localhost:8000/api/doctor/stats', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const text = await response.text();
    console.log("Raw response:", text);

    const data = JSON.parse(text); 
    console.log("Parsed stats:", data);
    setStats(data);
} catch (error) {
    console.error("Error fetching stats:", error);
}

    };

    fetchStats();
}, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <UserGroupIcon className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, Dr. {user?.name}</h1>
            <p className="text-gray-600 mt-1">Manage your medical schedule efficiently</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
    icon={<CalendarDaysIcon className="h-6 w-6 text-white" />}
    title="Upcoming Confirmed"
    value={stats.confirmedAppointments}
    color="bg-green-600"
/>
<StatCard 
    icon={<CalendarDaysIcon className="h-6 w-6 text-white" />}
    title="Pending Appointments"
    value={stats.pendingAppointments}
    color="bg-yellow-600"
/>

<StatCard 
    icon={<ClockIcon className="h-6 w-6 text-white" />}
    title="Available Slots"
    value={stats.availableSlots}
    color="bg-blue-600"
/>
<StatCard 
    icon={<UserGroupIcon className="h-6 w-6 text-white" />}
    title="Total Patients"
    value={stats.totalPatients}
    color="bg-purple-600"
/>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard 
            title="Appointments Management"
            description="View and manage your upcoming patient appointments"
            link="/doctor/appointments"
            linkText="Manage Appointments"
            icon={<CalendarDaysIcon className="h-8 w-8 text-blue-600" />}
          />
          
          <DashboardCard 
            title="Availability Schedule"
            description="Set your working hours and availability"
            link="/doctor/availability"
            linkText="Set Availability"
            icon={<ClockIcon className="h-8 w-8 text-green-600" />}
          />
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value, color }) => (
  <div className={`${color} p-6 rounded-xl text-white shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className="bg-white/20 p-3 rounded-lg">{icon}</div>
    </div>
  </div>
);

const DashboardCard = ({ title, description, link, linkText, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="bg-blue-50 p-3 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
        <Link
          to={link}
          className="inline-flex items-center gap-2 mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {linkText}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  </div>
);

export default DoctorDashboard;
