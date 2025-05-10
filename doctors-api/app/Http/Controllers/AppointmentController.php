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
        $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'appointment_time' => 'required|date|after:now',
        ]);

        $appointment = Appointment::create([
            'patient_id' => Auth::id(),
            'doctor_id' => $request->doctor_id,
            'appointment_time' => $request->appointment_time,
        ]);

        return response()->json([
            'message' => 'The appointment was created successfully.',
            'appointment' => $appointment,
        ], 201);
    }

    public function myAppointments()
    {
        $appointments = Appointment::where('patient_id', Auth::id())->with('doctor')->get();

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
            'status' => 'required|in:pending,confirmed,cancelled',
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

}