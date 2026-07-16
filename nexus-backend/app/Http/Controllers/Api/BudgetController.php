<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Budget;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->budgets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'limit_amount' => 'required|numeric|min:0.01',
        ]);

        $budget = Budget::updateOrCreate(
            ['user_id' => $request->user()->id, 'category' => $validated['category']],
            ['limit_amount' => $validated['limit_amount']]
        );

        return response()->json($budget);
    }
}
