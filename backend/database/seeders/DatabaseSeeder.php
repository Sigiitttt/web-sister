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
        // Tambahkan user dummy hanya di local/development
        if (app()->environment('local')) {
            User::factory()->create([
                'username' => 'Test User',
                'email' => 'test@example.com',
                'telepon' => '081234567890',
                'role' => 'admin',
                'status' => 'aktif',
                'password' => bcrypt('admin123'), // jangan lupa password
            ]);


            // Jika perlu generate banyak user untuk testing
            // User::factory(10)->create();
        }

        // Jalankan seeder lain
        $this->call([
            QuotaSeeder::class,
            SopSeeder::class,
        ]);
    }
}
