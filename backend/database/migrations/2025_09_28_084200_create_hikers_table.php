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
    Schema::create('hikers', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->nullable()->constrained('users');
        $table->string('nama_lengkap');
        $table->string('no_identitas')->unique();
        $table->text('alamat');
        $table->date('tanggal_lahir');
        $table->enum('jenis_kelamin', ['pria', 'wanita']);
        $table->enum('status', ['aktif', 'blacklist'])->default('aktif');
        $table->text('alasan_blacklist')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hikers');
    }
};
