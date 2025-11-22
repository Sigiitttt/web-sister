// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Layout akan diimpor setelah file-nya dibuat di src/layouts/Layout.jsx
// import Layout from './layouts/Layout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute';


// --- Halaman-halaman Aplikasi ---
// CATATAN: File-file ini perlu Anda buat di dalam folder `src/pages/`
// Untuk sementara, kita akan gunakan div placeholder.

// Halaman untuk Pendaki / Publik
// HomePage akan diimpor setelah file-nya dibuat di src/pages/HomePage.jsx
import HomePage from '../pages/HomePage.js';
import CekKuotaPage from '../pages/CekKuotaPage.js';
import BookingPage from '../pages/BookingPage.js';
import CekStatusPage from './pages/CekStatusPage.js';
import SopPage from './pages/SopPage.js';
import RegisterPage from './pages/RegisterPage.js';

// Halaman untuk Admin
import AdminLoginPage from '../pages/admin/AdminLoginPage.js';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.js';
import VerifikasiPembayaranPage from './pages/admin/VerifikasiPembayaranPage.js';
import CheckinPage from './pages/admin/CheckinPage.js';
import CheckoutPage from './pages/admin/CheckoutPage.js';
import HistoryPage from './pages/admin/HistoryPage.js';
import ManajemenPendakiPage from './pages/admin/ManajemenPendakiPage.js';


function App() {
    return (
        <Router>
            {/* Layout akan membungkus Routes setelah komponennya dibuat dan diimpor */}
            {/* <Layout> */}
            <Routes>
                {/* --- Rute untuk Publik / Pendaki --- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/cek-kuota" element={<CekKuotaPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/cek-booking" element={<CekBookingPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/" element={<div>Halaman Home</div>} /> {/* Sementara menggunakan placeholder */}
                <Route path="/cek-kuota" element={<div>Halaman Cek Kuota</div>} />
                <Route path="/booking" element={<div>Halaman Booking</div>} />
                <Route path="/cek-status" element={<div>Halaman Cek Status</div>} />
                <Route path="/sop" element={<div>Halaman SOP</div>} />
                <Route path="/register" element={<div>Halaman Registrasi</div>} />

                {/* --- Rute untuk Admin --- */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/admin/verifikasi" element={<VerificationPage />} />
                    <Route path="/admin/blacklist" element={<BlacklistPage />} />
                    <Route path="/admin/login" element={<div>Halaman Login Admin</div>} />
                    <Route path="/admin/dashboard" element={<div>Halaman Dashboard Admin</div>} />
                    <Route path="/admin/verifikasi-pembayaran" element={<div>Halaman Verifikasi Pembayaran</div>} />
                    <Route path="/admin/check-in" element={<div>Halaman Check-in</div>} />
                    <Route path="/admin/check-out" element={<div>Halaman Check-out</div>} />
                    <Route path="/admin/history" element={<div>Halaman Riwayat Pendakian</div>} />
                    <Route path="/admin/manajemen-pendaki" element={<div>Halaman Manajemen Pendaki</div>} />
                </Route>

                {/* Rute untuk halaman tidak ditemukan */}
                <Route path="*" element={<div>404 - Halaman Tidak Ditemukan</div>} />
            </Routes>
            {/* </Layout> */}
        </Router>
    );
}

export default App;

