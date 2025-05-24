<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\DoctorAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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


}
