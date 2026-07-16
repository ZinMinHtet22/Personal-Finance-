<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Carbon\Carbon;

class CheckBudgetLimits implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $users = User::all();
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        foreach ($users as $user) {
            $prefs = $user->notification_preferences ?? [];
            if (!isset($prefs['budget_alerts']) || $prefs['budget_alerts'] !== true) {
                continue;
            }

            $budgets = $user->budgets;
            if ($budgets->isEmpty()) continue;

            $categoryTotals = $user->transactions()
                ->whereMonth('created_at', $currentMonth)
                ->whereYear('created_at', $currentYear)
                ->select('category', DB::raw('SUM(amount) as total'))
                ->groupBy('category')
                ->get();

            foreach ($budgets as $budget) {
                $spent = $categoryTotals->firstWhere('category', $budget->category)->total ?? 0;
                if ($budget->limit_amount > 0) {
                    $percent = ($spent / $budget->limit_amount) * 100;
                    if ($percent >= 90) {
                        Log::info("BUDGET ALERT: User {$user->email} has spent {$percent}% of their {$budget->category} budget!");
                        // Here we would normally dispatch a Mailable, e.g. Mail::to($user)->send(new BudgetAlertMail(...));
                    }
                }
            }
        }
    }
}
