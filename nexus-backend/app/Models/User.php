<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laragear\WebAuthn\WebAuthnAuthentication;
use Laragear\WebAuthn\Contracts\WebAuthnAuthenticatable;

#[Fillable(['name', 'email', 'role', 'password', 'currency', 'locale', 'theme', 'notification_preferences', 'is_admin', 'account_status', 'ai_interactions_count', 'last_login_at', 'otp_code'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements WebAuthnAuthenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, WebAuthnAuthentication;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'notification_preferences' => 'array',
            'is_admin' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function budgets()
    {
        return $this->hasMany(Budget::class);
    }
}
