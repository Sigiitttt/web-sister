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
        Schema::table('bookings', function (Blueprint $table) {
            // Menambahkan kolom setelah 'total_bayar'
            $table->string('jenis_kendaraan')->nullable()->after('total_bayar');
            $table->enum('jenis_pendakian', ['tektok', 'menginap'])->default('menginap')->after('jenis_kendaraan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('jenis_kendaraan');
            $table->dropColumn('jenis_pendakian');
        });
    }
};

