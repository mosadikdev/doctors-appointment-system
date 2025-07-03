import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  UserIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);



  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctor(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Doctor not found');
        } else {
          setError('Failed to load doctor profile');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };


    const fetchReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8000/api/doctors/${id}/reviews`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReviews(response.data.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchDoctor();
    fetchReviews();
  }, [id, submitSuccess]);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      setSubmitError('Please select a rating');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError('');
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      await axios.post(
        `http://localhost:8000/api/reviews`,
        {
          doctor_id: id,
          rating: rating,
          comment: reviewText,
          patient_id: user.id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSubmitSuccess(true);
      setRating(0);
      setReviewText('');
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit review');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
            <p>{error || 'Doctor not found'}</p>
          </div>
          <Link 
            to="/doctors" 
            className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
          >
            Browse Doctors
          </Link>
        </div>
      </div>
    );
  }

    const rawRating = doctor.reviews_avg_rating;
  const avgRating = typeof rawRating === 'number' ? rawRating : parseFloat(rawRating) || 0;
  const safeAvgRating = isNaN(avgRating) ? 0 : avgRating;
  const reviewCount = doctor.reviews_count || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white p-1 rounded-full">
                {doctor.photo_url ? (
                  <img 
                    src={doctor.photo_url} 
                    alt={`Dr. ${doctor.name}`}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
      <h1 className="text-2xl md:text-3xl font-bold">Dr. {doctor.name}</h1>
      <p className="text-blue-100 text-xl mt-1">{doctor.specialty}</p>
      <div className="flex items-center justify-center md:justify-start mt-3">
        <div className="flex text-yellow-300">
          {[...Array(5)].map((_, i) => (
            <StarIcon 
              key={i} 
              className={`h-5 w-5 ${i < Math.round(safeAvgRating) ? 'fill-current' : ''}`} 
            />
          ))}
        </div>
        <span className="ml-2">
          {safeAvgRating.toFixed(1)} ({reviewCount} reviews)
        </span>
      </div>
    </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About Dr. {doctor.name}</h2>
                <p className="text-gray-600">
                  {doctor.bio || 'Dr. ' + doctor.name + ' is a specialist in ' + doctor.specialty + ' with years of experience providing top-quality care to patients.'}
                </p>

                <div className="space-y-3 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPinIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{doctor.city || 'City not specified'}</p>
                      <p className="text-sm text-gray-600 mt-1">{doctor.address || 'Address not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className="font-medium">{doctor.availability || 'Check schedule for availability'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <PhoneIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{doctor.phone || 'Not available'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <EnvelopeIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{doctor.email || 'Not available'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link 
                    to={`/book/${doctor.id}`}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center block"
                  >
                    Book an Appointment
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Reviews</h2>
      
      {isLoadingReviews ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{review.patient.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 italic">No reviews yet.</p>
        </div>
      )}

      {/* Review form - only show if user hasn't reviewed */}
      {!doctor?.current_user_review && (
        <div className="bg-blue-50 p-6 rounded-lg mt-6">
          {/* ... existing review form ... */}
        </div>
      )}
      
      {doctor?.current_user_review?.status === 'pending' && (
        <div className="bg-yellow-50 p-4 rounded-lg mt-6">
          <p className="text-yellow-700">
            Your review is pending approval. It will be visible once approved.
          </p>
        </div>
      )}
    </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;