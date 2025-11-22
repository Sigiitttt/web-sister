<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_booking',
        'ketua_id',
        'tanggal_pendakian',
        'jumlah_pendaki',
        'total_bayar',
        'status_pembayaran',
        'status_pendakian',
        'jenis_kendaraan',
        'jenis_pendakian',
        'tanggal_checkin',
        'tanggal_checkout',
    ];

    /**
     * Relasi ke Hiker sebagai KETUA.
     */
    public function ketua()
    {
        return $this->belongsTo(Hiker::class, 'ketua_id');
    }

    /**
     * Relasi ke Hiker sebagai ANGGOTA.
     */
    public function members()
    {
        return $this->belongsToMany(Hiker::class, 'booking_members');
    }



    /**
     * Mendefinisikan relasi one-to-one ke model Payment.
     */
     public function payment()
    {
        return $this->hasOne(Payment::class, 'booking_id');
    }


    /**
     * Mendefinisikan relasi one-to-many ke model Checkin.
     */
    public function checkins()
    {
        return $this->hasMany(Checkin::class);
    }
}

