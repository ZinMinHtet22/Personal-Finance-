<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$apiKey = env('GEMINI_API_KEY');
try {
    $res = Illuminate\Support\Facades\Http::post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key='.$apiKey, [
        'contents' => [
            [
                'parts' => [
                    ['text' => 'Hello']
                ]
            ]
        ]
    ]);
    echo "Status: " . $res->status() . "\n";
    echo $res->body() . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
