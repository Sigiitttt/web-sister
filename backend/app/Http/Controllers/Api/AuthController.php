<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Tambahkan ini
use Illuminate\Support\Facades\Validator; // <-- ini yang kurang
use App\Models\User;

class AuthController extends Controller
{
    // ... (method register() yang sudah ada)

    /**
     * Login untuk admin.
     */
    public function loginAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Email atau password salah.'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        // Pastikan hanya user dengan role 'admin' yang bisa login di sini
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Akses ditolak. Akun bukan admin.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login admin berhasil.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }
}
