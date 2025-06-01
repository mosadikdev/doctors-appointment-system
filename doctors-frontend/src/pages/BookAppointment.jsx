// doctors-frontend\src\pages\BookAppointment.jsx:
import { useEffect, useState } from "react";
import axios from "axios";
import { UserIcon, CalendarIcon, ClockIcon, ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/doctors", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(res.data.doctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!selectedDoctor || !appointmentDate) return;
      
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8000/api/doctors/${selectedDoctor}/times`,
          {
            params: { date: appointmentDate },
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setAvailableTimes(res.data.times);
        
        // Get doctor details for display
        const doc = doctors.find(d => d.id == selectedDoctor);
        if (doc) setDoctorDetails(doc);
      } catch (err) {
        console.error("Error fetching times:", err);
        setAvailableTimes([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAvailableTimes();
  }, [selectedDoctor, appointmentDate, doctors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      setMessage("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/appointments",
        {
          doctor_id: selectedDoctor,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage("success");
      setSelectedDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");
    } catch (error) {
      console.error("Booking error:", error);
      setMessage(`error: ${error.response?.data?.message || "Failed to book appointment"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedDoctor("");
    setAppointmentDate("");
    setAppointmentTime("");
    setAvailableTimes([]);
    setDoctorDetails(null);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Book Your Medical Appointment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Schedule your visit with our specialized doctors in just a few clicks
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Doctor Info Panel */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 lg:p-10">
              <div className="flex flex-col h-full">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">Appointment Details</h2>
                  {doctorDetails ? (
                    <div className="flex items-center gap-5 mb-6">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                      <div>
                        <h3 className="text-xl font-bold">Dr. {doctorDetails.name}</h3>
                        <p className="text-blue-100">{doctorDetails.specialty}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex text-yellow-300">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-blue-100 text-sm ml-2">4.8 (120 reviews)</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-5 mb-6">
                      <div className="bg-blue-500/20 p-3 rounded-full">
                        <UserIcon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Select a Doctor</h3>
                        <p className="text-blue-100">Choose from our specialists</p>
                      </div>
                    </div>
                  )}
                  
                  {appointmentDate && (
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="bg-blue-500/20 p-2 rounded-lg">
                          <CalendarIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-blue-100">Appointment Date</p>
                          <p className="font-semibold">
                            {new Date(appointmentDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {appointmentTime && (
                        <div className="flex gap-4">
                          <div className="bg-blue-500/20 p-2 rounded-lg">
                            <ClockIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-blue-100">Appointment Time</p>
                            <p className="font-semibold">{appointmentTime}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-auto">
                  <div className="flex items-center gap-3 text-blue-100 text-sm">
                    <CheckCircleIcon className="h-5 w-5" />
                    <p>Instant confirmation</p>
                  </div>
                  <div className="flex items-center gap-3 text-blue-100 text-sm mt-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    <p>No booking fees</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Booking Form */}
            <div className="p-8 lg:p-10 lg:col-span-2">
              {message === "success" ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircleIcon className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Appointment Booked Successfully!</h3>
                  <p className="text-gray-600 mb-8">
                    Your appointment has been confirmed. You'll receive a confirmation email shortly.
                  </p>
                  <button
                    onClick={resetForm}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
                  >
                    Book Another Appointment
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select a Doctor
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDoctor}
                        onChange={(e) => {
                          setSelectedDoctor(e.target.value);
                          setAppointmentDate("");
                          setAppointmentTime("");
                        }}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={isLoading}
                      >
                        <option value="">Choose a doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            Dr. {doctor.name} - {doctor.specialty}
                          </option>
                        ))}
                      </select>
                      <div className="absolute left-3 top-3 text-gray-400">
                        <UserIcon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  {selectedDoctor && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select a Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={appointmentDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => {
                            setAppointmentDate(e.target.value);
                            setAppointmentTime("");
                          }}
                          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          disabled={isLoading}
                        />
                        <div className="absolute left-3 top-3 text-gray-400">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  )}

                  {appointmentDate && availableTimes.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Time Slots
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {availableTimes.map((time, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setAppointmentTime(time)}
                            className={`py-3 px-4 rounded-lg border text-center ${
                              appointmentTime === time
                                ? 'bg-blue-100 border-blue-500 text-blue-700 font-medium'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex justify-center py-4">
                      <ArrowPathIcon className="h-6 w-6 text-blue-600 animate-spin" />
                    </div>
                  )}

                  {message.startsWith("error:") && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-red-700">{message.replace("error:", "")}</p>
                    </div>
                  )}

                  {selectedDoctor && appointmentDate && availableTimes.length === 0 && !isLoading && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                      <p className="text-yellow-700">
                        No available time slots for this date. Please select another date.
                      </p>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading || !appointmentTime}
                      className={`w-full py-3.5 px-6 rounded-lg font-medium text-white ${
                        isLoading || !appointmentTime
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } transition-colors`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                          Booking your appointment...
                        </span>
                      ) : (
                        'Confirm Appointment'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex gap-4 items-start">
              <div className="bg-blue-100 p-3 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Flexible Scheduling</h3>
                <p className="text-sm text-gray-600">Choose a time that works best for you</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex gap-4 items-start">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Instant Confirmation</h3>
                <p className="text-sm text-gray-600">Get your appointment confirmed immediately</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex gap-4 items-start">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">24/7 Support</h3>
                <p className="text-sm text-gray-600">Our team is always ready to assist you</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;