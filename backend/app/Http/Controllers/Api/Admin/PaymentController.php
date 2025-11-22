<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    /**
     * Menampilkan daftar pembayaran yang menunggu verifikasi.
     */
    public function index()
    {
        // PERBAIKAN: Menambahkan with('booking') untuk Eager Loading
        // Ini akan mengambil data booking terkait untuk setiap pembayaran.
        $payments = Payment::with('booking')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    /**
     * Memverifikasi pembayaran.
     */
    public function verify($id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Data pembayaran tidak ditemukan.'], 404);
        }

        $payment->status = 'verified';
        $payment->verified_by = Auth::id(); // Mencatat ID admin yang memverifikasi
        $payment->save();

        // Update status booking terkait
        $payment->booking->status_pembayaran = 'verified';
        $payment->booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Pembayaran berhasil diverifikasi.'
        ]);
    }
}
