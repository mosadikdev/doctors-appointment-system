import { useState, useEffect } from "react";
import axios from "axios";
import { HeartIcon, StarIcon, MapPinIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [cities, setCities] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState({});

  

  const fetchDoctors = async (selectedCity = "", selectedSpecialty = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/doctors", {
        params: { city: selectedCity, specialty: selectedSpecialty },
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedDoctors = response.data.doctors;
      setDoctors(fetchedDoctors);
      setFilteredDoctors(fetchedDoctors);

      const uniqueCities = [...new Set(fetchedDoctors.map(doc => doc.city).filter(Boolean))];
      const uniqueSpecialties = [...new Set(fetchedDoctors.map(doc => doc.specialty).filter(Boolean))];
      setCities(uniqueCities);
      setSpecialties(uniqueSpecialties);

      const initialBookmarks = {};
      fetchedDoctors.forEach(doc => {
        initialBookmarks[doc.id] = false;
      });
      setIsBookmarked(initialBookmarks);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:8000/api/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const bookmarkedDoctors = response.data.bookmarks;
      const bookmarkState = {};
      bookmarkedDoctors.forEach(b => {
        bookmarkState[b.doctor_id] = true;
      });
      setIsBookmarked(bookmarkState);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchBookmarks();
  }, []);

  useEffect(() => {
    let results = doctors;

    if (city) {
      results = results.filter(doc => doc.city === city);
    }

    if (specialty) {
      results = results.filter(doc => doc.specialty === specialty);
    }

    if (searchQuery) {
      results = results.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.specialty && doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredDoctors(results);
  }, [city, specialty, searchQuery, doctors]);

  const toggleBookmark = async (doctorId) => {
    const token = localStorage.getItem("token");
    try {
      if (!isBookmarked[doctorId]) {
        await axios.post(`http://localhost:8000/api/bookmarks`,
          { doctor_id: doctorId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(`http://localhost:8000/api/bookmarks/${doctorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setIsBookmarked(prev => ({
        ...prev,
        [doctorId]: !prev[doctorId]
      }));
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const clearFilters = () => {
    setCity("");
    setSpecialty("");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find the Perfect Doctor for You
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connect with specialized healthcare professionals who understand your needs
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or specialty..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>



          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Found
          </h2>
          <div className="flex items-center text-sm text-gray-600">
            <FunnelIcon className="h-4 w-4 mr-1" />
            <span>Sorted by: Availability</span>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-blue-100">
              <UserCircleIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">No doctors found</h3>
            <p className="mt-2 text-gray-600">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {!loading && filteredDoctors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Dr. {doc.name}</h3>
                        <p className="text-blue-600 font-medium">{doc.specialty || "General Practitioner"}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                          <span className="text-gray-500 text-sm ml-2">4.8 (120)</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleBookmark(doc.id)}
                      className={`p-2 rounded-full ${
                        isBookmarked[doc.id]
                          ? 'text-red-500 bg-red-50'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <HeartIcon className={`h-5 w-5 ${isBookmarked[doc.id] ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <MapPinIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{doc.city || "City not specified"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Availability</p>
                        <p className="font-medium">{doc.availability || "Check schedule"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
)}

export default Doctors;
