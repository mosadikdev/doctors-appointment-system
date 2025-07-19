import { useState, useEffect } from "react";
import axios from "axios";
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isPast } from "date-fns";
import { CalendarIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import SuccessAlert from "../components/Alerts/SuccessAlert";
import Spinner from "../components/Spinner";
import ErrorAlert from "../components/Alerts/ErrorAlert";

function DoctorAvailability() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState({});
  const [message, setMessage] = useState({ type: "", content: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate all days for current month
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
    
    setDays(daysInMonth.map(day => ({
      date: day,
      formatted: format(day, 'yyyy-MM-dd'),
      dayOfMonth: format(day, 'd'),
      dayOfWeek: format(day, 'EEE'),
      isToday: isToday(day),
      isPast: isPast(day) && !isToday(day)
    })));
  }, [currentMonth]);

  const handleMonthChange = (months) => {
    setCurrentMonth(addMonths(currentMonth, months));
  };

  const toggleDaySelection = (day) => {
    if (day.isPast) return;
    
    setSelectedDays(prev => {
      if (prev.includes(day.formatted)) {
        return prev.filter(d => d !== day.formatted);
      } else {
        return [...prev, day.formatted];
      }
    });
  };

  const handleTimeChange = (day, field, value) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const validateTimeSlots = () => {
    return selectedDays.every(day => {
      const slot = timeSlots[day];
      return slot?.from && slot?.to && 
             new Date(`1970-01-01T${slot.to}`) > new Date(`1970-01-01T${slot.from}`);
    });
  };

  const handleSave = async () => {
    if (!validateTimeSlots()) {
      setMessage({ type: "error", content: "Please set valid time slots for selected days" });
      return;
    }

    const availabilities = selectedDays.map(day => ({
      date: day,
      from: timeSlots[day]?.from || "09:00",
      to: timeSlots[day]?.to || "17:00"
    }));

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8000/api/doctor/availability",
        { availabilities },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );
      setMessage({ type: "success", content: "Availability saved successfully!" });
      setTimeout(() => setMessage({ type: "", content: "" }), 3000);
    } catch (err) {
      setMessage({ 
        type: "error", 
        content: err.response?.data?.message || "Failed to save availability" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner size="lg" variant="primary" />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <CalendarIcon className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Monthly Availability</h1>
            <p className="text-gray-600 mt-1">Select days and set your available time slots</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          {message.content && (
            <div className="mb-6">
              {message.type === "success" ? (
                <SuccessAlert message={message.content} />
              ) : (
                <ErrorAlert message={message.content} />
              )}
            </div>
          )}

          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => handleMonthChange(-1)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              &larr; Previous
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button 
              onClick={() => handleMonthChange(1)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              Next &rarr;
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            
            {days.map(day => (
              <div 
                key={day.formatted}
                onClick={() => toggleDaySelection(day)}
                className={`relative p-2 rounded-lg border cursor-pointer text-center transition-colors
                  ${day.isPast ? 'bg-gray-100 text-gray-400' : ''}
                  ${day.isToday ? 'border-blue-500' : 'border-gray-200'}
                  ${selectedDays.includes(day.formatted) ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}
                `}
              >
                <div className="flex flex-col items-center">
                  <span className={`text-sm ${day.isToday ? 'font-bold text-blue-600' : ''}`}>
                    {day.dayOfMonth}
                  </span>
                  {selectedDays.includes(day.formatted) && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 absolute top-1 right-1" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots for Selected Days */}
          {selectedDays.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Set Available Times for Selected Days
              </h3>
              
              <div className="space-y-4">
                {selectedDays.map(day => (
                  <div key={day} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="font-medium text-blue-800">
                        {format(new Date(day), 'EEEE, MMM d')}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From
                      </label>
                      <input
                        type="time"
                        value={timeSlots[day]?.from || "09:00"}
                        onChange={(e) => handleTimeChange(day, 'from', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To
                      </label>
                      <input
                        type="time"
                        value={timeSlots[day]?.to || "17:00"}
                        onChange={(e) => handleTimeChange(day, 'to', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          {selectedDays.length > 0 && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" variant="white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ClockIcon className="h-5 w-5" />
                    Save Availability
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorAvailability;