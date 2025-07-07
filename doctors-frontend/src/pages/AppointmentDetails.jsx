import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  MapPinIcon, 
  DocumentTextIcon,
  ArrowLeftIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8000/api/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data) {
          setAppointment(res.data);
        } else {
          setError("Appointment not found");
        }
      } catch (err) {
        console.error("Error fetching appointment:", err);
        setError("Failed to load appointment details");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Redirect to appointments list after cancellation
      navigate("/my-appointments");
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <DocumentTextIcon className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-4">Appointment Not Found</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <Link to="/my-appointments" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
            Back to My Appointments
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("confirmed")) return "bg-green-100 text-green-800";
    if (statusLower.includes("pending")) return "bg-yellow-100 text-yellow-800";
    if (statusLower.includes("cancelled")) return "bg-red-100 text-red-800";
    if (statusLower.includes("completed")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  // Handle different response structures from backend
  const getDoctorInfo = () => {
    return {
      id: appointment.doctor?.id || appointment.doctor_id,
      name: appointment.doctor?.name || "Dr. Unknown",
      specialty: appointment.doctor?.specialty || "General Practitioner",
      phone: appointment.doctor?.phone || "N/A",
      clinic_address: appointment.doctor?.clinic_address || "N/A",
      photo: appointment.doctor?.photo || "/placeholder.png"
    };
  };

  const doctor = getDoctorInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/my-appointments" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to My Appointments
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Appointment Details</h1>
                <p className="opacity-90 mt-1">ID: #{appointment.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Appointment Info */}
              <div className="lg:col-span-2">
                <div className="bg-blue-50 rounded-lg p-5">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Information</h2>
                  
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CalendarIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Date & Time</h3>
                        <p className="mt-1 text-gray-600">
                          {formatDate(appointment.appointment_date)} at {appointment.appointment_time}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Reason for Visit</h3>
                        <p className="mt-1 text-gray-600">
                          {appointment.reason || "General consultation"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ClockIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Duration</h3>
                        <p className="mt-1 text-gray-600">30 minutes</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Notes */}
                {appointment.notes && (
                  <div className="mt-6 bg-yellow-50 rounded-lg p-5">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h2>
                    <p className="text-gray-700">{appointment.notes}</p>
                  </div>
                )}
              </div>
              
              {/* Doctor Information */}
              <div>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Doctor Information</h2>
                  
                  <div className="flex items-center mb-4">
                    <img 
                      src={doctor.photo} 
                      alt={doctor.name} 
                      className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
                    />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">
                          {doctor.clinic_address}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm text-gray-600">
                          {doctor.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link 
                      to={`/doctor/${doctor.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-center block font-medium transition-colors"
                    >
                      View Doctor Profile
                    </Link>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                  
                  <div className="space-y-3">
                    {appointment.status.toLowerCase() !== "cancelled" && 
                     appointment.status.toLowerCase() !== "completed" && (
                      <button
                        onClick={handleCancel}
                        className="w-full flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 py-2.5 px-4 rounded-lg font-medium transition-colors"
                      >
                        <XCircleIcon className="h-5 w-5" />
                        Cancel Appointment
                      </button>
                    )}
                    
                    <Link 
                      to={`/book/${doctor.id}`}
                      className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-2.5 px-4 rounded-lg text-center block font-medium transition-colors"
                    >
                      Reschedule Appointment
                    </Link>
                    
                    <Link 
                      to="/messages"
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg text-center block font-medium transition-colors"
                    >
                      Contact Doctor
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetails;