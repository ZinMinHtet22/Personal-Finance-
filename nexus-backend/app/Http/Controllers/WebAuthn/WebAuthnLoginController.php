<?php

namespace App\Http\Controllers\WebAuthn;

use Illuminate\Contracts\Support\Responsable;
use Illuminate\Http\Response;
use Laragear\WebAuthn\Http\Requests\AssertedRequest;
use Laragear\WebAuthn\Http\Requests\AssertionRequest;

use function response;

class WebAuthnLoginController
{
    /**
     * Returns the challenge to assertion.
     */
    public function options(AssertionRequest $request): Responsable
    {
        $validated = $request->validate(['email' => 'required|email|string']);
        
        $user = \App\Models\User::where('email', $validated['email'])->first();
        if (!$user || !$user->is_admin) {
            abort(403, 'Unauthorized: Only admins can use biometric login.');
        }

        return $request->toVerify($validated);
    }

    /**
     * Log the user in.
     */
    public function login(AssertedRequest $request)
    {
        if ($request->login()) {
            $user = auth()->user();
            $token = $user->createToken('WebAuthn')->plainTextToken;
            return response()->json([
                'user' => $user,
                'token' => $token,
            ]);
        }
        return response()->json(['message' => 'Biometric login failed'], 422);
    }
}
