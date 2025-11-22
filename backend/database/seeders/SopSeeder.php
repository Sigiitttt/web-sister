<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sop;

class SopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Sop::create([
            'content' => "1. Wajib melakukan pendaftaran online.\n" .
                "2. Membawa perlengkapan standar pendakian.\n" .
                "3. Dilarang membuang sampah sembarangan.\n" .
                "4. Menjaga kelestarian alam dan tidak merusak fasilitas.\n" .
                "5. Melaporkan kepada petugas saat naik dan turun."
        ]);
    }
}
