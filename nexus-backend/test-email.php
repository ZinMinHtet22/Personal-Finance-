<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Crypt;
use App\Mail\TransactionReceipt;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

echo "Starting Email Dispatch Test...\n";
echo "Mail Driver in Use: " . config('mail.default') . "\n\n";

$mockUserName = "Test User";
$mockAmount = "249.99";
$mockEmail = "test@example.com";

// Encrypt the amount exactly as the controller would
$encryptedAmount = Crypt::encryptString($mockAmount);

echo "Mocking transaction for: $mockUserName\n";
echo "Mock Amount: $$mockAmount\n";
echo "Sending receipt to: $mockEmail\n\n";

try {
    Mail::to($mockEmail)->send(new TransactionReceipt($mockUserName, $encryptedAmount));
    echo "✅ Success! The TransactionReceipt email was successfully dispatched.\n";
    
    if (config('mail.default') === 'log') {
        echo "\n(Since your mail driver is currently set to 'log' or it fell back, check 'storage/logs/laravel.log' to view the rendered email!)\n";
    }
} catch (TransportExceptionInterface $e) {
    echo "HTTP Transport Exception Caught!\n";
    echo "This usually means your Resend API Key is invalid or missing, or the API is unreachable.\n";
    echo "Error Message: " . $e->getMessage() . "\n";
} catch (\Exception $e) {
    echo "Unexpected Error Caught!\n";
    echo "Error Message: " . $e->getMessage() . "\n";
}
