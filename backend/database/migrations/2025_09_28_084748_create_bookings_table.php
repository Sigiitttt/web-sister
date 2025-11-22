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
    Schema::create('bookings', function (Blueprint $table) {
        $table->id();
        $table->string('kode_booking')->unique();
        $table->foreignId('ketua_id')->constrained('hikers');
        $table->date('tanggal_pendakian');
        $table->integer('jumlah_pendaki');
        $table->decimal('total_bayar', 10, 2);
        $table->enum('status_pembayaran', ['pending', 'verified', 'rejected'])->default('pending');
        $table->enum('status_pendakian', ['booked', 'check-in', 'check-out', 'batal'])->default('booked');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
