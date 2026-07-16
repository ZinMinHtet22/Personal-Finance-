<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Alter columns to text to support large encrypted payloads
        Schema::table('transactions', function (Blueprint $table) {
            $table->text('amount')->change();
            $table->text('description')->nullable()->change();
        });

        // Encrypt existing data
        $transactions = \Illuminate\Support\Facades\DB::table('transactions')->get();
        foreach ($transactions as $transaction) {
            \Illuminate\Support\Facades\DB::table('transactions')
                ->where('id', $transaction->id)
                ->update([
                    'amount' => \Illuminate\Support\Facades\Crypt::encryptString((string) $transaction->amount),
                    'description' => $transaction->description ? \Illuminate\Support\Facades\Crypt::encryptString($transaction->description) : null,
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Decrypt existing data before changing column type back
        $transactions = \Illuminate\Support\Facades\DB::table('transactions')->get();
        foreach ($transactions as $transaction) {
            try {
                $decryptedAmount = \Illuminate\Support\Facades\Crypt::decryptString($transaction->amount);
                $decryptedDescription = $transaction->description ? \Illuminate\Support\Facades\Crypt::decryptString($transaction->description) : null;
                
                \Illuminate\Support\Facades\DB::table('transactions')
                    ->where('id', $transaction->id)
                    ->update([
                        'amount' => $decryptedAmount,
                        'description' => $decryptedDescription,
                    ]);
            } catch (\Exception $e) {
                // If decryption fails, it might not be encrypted
            }
        }

        Schema::table('transactions', function (Blueprint $table) {
            $table->decimal('amount', 10, 2)->change();
            $table->string('description')->nullable()->change(); // Actually it was already text but let's just make it text
        });
    }
};
