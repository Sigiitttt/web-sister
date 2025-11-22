<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';
    protected $fillable = [
        'booking_id', 'metode', 'jumlah',
        'bukti_bayar', 'status', 'verified_by'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id', 'id');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by', 'id');
    }
    
}
