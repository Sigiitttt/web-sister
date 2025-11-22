<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hiker extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'nama_lengkap',
        'no_identitas',
        'alamat',
        'tanggal_lahir',
        'jenis_kelamin',
        'status',
        'alasan_blacklist',
    ];

    /**
     * Mendefinisikan relasi ke model User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

