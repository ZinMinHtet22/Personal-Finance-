<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Transaction;

class ChatController extends Controller
{
    public function ask(Request $request)
    {
        $request->validate(['message' => 'required|string']);
        
        $userId = $request->user()->id;
        $recentTransactions = Transaction::where('user_id', $userId)->orderBy('created_at', 'desc')->take(20)->get();
        
        $context = "Context - User's last 20 transactions: " . json_encode($recentTransactions) . ".\n";
        $prompt = $context . "User query: " . $request->message;

        $apiKey = env('OPENAI_API_KEY');
        if (!$apiKey || $apiKey === 'your_key_here') {
            return response()->json(['reply' => 'OpenAI API key is missing. Please configure it in the backend .env file.']);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a helpful, concise financial coach. Use the provided transaction context to answer the user.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'max_tokens' => 150,
            ]);

            if ($response->successful()) {
                return response()->json(['reply' => $response->json('choices.0.message.content')]);
            }
            
            return response()->json(['reply' => 'Error communicating with AI service.'], 500);
        } catch (\Exception $e) {
            return response()->json(['reply' => 'Exception occurred: ' . $e->getMessage()], 500);
        }
    }
}
