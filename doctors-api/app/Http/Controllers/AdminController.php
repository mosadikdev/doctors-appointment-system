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

    public function getAllUsers()
    {
        $users = User::all();
        return response()->json($users);
    }
}
