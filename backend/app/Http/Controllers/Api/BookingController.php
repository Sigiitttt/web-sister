<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Hiker;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tanggal_pendakian' => 'required|date|after_or_equal:today',
            'jenis_kendaraan' => 'required|string|max:50', // <-- TAMBAHKAN VALIDASI INI
            'jenis_pendakian' => 'required|in:tektok,menginap', // <-- TAMBAHKAN VALIDASI INI
            'ketua.nama_lengkap' => 'required|string|max:255',
            'ketua.no_identitas' => 'required|string|digits:16',
            'ketua.alamat' => 'required|string',
            'ketua.tanggal_lahir' => 'required|date',
            'ketua.jenis_kelamin' => 'required|in:L,P',
            'ketua.telepon' => 'required|string|max:15',
            'ketua.email' => 'required|email',
            'members' => 'nullable|array',
            'members.*.nama_lengkap' => 'required_with:members|string|max:255',
            'members.*.no_identitas' => 'required_with:members|string|digits:16',
            'members.*.alamat' => 'required_with:members|string',
            'members.*.tanggal_lahir' => 'required_with:members|date',
            'members.*.jenis_kelamin' => 'required_with:members|in:L,P',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            // Fungsi internal untuk membuat atau mencari data pendaki dengan aman
            $findOrCreateHiker = function ($data, $isKetua = false) {
                $hiker = Hiker::where('no_identitas', $data['no_identitas'])->first();
                if ($hiker) {
                    return $hiker;
                }

                $email = $isKetua ? $data['email'] : ($data['no_identitas'] . '@example.com');
                $user = User::firstOrCreate(
                    ['email' => $email],
                    [
                        'username' => str_replace(' ', '_', strtolower($data['nama_lengkap'])) . '_' . uniqid(),
                        'password' => bcrypt('password'),
                        'telepon' => $isKetua ? $data['telepon'] : null,
                        'role' => 'pendaki',
                    ]
                );

                $newHiker = new Hiker();
                $newHiker->user_id = $user->id;
                $newHiker->nama_lengkap = $data['nama_lengkap'];
                $newHiker->no_identitas = $data['no_identitas'];
                $newHiker->alamat = $data['alamat'];
                $newHiker->tanggal_lahir = $data['tanggal_lahir'];
                $newHiker->jenis_kelamin = $data['jenis_kelamin'];
                $newHiker->status = 'aktif';
                $newHiker->save();

                return $newHiker;
            };

            // 1. Proses Ketua
            $ketuaHiker = $findOrCreateHiker($request->ketua, true);
            $allHikersId = [$ketuaHiker->id];
            $jumlahPendaki = 1;

            // 2. Proses Anggota
            if ($request->has('members') && is_array($request->members)) {
                foreach ($request->members as $memberData) {
                    $memberHiker = $findOrCreateHiker($memberData, false);
                    $allHikersId[] = $memberHiker->id;
                    $jumlahPendaki++;
                }
            }

            // 3. Buat Booking
            $totalBayar = $jumlahPendaki * 25000;
            $kodeBooking = 'BOOK-' . Carbon::now()->format('Ymd') . '-' . strtoupper(substr(md5(rand()), 0, 4));

            $booking = Booking::create([
                'kode_booking' => $kodeBooking,
                'ketua_id' => $ketuaHiker->id,
                'tanggal_pendakian' => $request->tanggal_pendakian,
                'jumlah_pendaki' => $jumlahPendaki,
                'total_bayar' => $totalBayar,
                'jenis_kendaraan' => $request->jenis_kendaraan, // <-- TAMBAHKAN LOGIKA PENYIMPANAN INI
                'jenis_pendakian' => $request->jenis_pendakian, // <-- TAMBAHKAN LOGIKA PENYIMPANAN INI
            ]);

            $booking->members()->sync($allHikersId);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Booking berhasil dibuat!',
                'data' => ['kode_booking' => $kodeBooking, 'total_bayar' => $totalBayar]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Kesalahan Server: ' . $e->getMessage()], 500);
        }
    }
    
    public function show($kode_booking)
    {
        $booking = Booking::with('ketua', 'members', 'payment','checkins')
            ->where('kode_booking', $kode_booking)
            ->first();

        if (!$booking) {
            return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        }

        return response()->json(['data' => $booking]);
    }

    public function uploadPayment(Request $request, $kode_booking)
    {
        $validator = Validator::make($request->all(), [
            'bukti_bayar' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $booking = Booking::where('kode_booking', $kode_booking)->first();
        if (!$booking) {
            return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        }

        $filePath = $request->file('bukti_bayar')->store('bukti_pembayaran', 'public');

        \App\Models\Payment::updateOrCreate(
            ['booking_id' => $booking->id],
            [
                'jumlah' => $booking->total_bayar,
                'bukti_bayar' => $filePath,
                'status' => 'pending'
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Bukti pembayaran berhasil diunggah.'
        ]);
        
    } 
}

