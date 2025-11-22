<?php

use App\Http\Controllers\Api\AuthController; 
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\InfoController;
use App\Http\Controllers\Api\Admin\PaymentController;
use App\Http\Controllers\Api\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Api\Admin\HikerController;
use App\Http\Controllers\Api\Admin\QuotaController; 


// ==================================================
// API Group untuk Informasi Publik
// ==================================================
Route::prefix('info')->group(function () {
    Route::get('sop', [InfoController::class, 'getSop']);
    Route::get('weather', [InfoController::class, 'getWeather']);
});

// Rute untuk Kuota (di luar grup info)
Route::get('quotas', [InfoController::class, 'getQuotaByDate']);


// ==================================================
// API Group untuk Booking
// ==================================================
Route::post('admin/login', [AuthController::class, 'loginAdmin']);
Route::post('bookings', [BookingController::class, 'store']);
Route::get('bookings/{kode_booking}', [BookingController::class, 'show']);
Route::post('bookings/{kode_booking}/payment', [BookingController::class, 'uploadPayment']);

// GRUP ROUTE UNTUK ADMIN (TERLINDUNGI OTENTIKASI)
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Rute untuk Manajemen Pembayaran (Mahasiswa 3)
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::patch('/payments/{id}/verify', [PaymentController::class, 'verify']);

    // Rute untuk Manajemen Booking & Check-in/out (Mahasiswa 4)
    Route::get('/bookings/today', [AdminBookingController::class, 'getTodayBookings']);
    Route::post('/checkin', [AdminBookingController::class, 'checkIn']);
    Route::patch('/checkout', [AdminBookingController::class, 'checkOut']);

    // Rute untuk Manajemen History & Pendaki (Mahasiswa 5)
    Route::get('/history', [HikerController::class, 'getHistory']);
    Route::get('/hikers', [HikerController::class, 'getHikers']);
    Route::patch('/hikers/{id}/blacklist', [HikerController::class, 'blacklist']);

    // Rute Manajemen Kuota (BARU)
    Route::get('/quotas', [QuotaController::class, 'index']);
    Route::post('/quotas', [QuotaController::class, 'storeOrUpdate']);

});