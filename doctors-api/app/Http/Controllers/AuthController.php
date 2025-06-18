<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed',
            'role' => 'in:admin,doctor,patient',
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|in:male,female,other,prefer_not_to_say',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $userData = [
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => bcrypt($fields['password']),
            'role' => $fields['role'] ?? 'patient',
            'phone' => $fields['phone'] ?? null,
            'gender' => $fields['gender'] ?? null,
        ];

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('profile-photos', 'public');
            $userData['photo_url'] = $path;
        }

        $user = User::create($userData);

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
    $user = auth()->user();

    $validated = $request->validate([
        'name' => 'required|string',
        'email' => 'required|email|unique:users,email,'.$user->id,
        'phone' => 'nullable|string|max:20',
        'gender' => 'nullable|in:male,female,other,prefer_not_to_say',
        'city' => 'nullable|string',
        'specialty' => 'nullable|string',
        'password' => 'nullable|min:6|confirmed',
        'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $updateData = [
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'] ?? $user->phone,
        'gender' => $validated['gender'] ?? $user->gender,
        'city' => $validated['city'] ?? $user->city,
        'specialty' => $validated['specialty'] ?? $user->specialty,
    ];

    if ($request->filled('password')) {
        $updateData['password'] = bcrypt($validated['password']);
    }

    if ($request->hasFile('avatar')) {
        if ($user->photo_url) {
            if (strpos($user->photo_url, 'profile-photos') !== false) {
                Storage::disk('public')->delete($user->photo_url);
            }
        }
        
        $path = $request->file('avatar')->store('profile-photos', 'public');
        $updateData['photo_url'] = url('storage/' . $path); 
    }

    $user->update($updateData);

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => $user->fresh()
    ]);
}
}