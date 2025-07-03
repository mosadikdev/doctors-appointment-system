import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/admin/reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        });
        console.log("Reviews data:", response.data);
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
        }
        setError("Failed to fetch reviews. Please check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const updateReviewStatus = async (reviewId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/admin/reviews/${reviewId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` }} 
      );
      
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, status } : review
      ));
    } catch (err) {
      console.error("Failed to update review status", err);
      alert("Failed to update review status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
            <p className="text-gray-600 mt-2">
              Approve or reject patient reviews for doctors
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Pending Reviews ({reviews.filter(r => r.status === 'pending').length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader>Patient</TableHeader>
                  <TableHeader>Doctor</TableHeader>
                  <TableHeader>Rating</TableHeader>
                  <TableHeader>Review</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader align="text-center">Status</TableHeader>
                  <TableHeader align="text-center">Actions</TableHeader>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                {reviews
                  .filter(review => review.status === 'pending')
                  .map(review => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>{review.patient?.name || 'Anonymous'}</TableCell>
                      <TableCell>Dr. {review.doctor?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-5 w-5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} 
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate max-w-xs">{review.comment}</p>
                      </TableCell>
                      <TableCell>
                        {new Date(review.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => updateReviewStatus(review.id, 'approved')}
                            className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateReviewStatus(review.id, 'rejected')}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </TableCell>
                    </tr>
                  ))}
              </tbody>
            </table>
            
            {reviews.filter(r => r.status === 'pending').length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No pending reviews
              </div>
            )}
          </div>
        </div>

        {/* Approved/Rejected Reviews Section */}
        <div className="mt-10 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Reviews</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader>Patient</TableHeader>
                  <TableHeader>Doctor</TableHeader>
                  <TableHeader>Rating</TableHeader>
                  <TableHeader>Review</TableHeader>
                  <TableHeader>Date</TableHeader>
                  <TableHeader align="text-center">Status</TableHeader>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                {reviews
                  .filter(review => review.status !== 'pending')
                  .map(review => (
                    <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>{review.patient?.name || 'Anonymous'}</TableCell>
                      <TableCell>Dr. {review.doctor?.name || 'Unknown'}</TableCell>
                      <TableCell>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-5 w-5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} 
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p>{review.comment}</p>
                      </TableCell>
                      <TableCell>
                        {new Date(review.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          review.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                        </span>
                      </TableCell>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
  
const TableHeader = ({ children, align = "text-left" }) => (
  <th className={`px-6 py-3 ${align} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
    {children}
  </th>
);

const TableCell = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    {children}
  </td>
);

export default AdminReviews;