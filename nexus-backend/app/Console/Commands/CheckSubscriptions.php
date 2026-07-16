<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

#[Signature('app:check-subscriptions')]
#[Description('Command description')]
class CheckSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'nexus:check-subscriptions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $targetDate = Carbon::now()->addHours(72)->toDateString();

        $subscriptions = Transaction::with('user')
            ->where('is_subscription', true)
            ->whereDate('renewal_date', $targetDate)
            ->get();

        if ($subscriptions->isEmpty()) {
            $this->info('No subscriptions renewing in exactly 72 hours.');
            return;
        }

        foreach ($subscriptions as $subscription) {
            $msg = "ALERT: User {$subscription->user->email} has a subscription '{$subscription->category}' of amount {$subscription->amount} renewing on {$subscription->renewal_date}.";
            Log::info($msg);
            $this->info($msg);
        }
    }
}
