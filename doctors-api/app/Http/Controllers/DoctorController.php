<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DoctorController extends Controller
{
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
}
