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
        // Perintah untuk menghapus kolom 'tanggal_checkout'
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('tanggal_checkout');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Perintah untuk mengembalikan kolom jika migrasi di-rollback
        Schema::table('bookings', function (Blueprint $table) {
            $table->date('tanggal_checkout')->nullable()->after('tanggal_pendakian');
        });
    }
};
