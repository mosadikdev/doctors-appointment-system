<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:500'
        ]);

       
        $existingReview = Review::where([
            'patient_id' => Auth::id(),
            'doctor_id' => $request->doctor_id
        ])->exists();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this doctor'
            ], 409);
        }

        $review = Review::create([
            'patient_id' => Auth::id(),
            'doctor_id' => $request->doctor_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review
        ], 201);
    }

    public function index(Request $request)
    {
        $request->validate([
            'doctor_id' => 'sometimes|exists:users,id'
        ]);

        $query = Review::with('patient');

        if ($request->has('doctor_id')) {
            $query->where('doctor_id', $request->doctor_id)
                  ->approved();
        }

        return $query->recent()->paginate(10);
    }

    public function show(Review $review)
    {
        return $review->load('patient');
    }

    public function update(Request $request, Review $review)
    {
        $request->validate([
            'status' => ['sometimes', Rule::in(['approved', 'rejected'])]
        ]);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $review->doctor_id) {
            abort(403, 'Unauthorized action.');
        }

        $review->update($request->only('status'));

        return response()->json([
            'message' => 'Review updated successfully',
            'review' => $review
        ]);
    }

    public function destroy(Review $review)
    {
        if (Auth::user()->role !== 'admin' && 
            Auth::id() !== $review->patient_id && 
            Auth::id() !== $review->doctor_id) {
            abort(403, 'Unauthorized action.');
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }


    public function pending()
{
    $reviews = Review::with(['doctor', 'patient'])
        ->where('status', 'pending')
        ->paginate(10);

    return response()->json($reviews);
}



public function doctorReviews(User $doctor)
{
    $reviews = Review::with('patient')
        ->where('doctor_id', $doctor->id)
        ->where('status', 'approved')
        ->orderBy('created_at', 'desc')
        ->paginate(10);

    return response()->json($reviews);
}


public function adminIndex()
{
    $reviews = Review::with(['patient', 'doctor'])
                ->orderBy('created_at', 'desc')
                ->get();

    return response()->json($reviews);
}

public function updateStatus(Request $request, Review $review)
{
    $request->validate([
        'status' => ['required', Rule::in(['approved', 'rejected'])]
    ]);

    $review->update(['status' => $request->status]);

    return response()->json([
        'message' => 'Review status updated successfully',
        'review' => $review
    ]);
}


public function forDoctor(User $doctor)
{
    // Validate doctor role
    if ($doctor->role !== 'doctor') {
        return response()->json(['message' => 'User is not a doctor'], 400);
    }

    // Return approved reviews for this doctor
    $reviews = Review::with('patient')
        ->where('doctor_id', $doctor->id)
        ->where('status', 'approved')
        ->orderBy('created_at', 'desc')
        ->paginate(10);

    return response()->json($reviews);
}
}