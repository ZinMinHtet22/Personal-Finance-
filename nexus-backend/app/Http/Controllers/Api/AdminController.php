<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    public function index()
    {
        // Strictly return only allowed metadata and aggregated stats.
        $users = User::withCount('transactions')
            ->get([
                'id', 
                'name', 
                'email', 
                'role',
                'created_at', 
                'last_login_at', 
                'account_status', 
                'ai_interactions_count'
            ]);

        return response()->json($users);
    }

    public function toggleStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        // Prevent admin from suspending themselves
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot modify own account status.'], 403);
        }

        $user->account_status = $user->account_status === 'active' ? 'suspended' : 'active';
        $user->save();

        return response()->json([
            'message' => "Account status updated to {$user->account_status}.",
            'user' => $user->only(['id', 'account_status'])
        ]);
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string'
        ]);

        $user = User::findOrFail($id);

        $user->role = $request->role;
        $user->save();

        return response()->json([
            'message' => "Role updated to {$user->role}.",
            'user' => $user->only(['id', 'role'])
        ]);
    }
}
