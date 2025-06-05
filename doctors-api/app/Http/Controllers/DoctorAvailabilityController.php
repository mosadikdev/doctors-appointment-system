<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Availability;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DoctorAvailabilityController extends Controller
{

    public function index(User $doctor)
{
    $dates = $doctor->availabilities()
        ->where('date', '>=', now()->format('Y-m-d'))
        ->pluck('date')
        ->unique()
        ->values();

    return response()->json(['dates' => $dates]);
}


public function store(Request $request)
{
    $validated = $request->validate([
        'availabilities' => 'required|array',
        'availabilities.*.date' => 'required|date_format:Y-m-d',
        'availabilities.*.from' => 'required|date_format:H:i',
        'availabilities.*.to' => 'required|date_format:H:i|after:availabilities.*.from',
    ]);

    try {
        DB::beginTransaction();

        auth()->user()->availabilities()->delete();

        foreach ($validated['availabilities'] as $availability) {
            auth()->user()->availabilities()->create([
                'date' => $availability['date'],
                'start_time' => $availability['from'],
                'end_time' => $availability['to']
            ]);
        }

        DB::commit();

        return response()->json(['message' => 'Saved successfully']);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'An error occurred while saving',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function getTimes(User $doctor, Request $request)
{
    $request->validate([
        'date' => 'required|date_format:Y-m-d'
    ]);

    $date = $request->query('date');

    $availability = $doctor->availabilities()
        ->where('date', $date)
        ->first();

    if (!$availability) {
        return response()->json(['times' => []]);
    }

    $start = Carbon::parse($availability->start_time);
    $end = Carbon::parse($availability->end_time);
    
    $times = [];
    while ($start < $end) {
        $times[] = $start->format('H:i');
        $start->addMinutes(30);
    }
    
    return response()->json(['times' => $times]);
}

    public function getAvailableTimes(Request $request, User $doctor)
    {
        if ($doctor->role !== 'doctor') {
            return response()->json(['error' => 'Invalid doctor.'], 400);
        }

        $date = Carbon::parse($request->query('date'));
    if ($date->isPast()) {
        return response()->json(['available_times' => []]);
    }

        $dayName = Carbon::parse($date)->format('l');

        $availabilities = $doctor->availabilities()
            ->where('day', $dayName)
            ->get();

        $availableTimes = [];

        foreach ($availabilities as $availability) {
            $start = Carbon::createFromTimeString($availability->start_time);
            $end = Carbon::createFromTimeString($availability->end_time);

            while ($start < $end) {
                $availableTimes[] = $start->format('H:i');
                $start->addMinutes(30);
            }
        }

        $booked = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('appointment_date', $date)
            ->pluck('appointment_time')
            ->map(function ($time) {
                return Carbon::parse($time)->format('H:i');
            })
            ->toArray();

        $filtered = array_values(array_diff($availableTimes, $booked));

        return response()->json(['available_times' => $filtered]);
    }


    
}
