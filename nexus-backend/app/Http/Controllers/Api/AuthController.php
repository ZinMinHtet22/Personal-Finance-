<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users|ends_with:@gmail.com',
            'password' => ['required', 'string', Password::min(8)->letters()->mixedCase()->numbers()->symbols()],
            'role' => 'sometimes|string|in:normal,business_owner',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'normal',
        ]);

        $otp = (string) rand(100000, 999999);
        $user->otp_code = $otp;
        $user->save();
        
        Log::info("OTP Code for {$user->email} is {$otp}");
        try {
            Mail::to($user->email)->send(new OtpMail($otp));
        } catch (\Throwable $e) {
            Log::warning("Could not send OTP email to {$user->email}: " . $e->getMessage());
        }

        $token = $user->createToken($this->getDeviceName($request))->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->account_status === 'suspended') {
            throw ValidationException::withMessages([
                'email' => ['Your account has been suspended. Please contact support.'],
            ]);
        }

        if (!$user->is_admin) {
            // Send new OTP
            $otp = (string) rand(100000, 999999);
            $user->otp_code = $otp;
            $user->save();
            Log::info("New OTP Code for {$user->email} is {$otp}");
            try {
                Mail::to($user->email)->send(new OtpMail($otp));
            } catch (\Throwable $e) {
                Log::warning("Could not send OTP email to {$user->email}: " . $e->getMessage());
            }

            return response()->json([
                'requires_verification' => true,
                'email' => $user->email,
                'message' => 'Please verify your login. A new 2FA OTP has been sent.'
            ], 403);
        }

        if ($user->is_admin) {
            \Illuminate\Support\Facades\Auth::login($user);
            $user->last_login_at = now();
            $user->save();
            return response()->json([
                'requires_biometric' => true,
                'email' => $user->email,
                'message' => 'Admin biometric verification required.'
            ], 403);
        }

        $user->last_login_at = now();
        $user->save();

        $token = $user->createToken($this->getDeviceName($request))->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->otp_code !== $request->otp) {
            return response()->json(['message' => 'Invalid OTP code.'], 400);
        }

        $user->email_verified_at = now();
        $user->last_login_at = now();
        $user->otp_code = null;
        $user->save();

        $token = $user->createToken($this->getDeviceName($request))->plainTextToken;

        return response()->json([
            'message' => 'Email verified successfully.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function resendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $otp = (string) rand(100000, 999999);
        $user->otp_code = $otp;
        $user->save();
        Log::info("Resent OTP Code for {$user->email} is {$otp}");
        try {
            Mail::to($user->email)->send(new OtpMail($otp));
        } catch (\Throwable $e) {
            Log::warning("Could not send OTP email to {$user->email}: " . $e->getMessage());
        }

        return response()->json(['message' => 'OTP resent.']);
    }

    private function getDeviceName(Request $request)
    {
        $userAgent = $request->userAgent() ?? 'Unknown Device';
        
        $os = 'Unknown OS';
        if (preg_match('/windows/i', $userAgent)) $os = 'Windows';
        elseif (preg_match('/mac/i', $userAgent)) $os = 'macOS';
        elseif (preg_match('/linux/i', $userAgent)) $os = 'Linux';
        elseif (preg_match('/iphone|ipad/i', $userAgent)) $os = 'iOS';
        elseif (preg_match('/android/i', $userAgent)) $os = 'Android';

        $browser = 'Unknown Browser';
        if (preg_match('/edg/i', $userAgent)) $browser = 'Edge';
        elseif (preg_match('/chrome/i', $userAgent)) $browser = 'Chrome';
        elseif (preg_match('/firefox/i', $userAgent)) $browser = 'Firefox';
        elseif (preg_match('/safari/i', $userAgent)) $browser = 'Safari';
        elseif (preg_match('/opera/i', $userAgent)) $browser = 'Opera';

        if ($os === 'Unknown OS' && $browser === 'Unknown Browser') {
            return substr($userAgent, 0, 40) ?: 'Unknown Device';
        }
        
        return "$os - $browser";
    }
}
