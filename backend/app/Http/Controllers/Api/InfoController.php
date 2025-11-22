<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sop;
use App\Models\Quota;
use App\Models\Booking;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class InfoController extends Controller
{
    /**
     * Mengambil data SOP dari database.
     */
    public function getSop()
    {
        $sops = Sop::all();
        return response()->json([
            'success' => true,
            'message' => 'SOP berhasil diambil.',
            'data' => $sops
        ]);
    }

    /**
     * Memberikan data cuaca statis (dummy).
     */
    public function getWeather()
    {
        $weatherData = [
            'lokasi' => 'Gunung Penanggungan',
            'suhu' => rand(18, 25),
            'kondisi' => ['Cerah', 'Berawan', 'Hujan Ringan'][array_rand(['Cerah', 'Berawan', 'Hujan Ringan'])],
            'timestamp' => Carbon::now()->toDateTimeString(),
        ];
        return response()->json([
            'success' => true,
            'message' => 'Data cuaca berhasil diambil.',
            'data' => $weatherData
        ]);
    }

    /**
     * Mengambil sisa kuota pendakian pada tanggal tertentu.
     */
    public function getQuotaByDate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tanggal' => 'required|date|after_or_equal:today',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $tanggal = $request->input('tanggal');

        $quota = Quota::firstOrCreate(
            ['tanggal' => $tanggal],
            ['kuota_maksimal' => 100] 
        );

        $kuotaTerpakai = Booking::where('tanggal_pendakian', $tanggal)
            ->where('status_pembayaran', 'verified')
            ->sum('jumlah_pendaki');

        $quota->kuota_terpakai = (int) $kuotaTerpakai;
        $quota->sisa_kuota = $quota->kuota_maksimal - $quota->kuota_terpakai;

        return response()->json([
            'success' => true,
            'message' => 'Sisa kuota berhasil diambil.',
            'data' => $quota
        ]);
    }
}
