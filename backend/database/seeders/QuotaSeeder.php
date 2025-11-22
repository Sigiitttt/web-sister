<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Quota;

class QuotaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('quotas')->delete();

        $startDate = Carbon::now();
        for ($i = 0; $i < 30; $i++) {
            Quota::create([
                'tanggal' => $startDate->copy()->addDays($i)->toDateString(),
                'kuota_maksimal' => 100, // Set kuota 100 untuk 30 hari ke depan
            ]);
        }
    }
}
