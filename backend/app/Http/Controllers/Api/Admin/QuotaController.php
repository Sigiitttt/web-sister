<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class QuotaController extends Controller
{
    /**
     * Menampilkan daftar kuota, dimulai dari hari ini.
     */
    public function index(Request $request)
    {
        $quotas = Quota::where('tanggal', '>=', Carbon::today()->toDateString())
            ->orderBy('tanggal', 'asc')
            ->paginate(30); // Ambil 30 hari ke depan

        return response()->json($quotas);
    }

    /**
     * Membuat atau memperbarui kuota untuk tanggal tertentu.
     */
    public function storeOrUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tanggal' => 'required|date|after_or_equal:today',
            'kuota_maksimal' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $quota = Quota::updateOrCreate(
            ['tanggal' => $request->tanggal],
            ['kuota_maksimal' => $request->kuota_maksimal]
        );

        return response()->json([
            'success' => true,
            'message' => 'Kuota berhasil disimpan.',
            'data' => $quota
        ], 200);
    }
}
