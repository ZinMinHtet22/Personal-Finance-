<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['user_id', 'amount', 'category', 'is_subscription', 'renewal_date', 'type', 'description'])]
class Transaction extends Model
{
    protected function casts(): array
    {
        return [
            'is_subscription' => 'boolean',
            'renewal_date' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
