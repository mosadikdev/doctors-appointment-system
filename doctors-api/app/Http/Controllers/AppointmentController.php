<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{

    public function index()
{
    $appointments = Appointment::with(['doctor', 'patient'])->get();

    return response()->json($appointments);
}



    public function store(Request $request)
{
    $validated = $request->validate([
        'doctor_id' => 'required|exists:users,id',
        'appointment_date' => 'required|date_format:Y-m-d',
        'appointment_time' => 'required|date_format:H:i'
    ]);

    try {
        $appointment = Appointment::create([
            'patient_id' => Auth::id(),
            'doctor_id' => $validated['doctor_id'],
            'appointment_date' => $validated['appointment_date'],
            'appointment_time' => $validated['appointment_time'],
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Booking successful',
            'data' => $appointment
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to book',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function myAppointments()
{
    $appointments = Appointment::where('patient_id', Auth::id())
        ->with('doctor')
        ->get()
        ->map(function ($appointment) {
            return [
                'id' => $appointment->id,
                'appointment_date' => $appointment->appointment_date,
                'appointment_time' => $appointment->appointment_time,
                'status' => $appointment->status,
                'doctor' => $appointment->doctor,
            ];
        });

    return response()->json($appointments);
}

    public function doctorAppointments()
    {
        $appointments = Appointment::where('doctor_id', Auth::id())->with('patient')->get();

        return response()->json($appointments);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
    'status' => 'required|in:pending,confirmed,cancelled,completed',
]);


        $appointment = Appointment::findOrFail($id);

        if ($appointment->doctor_id !== Auth::id()) {
            return response()->json(['message' => 'You are not allowed'], 403);
        }

        $appointment->status = $request->status;
        $appointment->save();

        return response()->json([
            'message' => 'Status updated',
            'appointment' => $appointment,
        ]);
    }

    public function confirm($id)
{
    $appointment = \App\Models\Appointment::find($id);

    if (!$appointment) {
        return response()->json(['message' => 'Appointment not found'], 404);
    }

    $appointment->status = 'confirmed';
    $appointment->save();

    return response()->json(['message' => 'Appointment confirmed successfully']);
}


public function complete($id)
{
    $appointment = Appointment::findOrFail($id);
    
    if (auth()->user()->role !== 'doctor') {
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    $appointment->status = 'completed';
    $appointment->save();

    return response()->json($appointment);
}
}