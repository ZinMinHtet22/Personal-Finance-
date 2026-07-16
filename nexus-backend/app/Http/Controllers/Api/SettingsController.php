<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class SettingsController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'currency' => 'sometimes|string|max:3',
            'locale' => 'sometimes|string|max:5',
            'theme' => 'sometimes|string|in:light,dark,system',
            'notification_preferences' => 'sometimes|array',
            'current_password' => 'sometimes|required_with:new_password|string',
            'new_password' => 'sometimes|string|min:8',
        ]);

        if (isset($validated['name'])) $user->name = $validated['name'];
        if (isset($validated['currency'])) $user->currency = $validated['currency'];
        if (isset($validated['locale'])) $user->locale = $validated['locale'];
        if (isset($validated['theme'])) $user->theme = $validated['theme'];
        if (isset($validated['notification_preferences'])) $user->notification_preferences = $validated['notification_preferences'];
        
        if (isset($validated['new_password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                throw ValidationException::withMessages(['current_password' => 'Incorrect password.']);
            }
            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();
        return response()->json($user);
    }

    public function getSessions(Request $request)
    {
        $currentAccessToken = $request->user()->currentAccessToken();
        
        $tokens = $request->user()->tokens->map(function ($token) use ($currentAccessToken) {
            return [
                'id' => $token->id,
                'name' => $token->name,
                'last_used_at' => $token->last_used_at,
                'created_at' => $token->created_at,
                'is_current' => $currentAccessToken && $token->id === $currentAccessToken->id,
            ];
        });

        return response()->json($tokens);
    }

    public function revokeSession(Request $request, $id)
    {
        $token = $request->user()->tokens()->where('id', $id)->first();
        if ($token) {
            $token->delete();
        }
        return response()->json(['message' => 'Session revoked.']);
    }

    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages(['password' => 'Incorrect password.']);
        }

        $user->delete();

        return response()->json(['message' => 'Account deleted successfully.']);
    }
}
