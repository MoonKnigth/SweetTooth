<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'customer',
        ]);

        $token = auth('api')->login($user);
        $refreshToken = Str::random(60);
        $user->update(['refresh_token' => hash('sha256', $refreshToken)]);

        return $this->respondWithToken($token, $refreshToken, $user, 'User created successfully', 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = auth('api')->user();
        $refreshToken = Str::random(60);
        $user->update(['refresh_token' => hash('sha256', $refreshToken)]);

        return $this->respondWithToken($token, $refreshToken, $user, 'Login successful');
    }

    public function refreshToken(Request $request): JsonResponse
    {
        $request->validate([
            'refresh_token' => 'required|string',
        ]);

        $user = User::where('refresh_token', hash('sha256', $request->refresh_token))->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid refresh token',
            ], 401);
        }

        $token = auth('api')->login($user);
        $newRefreshToken = Str::random(60);
        $user->update(['refresh_token' => hash('sha256', $newRefreshToken)]);

        return $this->respondWithToken($token, $newRefreshToken, $user, 'Token refreshed successfully');
    }

    public function logout(): JsonResponse
    {
        $user = auth('api')->user();
        if ($user) {
            $user->update(['refresh_token' => null]);
        }
        auth('api')->logout();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => auth('api')->user()
        ]);
    }

    protected function respondWithToken($token, $refreshToken, $user, $message = '', $statusCode = 200): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => [
                'user' => $user,
                'access_token' => $token,
                'refresh_token' => $refreshToken,
                'token_type' => 'Bearer',
                'expires_in' => auth('api')->factory()->getTTL() * 60
            ]
        ], $statusCode);
    }
}
