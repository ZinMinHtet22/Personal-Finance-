<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\ChatController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions/export', [TransactionController::class, 'export']);
    Route::post('/transactions/import/preview', [TransactionController::class, 'preview']);
    Route::post('/transactions/import', [TransactionController::class, 'import']);
    
    Route::get('/dashboard/summary', [TransactionController::class, 'getDashboardSummary']);
    Route::get('/subscriptions', [TransactionController::class, 'getSubscriptions']);

    Route::get('/budgets', [BudgetController::class, 'index']);
    Route::post('/budgets', [BudgetController::class, 'store']);

    Route::put('/user/settings', [SettingsController::class, 'update']);
    Route::get('/user/sessions', [SettingsController::class, 'getSessions']);
    Route::delete('/user/sessions/{id}', [SettingsController::class, 'revokeSession']);
    Route::delete('/user/account', [SettingsController::class, 'deleteAccount']);
    Route::post('/chat', [ChatController::class, 'ask']);
});
