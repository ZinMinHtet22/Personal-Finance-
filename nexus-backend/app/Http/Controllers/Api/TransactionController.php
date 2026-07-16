<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = $request->user()->transactions()->orderBy('created_at', 'desc')->get();
        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string',
            'is_subscription' => 'boolean',
            'renewal_date' => 'nullable|date',
            'type' => 'nullable|string|in:expense,income',
            'description' => 'nullable|string',
            'date' => 'nullable|date',
        ]);

        $transaction = new Transaction($validated);
        $transaction->user_id = $request->user()->id;
        
        if (!empty($validated['date'])) {
            $transaction->created_at = $validated['date'];
            $transaction->updated_at = $validated['date'];
        }

        $transaction->save();

        return response()->json($transaction, 201);
    }

    public function getSubscriptions(Request $request)
    {
        $subscriptions = $request->user()->transactions()
            ->where('is_subscription', true)
            ->orderBy('renewal_date', 'asc')
            ->get();
            
        return response()->json($subscriptions);
    }

    public function getDashboardSummary(Request $request)
    {
        $userId = $request->user()->id;
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $totalMonthly = Transaction::where('user_id', $userId)
            ->whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->sum('amount');

        $totalRecurring = Transaction::where('user_id', $userId)
            ->where('is_subscription', true)
            ->sum('amount');

        $categoryTotals = Transaction::where('user_id', $userId)
            ->select('category', DB::raw('SUM(amount) as total'))
            ->groupBy('category')
            ->get();
            
        // Budget Progress
        $budgets = $request->user()->budgets;
        $budgetProgress = $budgets->map(function ($budget) use ($categoryTotals) {
            $spent = $categoryTotals->firstWhere('category', $budget->category)->total ?? 0;
            return [
                'category' => $budget->category,
                'limit_amount' => $budget->limit_amount,
                'spent' => $spent,
            ];
        });
            
        $recentTransactions = Transaction::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $prompt = "Act as an AI Financial Coach. Given the following data: Total Monthly Expenses: {$totalMonthly}, Total Recurring Subscriptions: {$totalRecurring}, and Category Totals: " . json_encode($categoryTotals) . ". Provide a brief, insightful 2-sentence financial coaching summary.";

        $aiResponse = 'AI Coach summary unavailable.';
        
        $apiKey = env('OPENAI_API_KEY');
        if ($apiKey && $apiKey !== 'your_key_here') {
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                ])->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-3.5-turbo',
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a concise financial coach.'],
                        ['role' => 'user', 'content' => $prompt]
                    ],
                    'max_tokens' => 100,
                ]);

                if ($response->successful()) {
                    $aiResponse = $response->json('choices.0.message.content') ?? $aiResponse;
                }
            } catch (\Exception $e) {
                // Keep default message
            }
        }

        return response()->json([
            'total_monthly' => $totalMonthly,
            'total_recurring' => $totalRecurring,
            'categories' => $categoryTotals,
            'recent_transactions' => $recentTransactions,
            'budget_progress' => $budgetProgress,
            'ai_coach_summary' => $aiResponse,
        ]);
    }

    public function export(Request $request)
    {
        $transactions = $request->user()->transactions()->orderBy('created_at', 'desc')->get();

        return response()->streamDownload(function () use ($transactions) {
            $handle = fopen('php://output', 'w');
            
            // Add CSV headers
            fputcsv($handle, ['Date', 'Amount', 'Category', 'Is Subscription', 'Renewal Date']);

            foreach ($transactions as $t) {
                fputcsv($handle, [
                    $t->created_at->format('Y-m-d'),
                    $t->amount,
                    $t->category,
                    $t->is_subscription ? 'Yes' : 'No',
                    $t->renewal_date ? $t->renewal_date->format('Y-m-d') : ''
                ]);
            }
            fclose($handle);
        }, 'nexus_transactions.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    private function findKey($row, $searchKeys)
    {
        foreach ($searchKeys as $sk) {
            foreach (array_keys($row) as $k) {
                if (str_contains(strtolower($k), $sk)) return $k;
            }
        }
        return null;
    }

    private function sanitizeRow($row)
    {
        $amountKey = $this->findKey($row, ['amount', 'price', 'cost', 'value']);
        $dateKey = $this->findKey($row, ['date', 'created', 'transaction_date', 'timestamp']);
        $categoryKey = $this->findKey($row, ['category', 'type', 'group']);
        $subKey = $this->findKey($row, ['is subscription', 'subscription', 'recurring']);
        
        $amount = $amountKey ? preg_replace('/[^0-9.-]/', '', $row[$amountKey]) : 0;
        
        $dateStr = $dateKey ? trim($row[$dateKey]) : null;
        $date = now();
        if ($dateStr) {
            try {
                $date = Carbon::parse($dateStr);
            } catch (\Exception $e) {
                $date = now();
            }
        }
        
        $category = $categoryKey ? trim($row[$categoryKey]) : 'Uncategorized';
        if (empty($category)) $category = 'Uncategorized';
        
        $isSubStr = $subKey ? strtolower(trim($row[$subKey])) : 'no';
        $isSub = in_array($isSubStr, ['yes', 'true', '1', 'y']);

        return [
            'amount' => (float)$amount,
            'category' => $category,
            'date' => $date->format('Y-m-d'),
            'is_subscription' => $isSub,
            'renewal_date' => $isSub ? $date->copy()->addMonth()->format('Y-m-d') : null,
        ];
    }

    private function parseCsv($file)
    {
        $rows = [];
        if (($handle = fopen($file->getRealPath(), 'r')) !== false) {
            $header = fgetcsv($handle);
            if (!$header) return [];
            
            $header = array_map(function($h) { return trim(strtolower($h)); }, $header);
            
            while (($data = fgetcsv($handle)) !== false) {
                if (count($header) !== count($data)) {
                    continue; // Skip malformed rows
                }
                $row = array_combine($header, $data);
                $rows[] = $this->sanitizeRow($row);
            }
            fclose($handle);
        }
        return $rows;
    }

    public function preview(Request $request)
    {
        $request->validate(['csv_file' => 'required|file|mimes:csv,txt']);
        
        try {
            $rows = $this->parseCsv($request->file('csv_file'));
            return response()->json(array_slice($rows, 0, 3));
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error parsing CSV file: ' . $e->getMessage()], 422);
        }
    }

    public function import(Request $request)
    {
        $request->validate(['csv_file' => 'required|file|mimes:csv,txt']);
        
        try {
            $rows = $this->parseCsv($request->file('csv_file'));
            if (empty($rows)) {
                return response()->json(['message' => 'No valid data found in CSV.'], 422);
            }
            
            DB::beginTransaction();
            
            $user = $request->user();
            $count = 0;
            
            foreach ($rows as $row) {
                if ($row['amount'] == 0) continue; 
                
                $transaction = new Transaction([
                    'amount' => abs($row['amount']), // Ensure positive for our system
                    'category' => $row['category'],
                    'is_subscription' => $row['is_subscription'],
                    'renewal_date' => $row['renewal_date'],
                ]);
                $transaction->user_id = $user->id;
                $transaction->created_at = $row['date'];
                $transaction->updated_at = $row['date'];
                $transaction->save(); 
                
                $count++;
            }
            
            DB::commit();
            return response()->json(['message' => "Successfully imported {$count} transactions."]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to import CSV: ' . $e->getMessage()], 422);
        }
    }
}
