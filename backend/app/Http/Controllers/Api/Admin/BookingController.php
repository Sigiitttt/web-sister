<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Checkin;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * Menampilkan daftar booking yang relevan untuk operasional hari ini.
     * Mencakup booking yang siap untuk check-in atau yang sedang dalam proses pendakian (siap check-out).
     */
    public function getTodayBookings()
    {
        $today = Carbon::today()->toDateString();

        $bookings = Booking::with('ketua', 'members')
            ->where('tanggal_pendakian', $today)
            ->where('status_pembayaran', 'verified') // Memastikan hanya booking yang sudah lunas.
            ->whereIn('status_pendakian', ['booked', 'check-in']) // Mengambil yang siap check-in ATAU siap check-out.
            ->orderBy('status_pendakian', 'asc') // Mengurutkan agar 'booked' (siap check-in) tampil lebih dulu.
            ->get();

        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    /**
     * Memproses check-in untuk sebuah rombongan pendaki.
     */
    public function checkIn(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'booking_id' => 'required|exists:bookings,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            DB::beginTransaction();
            
            $booking = Booking::with('members')->findOrFail($request->input('booking_id'));

            // Keamanan: Pastikan hanya booking dengan status 'booked' yang bisa di-check-in.
            if ($booking->status_pendakian !== 'booked') {
                 return response()->json(['message' => 'Booking ini tidak dalam status siap untuk check-in.'], 409); // 409 Conflict
            }

            // 1. Ubah status pendakian utama di tabel 'bookings'.
            $booking->status_pendakian = 'check-in';
            $booking->save();

            // 2. Catat waktu check-in untuk semua anggota di tabel 'checkins'.
            foreach ($booking->members as $member) {
                Checkin::updateOrCreate(
                    [
                        'booking_id' => $booking->id,
                        'hiker_id' => $member->id,
                    ],
                    [
                        'waktu_checkin' => Carbon::now(),
                    ]
                );
            }

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Check-in berhasil dicatat.']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal melakukan check-in: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Memproses check-out untuk sebuah rombongan pendaki.
     */
    public function checkOut(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'booking_id' => 'required|exists:bookings,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        $booking = Booking::findOrFail($request->input('booking_id'));

        // Keamanan: Pastikan hanya booking dengan status 'check-in' yang bisa di-check-out.
        if ($booking->status_pendakian !== 'check-in') {
             return response()->json(['message' => 'Booking ini tidak dalam status siap untuk check-out.'], 409); // 409 Conflict
        }
        
        // 1. Ubah status pendakian utama di tabel 'bookings'.
        $booking->status_pendakian = 'check-out';
        $booking->save();

        // 2. Update waktu check-out untuk semua anggota di tabel 'checkins'.
        Checkin::where('booking_id', $booking->id)
            ->update(['waktu_checkout' => Carbon::now()]);

        return response()->json(['success' => true, 'message' => 'Check-out berhasil dicatat.']);
    }

    
}

