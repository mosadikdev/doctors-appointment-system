<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    AdminController,
    DoctorController,
    PatientController,
    AppointmentController,
    AvailabilityController,
    DoctorAvailabilityController
};

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', fn($request) => response()->json([
        'message' => 'Welcome!',
        'user' => $request->user()
    ]));

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', fn($request) => tap(auth()->user())->update($request->only('name', 'email', 'specialty', 'city')));
    Route::post('/profile/update', [AuthController::class, 'updateProfile']);

    // Appointments (common)
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']); 
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);

    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', fn() => response()->json(['message' => 'Hello admin']));
        Route::get('/admin/allusers', [AdminController::class, 'allUsers']);
        Route::post('/admin/add-user', [AdminController::class, 'addUser']);
        Route::get('/admin/users/{id}', [AdminController::class, 'getUser']);
        Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/admin/stats', [AdminController::class, 'getStats']);
    });

    // Doctor routes
    Route::middleware('role:doctor')->group(function () {
        Route::get('/doctor/dashboard', fn() => response()->json(['message' => 'Hello Doctor']));
        Route::get('/doctor/appointments', [DoctorController::class, 'myAppointments']);
        Route::put('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);
        Route::put('/appointments/{id}/confirm', [AppointmentController::class, 'confirm']);
        Route::put('/appointments/{id}/complete', [AppointmentController::class, 'complete']);
        Route::get('/availability', [AvailabilityController::class, 'index']);
        Route::delete('/availability/{id}', [AvailabilityController::class, 'destroy']);
        Route::post('/doctor/availability', [DoctorAvailabilityController::class, 'store']);
        Route::get('/doctor/stats', [DoctorController::class, 'getStats']);
    });

    // Patient routes
    Route::middleware('role:patient')->group(function () {
        Route::get('/patient/dashboard', fn() => response()->json(['message' => 'Hello Patient']));
        Route::get('/doctors', [DoctorController::class, 'index']);
        Route::post('/patient/appointments', [PatientController::class, 'bookAppointment']);
        Route::get('/patient/appointments', [AppointmentController::class, 'myAppointments']);
        Route::get('/doctors/{doctor}/availabilities', [DoctorAvailabilityController::class, 'getAvailableTimes']);
        Route::get('/doctors/{doctor}/availability', [DoctorAvailabilityController::class, 'index']);
        Route::get('/doctors/{doctor}/times', [DoctorAvailabilityController::class, 'getTimes']);
        Route::get('/patient/stats', [PatientController::class, 'stats']);
        Route::get('/patient/upcoming-appointments', [PatientController::class, 'upcomingAppointments']);

        Route::get('/patient/bookmarks', [PatientController::class, 'savedDoctors']);
        Route::post('/patient/bookmarks/{doctor}', [PatientController::class, 'bookmarkDoctor']);
        Route::delete('/patient/bookmarks/{doctor}', [PatientController::class, 'removeBookmark']);
    });
});
