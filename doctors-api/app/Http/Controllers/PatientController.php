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
    try {
        $now = Carbon::now();
        
        $appointments = Auth::user()->appointments()
            ->with(['doctor' => function($query) {
                $query->select('id', 'name');
            }])
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($now) {
                $query->where('appointment_date', '>', $now->toDateString())
                    ->orWhere(function ($query) use ($now) {
                        $query->where('appointment_date', $now->toDateString())
                            ->where('appointment_time', '>', $now->format('H:i:s'));
                    });
            })
            ->orderBy('appointment_date', 'asc')
            ->orderBy('appointment_time', 'asc')
            ->get()
            ->map(function ($appointment) {
                $appointmentDate = Carbon::parse($appointment->appointment_date);
                
                return [
                    'id' => $appointment->id,
                    'doctorName' => $appointment->doctor->name ?? 'Unknown Doctor',
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
    } catch (\Exception $e) {
        \Log::error('Error fetching upcoming appointments: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}

    public function savedDoctors()
{
    try {
        $patient = Auth::user();
        
        return $patient->bookmarkedDoctors()
            ->get()
            ->map(function ($doctor) {
                return [
                    'id' => $doctor->id,
                    'name' => $doctor->name,
                    'specialty' => $doctor->specialty,
                    'rating' => 4.5, 
                    'reviewsCount' => 12, 
                    'photo' => $doctor->photo_url ?? '/placeholder.png'
                ];
            });
    } catch (\Exception $e) {
        \Log::error('Error fetching saved doctors: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
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
