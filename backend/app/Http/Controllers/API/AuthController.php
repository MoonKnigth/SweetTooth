<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use PHPOpenSourceSaver\JWTAuth\JWTGuard;

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

        /** @var JWTGuard $guard */
        $guard = auth('api');
        $token = $guard->login($user);

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

        /** @var JWTGuard $guard */
        $guard = auth('api');

        if (! $token = $guard->attempt($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials',
            ], 401);
        }

        /** @var User $user */
        $user = $guard->user();
        $refreshToken = Str::random(60);
        $user->update(['refresh_token' => hash('sha256', $refreshToken)]);

        return $this->respondWithToken($token, $refreshToken, $user, 'Login successful');
    }

    public function refreshToken(Request $request): JsonResponse
    {
        $request->validate([
            'refresh_token' => 'required|string',
        ]);

        /** @var User $user */
        $user = User::where('refresh_token', hash('sha256', $request->refresh_token))->first();

        if (! $user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid refresh token',
            ], 401);
        }

        /** @var JWTGuard $guard */
        $guard = auth('api');
        $token = $guard->login($user);

        $newRefreshToken = Str::random(60);
        $user->update(['refresh_token' => hash('sha256', $newRefreshToken)]);

        return $this->respondWithToken($token, $newRefreshToken, $user, 'Token refreshed successfully');
    }

    public function logout(): JsonResponse
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');
        /** @var User|null $user */
        $user = $guard->user();

        if ($user) {
            $user->update(['refresh_token' => null]);
        }

        $guard->logout();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully',
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');

        return response()->json([
            'status' => 'success',
            'data' => $guard->user(),
        ]);
    }

    protected function respondWithToken(string $token, string $refreshToken, User $user, string $message = '', int $statusCode = 200): JsonResponse
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');

        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => [
                'user' => $user,
                'access_token' => $token,
                'refresh_token' => $refreshToken,
                'token_type' => 'Bearer',
                'expires_in' => $guard->factory()->getTTL() * 60,
            ],
        ], $statusCode);
    }
}
