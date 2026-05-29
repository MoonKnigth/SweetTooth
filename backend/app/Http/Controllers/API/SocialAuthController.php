<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::where('email', $googleUser->email)
                        ->orWhere('provider_id', $googleUser->id)
                        ->first();

            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'password' => Hash::make(Str::random(24)),
                    'role' => 'customer',
                    'provider' => 'google',
                    'provider_id' => $googleUser->id,
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return redirect()->away('http://localhost:3000/auth/callback?token=' . $token);

        } catch (\Exception $e) {
            \Log::error('Google OAuth failed: ' . $e->getMessage());
            return redirect()->away('http://localhost:3000/login?error=oauth_failed');
        }
    }
}
