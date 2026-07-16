<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$apiKey = env('GEMINI_API_KEY');
$prompt = "Context - User's last 20 transactions: [].\nUser query: Hello";
$geminiPrompt = "System: You are a helpful, concise financial coach. Use the provided transaction context to answer the user.\n" . $prompt;

try {
    $response = Illuminate\Support\Facades\Http::withoutVerifying()->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key={$apiKey}", [
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
        echo "Reply: " . ($text ?: 'Empty response');
    } else {
        echo "Error: HTTP " . $response->status() . " " . $response->body();
    }
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage();
}
