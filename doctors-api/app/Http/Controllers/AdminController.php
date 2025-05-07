<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'Welcome Admin!']);
    }

    public function allUsers()
    {
        $users = User::all();
        return response()->json($users);
    }

    public function addUser(Request $request)
{
    $validated = $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users,email',
        'password' => 'required',
        'role' => 'required|in:admin,doctor,patient',
    ]);

    $validated['password'] = bcrypt($validated['password']);

    $user = User::create($validated);

    return response()->json($user, 201);
}


public function getUser($id)
{
    return User::findOrFail($id);
}

public function updateUser(Request $request, $id)
{
    $user = User::findOrFail($id);

    $validated = $request->validate([
        'name' => 'required',
        'email' => 'required|email|unique:users,email,' . $id,
        'role' => 'required|in:admin,doctor,patient',
    ]);

    $user->update($validated);

    return response()->json(['message' => 'Modified successfully']);
}



    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
