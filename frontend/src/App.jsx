import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import Layout from "./components/layout/Layout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

// Halaman Publik
import HomePage from "./pages/HomePage.jsx";
import CekKuotaPage from "./pages/CekKuotaPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import CekBookingPage from "./pages/CekBookingPage.jsx";
import PanduanPage from "./pages/PanduanPage.jsx";
import SopPage from "./pages/SopPage.jsx";

// Halaman Admin
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import VerificationPage from "./pages/admin/VerificationPage.jsx";
import BlacklistPage from "./pages/admin/BlacklistPage.jsx";
import OperationalPage from './pages/admin/OperationalPage.jsx';
import ManajemenKuotaPage from './pages/admin/ManajemenKuotaPage.jsx';

function App() {
    return (
        <Router>
            <Routes>
                {/* Grup 1: Rute Publik menggunakan Layout standar */}
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cek-kuota" element={<CekKuotaPage />} />
                    <Route path="/booking" element={<BookingPage />} />
                    <Route path="/cek-booking" element={<CekBookingPage />} />
                    <Route path="/panduan" element={<PanduanPage />} />
                    <Route path="/SopPage" element={<SopPage />} />
                </Route>

                {/* Grup 2: Rute Admin dilindungi & menggunakan AdminLayout */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                        <Route path="/admin/verifikasi" element={<VerificationPage />} />
                        <Route path="/admin/blacklist" element={<BlacklistPage />} />
                        <Route path="/admin/operasional" element={<OperationalPage />} />
                        <Route path="/admin/kuota" element={<ManajemenKuotaPage />} />
                    </Route>
                </Route>

                {/* Grup 3: Halaman login tanpa layout apapun */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Grup 4: Halaman "Tidak Ditemukan" */}
                <Route path="*" element={<div className="text-center mt-20"><h1>404: Halaman Tidak Ditemukan</h1></div>} />
            </Routes>
        </Router>
    );
}

export default App;