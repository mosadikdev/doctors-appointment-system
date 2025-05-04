<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Appointment::where('user_id', Auth::id())->get();
        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
        ]);

        $exists = Appointment::where('doctor_id', $request->doctor_id)
            ->where('date', $request->date)
            ->where('time', $request->time)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'هذا الموعد محجوز بالفعل.'], 409);
        }

        $appointment = Appointment::create([
            'user_id' => Auth::id(),
            'doctor_id' => $request->doctor_id,
            'date' => $request->date,
            'time' => $request->time,
            'status' => 'pending',
        ]);

        return response()->json($appointment, 201);
    }

    public function show($id)
    {
        $appointment = Appointment::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return response()->json($appointment);
    }

    public function destroy($id)
    {
        $appointment = Appointment::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $appointment->delete();

        return response()->json(['message' => 'تم حذف الموعد بنجاح.']);
    }
}
