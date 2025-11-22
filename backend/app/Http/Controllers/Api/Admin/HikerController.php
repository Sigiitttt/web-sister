<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Hiker;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class HikerController extends Controller
{
    /**
     * Menampilkan daftar semua pendaki.
     */
    public function getHikers()
    {
        $hikers = Hiker::orderBy('nama_lengkap', 'asc')->paginate(20);

        return response()->json([
            'success' => true,
            'message' => 'Daftar pendaki berhasil diambil.',
            'data' => $hikers
        ]);
    }

    /**
     * Menampilkan riwayat semua pendakian yang telah selesai.
     */
    public function getHistory()
{
    // Memuat relasi 'ketua', 'members', dan 'payment'
    $history = Booking::with('ketua', 'members', 'payment') // <-- 'ketua' ditambahkan di sini
        ->where('status_pendakian', 'check-out')
        ->orderBy('tanggal_pendakian', 'desc')
        ->paginate(15);

    return response()->json([
        'success' => true,
        'message' => 'Riwayat pendakian berhasil diambil.',
        'data' => $history
    ]);
}

    /**
     * Mengubah status seorang pendaki (blacklist atau aktif).
     */
    public function blacklist(Request $request, $id)
    {
        // PERBAIKAN: Menggunakan Validator Facade untuk konsistensi
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:blacklist,aktif',
            'alasan_blacklist' => 'required_if:status,blacklist|nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $hiker = Hiker::find($id);

        if (!$hiker) {
            return response()->json(['message' => 'Data pendaki tidak ditemukan.'], 404);
        }

        $hiker->status = $request->status;
        $hiker->alasan_blacklist = $request->status === 'blacklist' ? $request->alasan_blacklist : null;
        $hiker->save();

        return response()->json([
            'success' => true,
            'message' => 'Status pendaki berhasil diperbarui.',
            'data' => $hiker
        ]);
    }
}

