<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Checkin extends Model
{
    use HasFactory;

    protected $fillable = ['booking_id', 'hiker_id', 'waktu_checkin', 'waktu_checkout', 'catatan'];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function hiker()
    {
        return $this->belongsTo(Hiker::class);
    }
}
