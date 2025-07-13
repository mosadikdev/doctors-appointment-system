import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  CalendarIcon, 
  UserIcon, 
  ClockIcon, 
  HeartIcon, 
  ArrowRightIcon 
} from "@heroicons/react/24/outline";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (token && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (user.role === "patient") {
        navigate("/patient/dashboard");
      }
    }
  }, [token, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              <span className="block">Book Doctor Appointments</span>
              <span className="block text-indigo-600 mt-2">In Seconds, Not Days</span>
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-xl">
              Find the perfect doctor, book appointments instantly, and manage your healthcare - all in one place.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {!token ? (
                <>
                  <Link 
                    to="/register" 
                    className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-center"
                  >
                    Get Started
                  </Link>
                  <Link 
                    to="/login" 
                    className="px-8 py-3 bg-white text-indigo-600 border border-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors text-center"
                  >
                    Log In
                  </Link>
                </>
              ) : (
                <Link 
                  to={user.role === "patient" ? "/patient/dashboard" : 
                      user.role === "doctor" ? "/doctor/dashboard" : "/admin"} 
                  className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  Go to Dashboard <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="bg-indigo-600 rounded-2xl w-80 h-80 transform rotate-6 absolute -z-10"></div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-80 h-80">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                  <div className="text-center p-4">
                    <CalendarIcon className="h-16 w-16 text-indigo-600 mx-auto" />
                    <p className="mt-4 text-gray-600 font-medium">Easy Appointment Booking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Simple steps to get the healthcare you need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-indigo-50 rounded-xl p-6 text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <UserIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4">Find a Doctor</h3>
              <p className="mt-2 text-gray-600">
                Search by specialty, location, or availability to find the perfect healthcare provider.
              </p>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-6 text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <CalendarIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4">Book Appointment</h3>
              <p className="mt-2 text-gray-600">
                Select your preferred date and time from real-time availability. Book instantly online.
              </p>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-6 text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <HeartIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4">Get Care</h3>
              <p className="mt-2 text-gray-600">
                Receive reminders, attend your appointment, and manage follow-ups all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to book your appointment?
          </h2>
          <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto">
            Join thousands of patients who are managing their healthcare with our simple platform.
          </p>
          <div className="mt-8">
            <Link
              to={token ? "/book" : "/register"}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
            >
              {token ? "Book Appointment Now" : "Get Started"}
              <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;