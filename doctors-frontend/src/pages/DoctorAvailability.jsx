import { useState } from "react";
import axios from "axios";
import { format } from "date-fns";

function DoctorAvailability() {
  const [availabilities, setAvailabilities] = useState([
    { date: "", from: "", to: "" },
  ]);
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    setAvailabilities([...availabilities, { date: "", from: "", to: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...availabilities];
    updated[index][field] = value;
    setAvailabilities(updated);
  };

  const handleSave = async () => {
  try {
    const formattedAvailabilities = availabilities.map(a => ({
      date: a.date,
      from: a.from,
      to: a.to
    }));

    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:8000/api/doctor/availability",
      { availabilities: formattedAvailabilities }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    setMessage("✅ Saved successfully");
  } catch (err) {
    console.error("Error details:", err.response?.data);
    setMessage(`❌ error: ${err.response?.data?.error || err.message}`);
  }
};

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        🗓️ Manage available appointments
      </h2>

      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <div className="space-y-6">
          {availabilities.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={item.date}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => handleChange(index, 'date', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  from
                </label>
                <input
                  type="time"
                  value={item.from}
                  onChange={(e) => handleChange(index, 'from', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  to
                </label>
                <input
                  type="time"
                  value={item.to}
                  onChange={(e) => handleChange(index, 'to', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          ))}

          <div className="flex gap-4 justify-end mt-6">
            <button
              type="button"
              onClick={handleAdd}
              className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              + Add appointment
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save appointments
            </button>
          </div>

          {message && (
            <p className={`mt-4 text-center font-semibold ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorAvailability;