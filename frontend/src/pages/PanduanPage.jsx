import React from 'react';
import { Link } from 'react-router-dom';

// ============================================================================
// KOMPONEN-KOMPONEN UI KHUSUS UNTUK HALAMAN PANDUAN
// ============================================================================

// Komponen Card untuk setiap langkah
const StepCard = ({ icon, stepNumber, title, children }) => (
    <div className="flex items-start space-x-6">
        <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-16 h-16 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg">
                {icon}
            </div>
            <div className="mt-2 text-xs font-bold text-slate-500 uppercase">
                LANGKAH {stepNumber}
            </div>
        </div>
        <div className="flex-1 bg-white p-6 rounded-xl shadow-md border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
            <div className="text-slate-600 leading-relaxed space-y-2">
                {children}
            </div>
        </div>
    </div>
);

// Ikon-ikon SVG yang akan digunakan
const IkonPencarian = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const IkonFormulir = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>);
const IkonPembayaran = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>);
const IkonPendakian = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H5a2 2 0 00-2 2zm0 0h7.5" /></svg>);


// ============================================================================
// KOMPONEN UTAMA HALAMAN PANDUAN
// ============================================================================

const PanduanPage = () => {
    return (
        <div className="bg-slate-50 font-sans text-slate-800">
            {/* Konten Utama */}
            <main className="container mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900">Alur Booking Pendakian</h2>
                        <p className="mt-4 text-lg text-slate-600">Ikuti empat langkah mudah ini untuk merencanakan dan melaksanakan pendakian Anda di Gunung Penanggungan.</p>
                    </div>

                    {/* Timeline / Stepper */}
                    <div className="space-y-12">
                        <StepCard icon={<IkonPencarian />} stepNumber="1" title="Perencanaan & Cek Kuota">
                            <p>Sebelum booking, pastikan Anda sudah siap. Buka halaman utama untuk membaca <strong>SOP Pendakian</strong> dan melihat <strong>Informasi Cuaca</strong>.</p>
                            <p>Setelah itu, kunjungi halaman <Link to="/cek-kuota" className="font-semibold text-cyan-600 hover:underline">Cek Kuota</Link>, pilih tanggal rencana pendakian Anda, dan sistem akan menampilkan sisa kuota yang tersedia.</p>
                        </StepCard>

                        <StepCard icon={<IkonFormulir />} stepNumber="2" title="Proses Booking Online">
                            <p>Jika kuota tersedia, buka halaman <Link to="/booking" className="font-semibold text-cyan-600 hover:underline">Booking</Link>. Isi formulir dengan data yang valid untuk ketua dan semua anggota rombongan.</p>
                            <p>Setelah mengirim formulir, Anda akan menerima <strong>Kode Booking</strong> dan <strong>Total Tagihan</strong>. Harap simpan informasi ini baik-baik.</p>
                        </StepCard>

                        <StepCard icon={<IkonPembayaran />} stepNumber="3" title="Pembayaran & Konfirmasi">
                            <p>Lakukan transfer sesuai total tagihan. Lalu, buka halaman <Link to="/cek-booking" className="font-semibold text-cyan-600 hover:underline">Cek Status</Link> dan masukkan Kode Booking Anda.</p>
                            <p>Di halaman detail, unggah foto atau screenshot bukti transfer Anda. Status booking Anda akan berubah menjadi "Menunggu Verifikasi" hingga disetujui oleh admin.</p>
                        </StepCard>
                        
                        <StepCard icon={<IkonPendakian />} stepNumber="4" title="Hari-H Pendakian">
                            <p>Datang ke pos pendakian pada tanggal yang telah Anda booking. Tunjukkan Kode Booking Anda kepada petugas untuk divalidasi dan proses <strong>check-in</strong>.</p>
                            <p>Setelah selesai mendaki, jangan lupa untuk melapor kembali ke pos yang sama untuk melakukan proses <strong>check-out</strong>.</p>
                        </StepCard>
                    </div>

                    <div className="mt-20 text-center text-slate-500 border-t pt-8">
                        <p className="font-semibold">Selamat Merencanakan Pendakian Anda!</p>
                        <p className="text-sm">Pastikan Anda selalu mematuhi SOP demi keselamatan dan kelestarian alam.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PanduanPage;
