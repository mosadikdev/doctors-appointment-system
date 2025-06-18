import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [expandedAppointment, setExpandedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userRole = user?.role;
      setRole(userRole);

      let url = userRole === "doctor"
        ? "http://localhost:8000/api/doctor/appointments"
        : "http://localhost:8000/api/patient/appointments";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setAppointments(Array.isArray(data) ? data : data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleConfirm = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:8000/api/appointments/${id}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAppointments();
    } catch (error) {
      console.error("Error confirming appointment:", error);
    }
  };

  const handleCancel = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleAppointmentDetails = (id) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
  };

  const filterAppointments = () => {
  const now = new Date();

  if (activeTab === "all") return appointments;

  return appointments.filter(app => {
    const appDate = new Date(`${app.appointment_date}T${app.appointment_time}`);

    if (activeTab === "upcoming") {
      return (
        ["confirmed", "pending"].includes(app.status.toLowerCase()) &&
        appDate > now
      );
    }

    return app.status.toLowerCase() === activeTab;
  });
};

  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredAppointments = filterAppointments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {role === "doctor" ? "Patient Appointments" : "My Appointments"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {role === "doctor" 
              ? "Manage your upcoming patient appointments and schedule" 
              : "Track and manage your medical appointments"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 rounded-t-lg font-medium ${
                activeTab === "upcoming"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-t-lg font-medium ${
                activeTab === "pending"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab("confirmed")}
              className={`px-4 py-2 rounded-t-lg font-medium ${
                activeTab === "confirmed"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-t-lg font-medium ${
                activeTab === "completed"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab("cancelled")}
              className={`px-4 py-2 rounded-t-lg font-medium ${
                activeTab === "cancelled"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Cancelled
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-t-lg font-medium ${
                activeTab === "all"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              All Appointments
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status.toLowerCase() === "pending").length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status.toLowerCase() === "confirmed").length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status.toLowerCase() === "cancelled").length}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-xl p-6">
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No {activeTab === "all" ? "" : activeTab} appointments found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {activeTab === "upcoming" 
                  ? "You don't have any upcoming appointments scheduled."
                  : `You don't have any ${activeTab} appointments.`}
              </p>
              {role === "patient" && (
                <a 
                  href="/book" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
                >
                  Book an Appointment
                </a>
              )}
            </div>
          )}

          {/* Appointments List */}
          {!loading && filteredAppointments.length > 0 && (
            <div className="space-y-4">
              {filteredAppointments.map((app) => (
                <div 
                  key={app.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div 
                    className="p-5 cursor-pointer"
                    onClick={() => toggleAppointmentDetails(app.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <CalendarIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {role === "doctor" 
                              ? `Patient: ${app.patient?.name || "Unknown"}`
                              : `Dr. ${app.doctor?.name || "Unknown"}`}
                          </h3>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                              <CalendarIcon className="h-4 w-4" />
                              {formatDate(app.appointment_date)}
                            </span>
                            <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                              <ClockIcon className="h-4 w-4" />
                              {app.appointment_time}
                            </span>
                            <span className={`inline-flex items-center text-sm px-2.5 py-0.5 rounded-full ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => toggleAppointmentDetails(app.id)}
                      >
                        {expandedAppointment === app.id ? "Hide Details" : "View Details"}
                      </button>
                    </div>
                  </div>
                  
                  {expandedAppointment === app.id && (
                    <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Appointment Details</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Appointment ID:</span>
                              <span className="font-medium">#{app.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date & Time:</span>
                              <span className="font-medium">
                                {formatDate(app.appointment_date)} at {app.appointment_time}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium">30 minutes</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className={`font-medium ${getStatusColor(app.status).replace('bg-', 'text-').split(' ')[0]}`}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">
                            {role === "doctor" ? "Patient Information" : "Doctor Information"}
                          </h4>
                          <div className="flex items-start gap-4">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                            <div>
                              <h5 className="font-medium text-gray-900">
                                {role === "doctor" 
                                  ? app.patient?.name || "Unknown"
                                  : `Dr. ${app.doctor?.name || "Unknown"}`}
                              </h5>
                              <p className="text-gray-600 text-sm mt-1">
                                {role === "doctor" 
                                  ? `Email: ${app.patient?.email || "N/A"}`
                                  : app.doctor?.specialty || "General Practitioner"}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {role === "doctor" 
                                  ? `Phone: ${app.patient?.phone || "N/A"}`
                                  : `Location: ${app.doctor?.city || "N/A"}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {role === "doctor" && app.status.toLowerCase() === "pending" && (
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handleConfirm(app.id)}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                            Confirm Appointment
                          </button>
                          <button
                            onClick={() => handleCancel(app.id)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                          >
                            <XCircleIcon className="h-5 w-5" />
                            Cancel Appointment
                          </button>
                        </div>
                      )}
                      
                      {role === "patient" && app.status.toLowerCase() !== "cancelled" && (
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                          {app.status.toLowerCase() !== "completed" && (
                            <button
                              onClick={() => handleCancel(app.id)}
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                            >
                              <XCircleIcon className="h-5 w-5" />
                              Cancel Appointment
                            </button>
                          )}
                          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
                            View Details
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        
        
      </div>
    </div>
  );
};
export default MyAppointments;