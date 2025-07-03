<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'Welcome Admin!']);
    }

    public function allUsers()
    {
        $users = User::all()->map(function ($user) {
            return $this->formatUserResponse($user);
        });
        
        return response()->json($users);
    }

    public function addUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,doctor,patient',
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|in:male,female,other,prefer_not_to_say',
            'specialty' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'phone' => $validated['phone'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'specialty' => $validated['specialty'] ?? null,
            'city' => $validated['city'] ?? null,
        ];

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('profile-photos', 'public');
            $userData['photo_url'] = $path;
        }

        $user = User::create($userData);

        return response()->json($this->formatUserResponse($user), 201);
    }

    public function getUser($id)
    {
        $user = User::findOrFail($id);
        return response()->json($this->formatUserResponse($user));
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|nullable|string|min:8',
            'role' => 'sometimes|in:admin,doctor,patient',
            'phone' => 'sometimes|nullable|string|max:20',
            'gender' => 'sometimes|nullable|in:male,female,other,prefer_not_to_say',
            'specialty' => 'sometimes|nullable|string|max:255',
            'city' => 'sometimes|nullable|string|max:255',
            'avatar' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $updateData = [
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'role' => $validated['role'] ?? $user->role,
            'phone' => $validated['phone'] ?? $user->phone,
            'gender' => $validated['gender'] ?? $user->gender,
            'specialty' => $validated['specialty'] ?? $user->specialty,
            'city' => $validated['city'] ?? $user->city,
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        if ($request->hasFile('avatar')) {
            // Delete old photo if exists
            if ($user->photo_url) {
                Storage::disk('public')->delete($user->photo_url);
            }
            
            $path = $request->file('avatar')->store('profile-photos', 'public');
            $updateData['photo_url'] = $path;
        } elseif ($request->has('remove_avatar') && $request->remove_avatar) {
            // Handle avatar removal
            if ($user->photo_url) {
                Storage::disk('public')->delete($user->photo_url);
            }
            $updateData['photo_url'] = null;
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $this->formatUserResponse($user->fresh())
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        // Delete user's photo if exists
        if ($user->photo_url) {
            Storage::disk('public')->delete($user->photo_url);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function getStats()
    {
        return response()->json([
            'total_users' => User::count(),
            'pending_reviews' => Review::where('status', 'pending')->count(),
            'admins' => User::where('role', 'admin')->count(),
            'doctors' => User::where('role', 'doctor')->count(),
            'patients' => User::where('role', 'patient')->count(),
        ]);
    }

    /**
     * Format user response with proper photo URL
     */
    protected function formatUserResponse($user)
{
    return [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role,
        'phone' => $user->phone,
        'gender' => $user->gender,
        'specialty' => $user->specialty,
        'city' => $user->city,
        'photo_url' => $user->photo_url,
        'created_at' => $user->created_at,
        'updated_at' => $user->updated_at,
    ];
}
}