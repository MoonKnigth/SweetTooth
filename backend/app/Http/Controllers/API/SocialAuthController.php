<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\GoogleProvider;
use PHPOpenSourceSaver\JWTAuth\JWTGuard;

class SocialAuthController extends Controller
{
    public function redirect()
    {
        /** @var GoogleProvider $driver */
        $driver = Socialite::driver('google');

        return $driver->stateless()->redirect();
    }

    public function callback()
    {
        try {
            /** @var GoogleProvider $driver */
            $driver = Socialite::driver('google');
            /** @var \Laravel\Socialite\Two\User $googleUser */
            $googleUser = $driver->stateless()->user();

            $user = User::where('email', $googleUser->email)
                ->orWhere('provider_id', $googleUser->id)
                ->first();

            /** @var User $user */
            if (! $user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'password' => Hash::make(Str::random(24)),
                    'role' => 'customer',
                    'provider' => 'google',
                    'provider_id' => $googleUser->id,
                ]);
            }

            /** @var JWTGuard $guard */
            $guard = auth('api');
            $token = $guard->login($user);

            $refreshToken = Str::random(60);
            $user->update(['refresh_token' => hash('sha256', $refreshToken)]);

            return redirect()->away('http://localhost:3001/auth/callback?token='.$token.'&refreshToken='.$refreshToken);
        } catch (\Exception $e) {
            Log::error('Google OAuth failed: '.$e->getMessage());

            return redirect()->away('http://localhost:3001/login?error=oauth_failed');
        }
    }
}
