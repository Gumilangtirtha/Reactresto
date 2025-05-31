<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            // Validate request
            $this->validate($request, [
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6',
                'level' => 'required'
            ]);

            // Create user with hashed password
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password), // Hash password
                'level' => $request->level,
                'status' => 1 // Active by default
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function login(Request $request)
    {
        try {
            // Validate request
            $this->validate($request, [
                'email' => 'required|email',
                'password' => 'required'
            ]);

            // Find user
            $user = User::where('email', $request->email)->first();

            // Check if user exists and verify password
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Check if user is active
            if ($user->status !== 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Account is inactive'
                ], 403);
            }

            // Generate token
            $token = bin2hex(random_bytes(32));
            $user->api_token = $token;
            $user->save();

            return response()->json([
                'success' => true,
                'token' => $token,
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
