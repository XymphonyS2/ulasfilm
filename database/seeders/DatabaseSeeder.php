<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            GenreSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@ulas.film',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Reviewer User',
            'email' => 'reviewer@ulas.film',
            'role' => 'reviewer',
        ]);
    }
}
