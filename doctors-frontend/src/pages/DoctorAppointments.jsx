import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarIcon, ClockIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import StatusBadge from "../components/StatusBadge";
import Spinner from "../components/Spinner";
import ErrorAlert from "../components/Alerts/ErrorAlert";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:8000/api/doctor/appointments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(data.appointments || []);
      } catch (err) {
        setError("Failed to load appointments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status } : app
      ));
    } catch (err) {
      console.error("Status update failed:", err);
      setError("Failed to update appointment status");
    }
  };

  if (loading) return <Spinner size="lg" variant="primary" />;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <CalendarIcon className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Appointments</h1>
            <p className="text-gray-600 mt-1">Manage and track all patient appointments</p>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center text-gray-600">
            No appointments found
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <UserCircleIcon className="h-12 w-12 text-gray-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {app.patient?.name || "Unknown Patient"}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarIcon className="h-5 w-5 text-blue-500" />
                          {new Date(app.appointment_date).toLocaleDateString('en-GB')}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ClockIcon className="h-5 w-5 text-green-500" />
                          {app.appointment_time}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <StatusBadge status={app.status} />
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorAppointments;