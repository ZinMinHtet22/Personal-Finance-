<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::updateOrCreate(
            ['email' => 'ryuuprime25@gmail.com'],
            [
                'name' => 'Nexus Admin',
                'password' => \Illuminate\Support\Facades\Hash::make('nexus admin kenshin'),
                'is_admin' => true,
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}
