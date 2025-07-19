import { useEffect, useState } from "react";
import axios from "axios";
import { 
  CalendarIcon, 
  ClockIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("active");
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:8000/api/doctor/appointments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(data.appointments || []);
      } catch (err) {
        setError("Failed to load appointments. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const now = new Date();
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const thirtyDaysFromNowStr = thirtyDaysFromNow.toISOString().split('T')[0];
    
    let filtered = appointments.filter(app => 
      app.appointment_date >= thirtyDaysAgoStr && 
      app.appointment_date <= thirtyDaysFromNowStr
    );
    
    if (activeFilter !== "all") {
      if (activeFilter === "active") {
        filtered = filtered.filter(app => 
          ["pending", "confirmed"].includes(app.status.toLowerCase())
        );
      } else {
        filtered = filtered.filter(app => 
          app.status.toLowerCase() === activeFilter
        );
      }
    }
    
    // Sort appointments: upcoming first, then by status
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
      const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
      
      return dateA - dateB;
    });

    setFilteredAppointments(filtered);
  }, [activeFilter, appointments]);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [id]: true }));
      
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
      setError("Failed to update appointment status. Please try again.");
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [id]: false }));
    }
  };

  const toggleAppointmentDetails = (id) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
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

  const isUpcomingAppointment = (appointment) => {
    const now = new Date();
    const appDate = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    return appDate > now;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Patient Appointments</h1>
              <p className="text-gray-600 mt-1">Showing appointments within the last 30 days</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5 text-gray-600" />
              <span>Filter</span>
            </button>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              Doctor
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Filter Appointments</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveFilter("active")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeFilter === "active"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Active (Upcoming)
              </button>
              <button
                onClick={() => setActiveFilter("pending")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeFilter === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveFilter("confirmed")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeFilter === "confirmed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setActiveFilter("completed")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeFilter === "completed"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveFilter("cancelled")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeFilter === "cancelled"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancelled
              </button>
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeFilter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Show All
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-xl font-bold text-gray-900">{appointments.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-xl font-bold text-gray-900">
              {appointments.filter(a => a.status.toLowerCase() === "pending").length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Confirmed</p>
            <p className="text-xl font-bold text-gray-900">
              {appointments.filter(a => a.status.toLowerCase() === "confirmed").length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-xl font-bold text-gray-900">
              {appointments.filter(a => 
                ["pending", "confirmed"].includes(a.status.toLowerCase())
              ).length}
            </p>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {activeFilter === "active" 
                ? "You don't have any upcoming appointments in the last 30 days." 
                : `You don't have any ${activeFilter} appointments in the last 30 days.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((app) => {
              const isUpcoming = isUpcomingAppointment(app);
              return (
                <div
                  key={app.id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                    !isUpcoming ? "opacity-80" : ""
                  }`}
                >
                  <div 
                    className="p-5 cursor-pointer"
                    onClick={() => toggleAppointmentDetails(app.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          isUpcoming ? "bg-blue-100" : "bg-gray-100"
                        }`}>
                          <UserCircleIcon className={`h-6 w-6 ${
                            isUpcoming ? "text-blue-600" : "text-gray-500"
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-gray-900">
                              {app.patient?.name || "Unknown Patient"}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isUpcoming ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                            }`}>
                              {isUpcoming ? "Upcoming" : "Past"}
                            </span>
                          </div>
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
                      
                      <div className="flex items-center gap-3">
                        <button 
                          className={`text-sm font-medium ${
                            isUpcoming ? "text-blue-600 hover:text-blue-800" : "text-gray-500"
                          }`}
                          onClick={() => toggleAppointmentDetails(app.id)}
                        >
                          {expandedAppointment === app.id ? "Hide Details" : "View Details"}
                        </button>
                        <ChevronDownIcon 
                          className={`h-5 w-5 transition-transform ${
                            expandedAppointment === app.id 
                              ? 'rotate-180 text-blue-600' 
                              : (isUpcoming ? 'text-gray-500' : 'text-gray-400')
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {expandedAppointment === app.id && (
                    <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Appointment Details</h4>
                          <div className="space-y-3">
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
                            <div className="flex justify-between">
                              <span className="text-gray-600">Reason:</span>
                              <span className="font-medium">
                                {app.reason || "General consultation"}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Patient Information</h4>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium text-gray-900">
                                  {app.patient?.name || "Unknown Patient"}
                                </h5>
                              </div>
                              
                              <div className="flex items-start">
                                <span className="text-gray-600 text-sm font-medium w-24">Contact:</span>
                                <span className="text-gray-600 text-sm">
                                  {app.patient?.email || "N/A"}
                                </span>
                              </div>
                              
                              <div className="flex items-start">
                                <span className="text-gray-600 text-sm font-medium w-24">Phone:</span>
                                <span className="text-gray-600 text-sm">
                                  {app.patient?.phone || "N/A"}
                                </span>
                              </div>
                              
                              <div className="flex items-start">
                                <span className="text-gray-600 text-sm font-medium w-24">Gender:</span>
                                <span className="text-gray-600 text-sm capitalize">
                                  {app.patient?.gender || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {isUpcoming && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <h4 className="font-medium text-gray-900 mb-3">Update Status</h4>
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => handleStatusChange(app.id, "confirmed")}
                              disabled={updatingStatus[app.id]}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                app.status === "confirmed" 
                                  ? "bg-green-600 text-white" 
                                  : "bg-green-100 text-green-800 hover:bg-green-200"
                              }`}
                            >
                              {updatingStatus[app.id] && app.status === "confirmed" ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <CheckCircleIcon className="h-5 w-5" />
                              )}
                              Confirm
                            </button>
                            
                            <button
                              onClick={() => handleStatusChange(app.id, "completed")}
                              disabled={updatingStatus[app.id]}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                app.status === "completed" 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              }`}
                            >
                              {updatingStatus[app.id] && app.status === "completed" ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                              Complete
                            </button>
                            
                            <button
                              onClick={() => handleStatusChange(app.id, "cancelled")}
                              disabled={updatingStatus[app.id]}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                app.status === "cancelled" 
                                  ? "bg-red-600 text-white" 
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                            >
                              {updatingStatus[app.id] && app.status === "cancelled" ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <XCircleIcon className="h-5 w-5" />
                              )}
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorAppointments;