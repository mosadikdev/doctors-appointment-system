<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
{
    $fields = $request->validate([
        'name' => 'required|string',
        'email' => 'required|string|unique:users,email',
        'password' => 'required|string|confirmed',
        'role' => 'in:admin,doctor,patient' 
    ]);

    $user = User::create([
        'name' => $fields['name'],
        'email' => $fields['email'],
        'password' => bcrypt($fields['password']),
        'role' => $fields['role'] ?? 'patient' 
    ]);

    $token = $user->createToken('myapptoken')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token
    ], 201);
}



    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Bad credentials'
        ], 401);
    }

    $token = $user->createToken('api_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
    ]);
}



public function logout(Request $request)
{
    $request->user()->tokens()->delete();

    return response()->json([
        'message' => 'You have successfully logged out.'
    ]);
}


public function updateProfile(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'name' => 'required',
        'password' => 'nullable|min:6|confirmed',
    ]);

    $user = auth()->user();

    $user->name = $request->name;
    $user->email = $request->email;

    if ($request->filled('password')) {
        $user->password = bcrypt($request->password);
    }

    $user->city = $request->city;
    $user->specialty = $request->specialty;

    $user->save();

    return response()->json(['user' => $user]);
}


}
