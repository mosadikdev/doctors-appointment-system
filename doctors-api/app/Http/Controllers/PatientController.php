<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
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
}
