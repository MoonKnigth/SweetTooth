<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ProductSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@sweettooth.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Normal User',
            'email' => 'user@sweettooth.com',
            'password' => bcrypt('password'),
            'role' => 'customer',
        ]);
    }
}
