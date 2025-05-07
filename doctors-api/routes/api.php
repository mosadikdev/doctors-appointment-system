<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\AppointmentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', function (Request $request) {
        return response()->json([
            'message' => 'Welcome!',
            'user' => $request->user()
        ]);
    });

    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->group(function () {

    


    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return response()->json(['message' => 'Hello admin']);
    });

    Route::get('/admin/users', [AdminController::class, 'allUsers']);
    Route::post('/admin/add-user', [AdminController::class, 'addUser']);
    Route::get('/admin/users/{id}', [AdminController::class, 'getUser']);
    Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
});

Route::middleware(['auth:sanctum', 'role:doctor'])->group(function () {
    Route::get('/doctor/dashboard', function () {
        return response()->json(['message' => 'Hello Doctor']);
    });

    Route::get('/doctor/appointments', [DoctorController::class, 'myAppointments']);
    Route::put('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);
});

Route::middleware(['auth:sanctum', 'role:patient'])->group(function () {
    Route::get('/patient/dashboard', function () {
        return response()->json(['message' => 'Hello Patient']);
    });

    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::post('/patient/appointments', [PatientController::class, 'bookAppointment']);
    Route::get('/patient/appointments', [AppointmentController::class, 'myAppointments']);


});
