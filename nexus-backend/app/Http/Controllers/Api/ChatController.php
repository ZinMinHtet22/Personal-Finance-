<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\ChatbotRequest;
use Illuminate\Support\Facades\Http;
use App\Models\Transaction;

class ChatController extends Controller
{
    public function ask(ChatbotRequest $request)
    {
        // Validation is handled by ChatbotRequest
        
        $userId = $request->user()->id;
        $recentTransactions = Transaction::where('user_id', $userId)->orderBy('created_at', 'desc')->take(20)->get();
        
        $context = "Context - User's last 20 transactions: " . json_encode($recentTransactions) . ".\n";
        $prompt = $context . "User query: " . $request->message;

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey || $apiKey === 'your_key_here') {
            return response()->json(['reply' => 'Gemini API key is missing. Please configure it in the backend .env file.']);
        }

        try {
            $geminiPrompt = "System: You are a helpful, concise financial coach. Use the provided transaction context to answer the user. Do NOT use markdown formatting like asterisks (*), bold (**), or bullet points. Output plain text only.\n" . $prompt;

            $response = Http::withoutVerifying()->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $geminiPrompt]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $text = $response->json('candidates.0.content.parts.0.text');
                
                $user = $request->user();
                $user->increment('ai_interactions_count');
                
                return response()->json(['reply' => $text ?: 'Received empty response from AI.']);
            }
            
            $apiError = $response->json('error.message') ?? 'Error communicating with AI service.';
            return response()->json(['reply' => 'Gemini API Error: ' . $apiError], 500);
        } catch (\Exception $e) {
            return response()->json(['reply' => 'Exception occurred: ' . $e->getMessage()], 500);
        }
    }
}
