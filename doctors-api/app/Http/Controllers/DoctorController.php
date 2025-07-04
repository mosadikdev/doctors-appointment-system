<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Availability;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DoctorController extends Controller
{
    public function index(Request $request)
{
    $query = \App\Models\User::where('role', 'doctor');

    if ($request->filled('city')) {
    $query->where('city', $request->city);
}

if ($request->filled('specialty')) {
    $query->where('specialty', $request->specialty);
}


    $doctors = $query->get();

    return response()->json([
        'doctors' => $doctors
    ]);
}


    public function dashboard()
    {
        return response()->json(['message' => 'Welcome Doctor!']);
    }

    public function myAppointments()
    {
        $appointments = Appointment::where('doctor_id', Auth::id())
            ->with('patient')
            ->get();

        return response()->json([
            'doctor_id' => Auth::id(),
            'appointments' => $appointments
        ]);
    }

    public function getStats()
{
    $doctorId = auth()->id();
    $today = now()->toDateString();

    $confirmedAppointments = Appointment::where('doctor_id', $doctorId)
        ->where('status', 'confirmed')
        ->where('appointment_date', '>=', $today)
        ->count();

    $pendingAppointments = Appointment::where('doctor_id', $doctorId)
        ->where('status', 'pending')
        ->where('appointment_date', '>=', $today)
        ->count();

    $availableSlots = Availability::where('user_id', $doctorId)->count();

    $totalPatients = Appointment::where('doctor_id', $doctorId)
        ->distinct('patient_id')
        ->count('patient_id');

    return response()->json([
        'confirmedAppointments' => $confirmedAppointments,
        'pendingAppointments' => $pendingAppointments,
        'availableSlots' => $availableSlots,
        'totalPatients' => $totalPatients
    ]);
}


public function show($id)
{
    $doctor = User::where('role', 'doctor')->find($id);

    if (!$doctor) {
        return response()->json(['error' => 'Doctor not found'], 404);
    }

    return response()->json([
        'id' => $doctor->id,
        'name' => $doctor->name,
        'email' => $doctor->email,
        'phone' => $doctor->phone,
        'gender' => $doctor->gender,
        'specialty' => $doctor->specialty,
        'city' => $doctor->city,
        'photo_url' => $doctor->photo_url,
        'availability' => $doctor->availability,
        'bio' => $doctor->bio,
        'address' => $doctor->address,
        'reviews_count' => $doctor->reviews_count ?? 0,
        'reviews_avg_rating' => $doctor->reviews_avg_rating ?? 0,
    ]);
}






}
