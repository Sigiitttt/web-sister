<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quota extends Model
{
    protected $table = 'quotas';
    protected $fillable = ['tanggal', 'kuota_maksimal', 'kuota_terpakai'];
}



