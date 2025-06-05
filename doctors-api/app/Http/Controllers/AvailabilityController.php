<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Availability;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AvailabilityController extends Controller
{
    public function index()
    {
        $availabilities = Auth::user()->availabilities;
        return response()->json($availabilities);
    }

    public function store(Request $request)
    {
        $request->validate([
        'doctor_id' => 'required|exists:users,id,role,doctor',
        'appointment_date' => 'required|date|after:today',
        'appointment_time' => 'required|date_format:H:i',
    ]);

        $doctor = User::where('id', $request->doctor_id)->where('role', 'doctor')->firstOrFail();

        $dayName = Carbon::parse($request->appointment_date)->format('l');

        $isAvailable = $doctor->availabilities()
            ->where('day', $dayName)
            ->where('start_time', '<=', $request->appointment_time)
            ->where('end_time', '>', $request->appointment_time)
            ->exists();

        if (! $isAvailable) {
            return response()->json([
                'message' => 'Doctor is not available at the selected date and time.'
            ], 400);
        }

        $appointment = Appointment::create([
            'patient_id' => Auth::id(),
            'doctor_id' => $doctor->id,
            'appointment_date' => $request->appointment_date,
            'appointment_time' => $request->appointment_time,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Appointment created successfully',
            'appointment' => $appointment
        ]);
    }

    public function destroy($id)
    {
        $availability = Availability::where('user_id', Auth::id())->findOrFail($id);
        $availability->delete();

        return response()->json(['message' => 'Availability deleted']);
    }
}
