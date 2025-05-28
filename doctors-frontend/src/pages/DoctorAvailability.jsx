import { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import SuccessAlert from "../components/Alerts/SuccessAlert";
import Spinner from "../components/Spinner";
import ErrorAlert from "../components/Alerts/ErrorAlert";

function DoctorAvailability() {
  const [availabilities, setAvailabilities] = useState([{ date: "", from: "", to: "" }]);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setAvailabilities([...availabilities, { date: "", from: "", to: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...availabilities];
    updated[index][field] = value;
    setAvailabilities(updated);
  };

  const validateTimes = () => {
    return availabilities.every(a => 
      a.date && a.from && a.to && 
      new Date(`1970-01-01T${a.to}`) > new Date(`1970-01-01T${a.from}`)
    );
  };

  const handleSave = async () => {
    if (!validateTimes()) {
      setMessage({ type: "error", content: "Please check date and time entries" });
      return;
    }

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <CalendarIcon className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Availability</h1>
            <p className="text-gray-600 mt-1">Set your available time slots for appointments</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {message.content && (
            <div className="mb-6">
              {message.type === "success" ? (
                <SuccessAlert message={message.content} />
              ) : (
                <ErrorAlert message={message.content} />
              )}
            </div>
          )}

          <div className="space-y-6">
            {availabilities.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={item.date}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      onChange={(e) => handleChange(index, 'date', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={item.from}
                    onChange={(e) => handleChange(index, 'from', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={item.to}
                    onChange={(e) => handleChange(index, 'to', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
              <button
                type="button"
                onClick={handleAdd}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Add Time Slot
              </button>
              
              <button
                type="button"
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
                    Save Schedule
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorAvailability;