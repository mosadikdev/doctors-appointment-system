<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class PatientController extends Controller
{
    public function bookAppointment(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'doctor_id' => 'required|exists:users,id',
        ]);

        $appointment = Appointment::create([
            'patient_id' => Auth::id(),
            'doctor_id' => $request->doctor_id,
            'date' => $request->date,
        ]);

        return response()->json($appointment, 201);
    }

    public function stats()
    {
        $patientId = Auth::id();
        $now = Carbon::now();
        
        return response()->json([
            'upcomingAppointments' => Appointment::where('patient_id', $patientId)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where('appointment_date', '>=', $now->toDateString())
                ->count(),
                
            'completedAppointments' => Appointment::where('patient_id', $patientId)
                ->where('status', 'completed')
                ->count(),
                
            'savedDoctors' => Auth::user()->bookmarkedDoctors()->count()
        ]);
    }

    public function upcomingAppointments()
    {
        $now = Carbon::now();
        
        $appointments = Auth::user()->appointments()
            ->with('doctor')
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('appointment_date', '>=', $now->toDateString())
            ->orderBy('appointment_date', 'asc')
            ->orderBy('appointment_time', 'asc')
            ->get()
            ->map(function ($appointment) {
                $appointmentDate = Carbon::parse($appointment->appointment_date);
                
                return [
                    'id' => $appointment->id,
                    'doctorName' => $appointment->doctor->name,
                    'reason' => $appointment->reason ?? 'Consultation',
                    'day' => $appointmentDate->format('M d'),
                    'date' => $appointmentDate->toDateString(),
                    'timeStart' => $appointment->appointment_time,
                    'timeEnd' => Carbon::parse($appointment->appointment_time)
                        ->addMinutes(30)
                        ->format('H:i')
                ];
            });
            
        return response()->json($appointments);
    }

    public function savedDoctors()
    {
        return Auth::user()->bookmarkedDoctors()
            ->get()
            ->map(function ($doctor) {
                return [
                    'id' => $doctor->id,
                    'name' => $doctor->name,
                    'specialty' => $doctor->specialty,
                    'rating' => $doctor->reviews_avg_rating ?? 4.5,
                    'reviewsCount' => $doctor->reviews_count ?? 12,
                    'photo' => $doctor->photo_url ?? '/placeholder.png'
                ];
            });
    }


    public function bookmarkDoctor($doctorId)
{
    $patient = Auth::user();
    $doctor = User::findOrFail($doctorId);
    
    if ($doctor->role !== 'doctor') {
        return response()->json(['error' => 'User is not a doctor'], 400);
    }
    
    $patient->bookmarkedDoctors()->syncWithoutDetaching([$doctorId]);
    
    return response()->json(['message' => 'Doctor bookmarked']);
}

public function removeBookmark($doctorId)
{
    $patient = Auth::user();
    $patient->bookmarkedDoctors()->detach($doctorId);
    
    return response()->json(['message' => 'Bookmark removed']);
}
}
