import React, { useState } from 'react';
import { checkQuota } from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

// --- Komponen Ikon SVG ---
const CalendarSearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);


const CekKuotaPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [quotaData, setQuotaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('Pilih tanggal pendakian untuk melihat kuota yang masih tersedia.');

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const handleCheckQuota = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      setError('Tanggal harus dipilih terlebih dahulu.');
      return;
    }
    setLoading(true);
    setError(null);
    setQuotaData(null);
    setMessage(null);
    try {
      const response = await checkQuota(selectedDate);
      setQuotaData(response.data.data);
    } catch (err) {
      setError("Gagal mengambil data kuota. Pastikan tanggal yang Anda pilih memiliki kuota yang terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        {/* --- Header Halaman --- */}
        <div className="bg-red-500 h-20 w-20">hallooooooooo</div>

        <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                <CalendarSearchIcon />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Cek Ketersediaan Kuota</h1>
            <p className="mt-2 text-lg text-slate-500">
                Pastikan ada tempat untuk Anda dan rombongan sebelum melakukan booking.
            </p>
        </div>

        {/* --- Form Pencarian --- */}
        <Card>
          <form onSubmit={handleCheckQuota}>
              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="flex-grow w-full">
                    <Input
                        label="Pilih Tanggal Pendakian"
                        id="tanggal_pendakian"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                        min={getTodayDate()}
                    />
                </div>
                <Button type="submit" disabled={loading} className="w-full sm:w-auto h-10">
                    {loading ? 'Mencari...' : 'Cek Kuota'}
                </Button>
              </div>
          </form>
        </Card>

        {/* --- Hasil Pencarian --- */}
        <div className="mt-8 text-center">
            {loading && (
                <div className="flex justify-center items-center h-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            )}
            {error && <p className="text-red-600 font-semibold">{error}</p>}
            {message && !quotaData && !error && !loading && <p className="text-slate-500">{message}</p>}
            
            {quotaData && (
                <div className="bg-cyan-500 text-white rounded-xl shadow-2xl shadow-cyan-500/30 p-8 transform transition-all animate-fade-in-up">
                    <p className="font-semibold text-cyan-100">
                        Hasil Pengecekan untuk Tanggal: {new Date(quotaData.tanggal).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                    </p>
                    <div className="mt-2">
                        <span className="text-7xl font-extrabold drop-shadow-lg">{quotaData.sisa_kuota}</span>
                        <span className="ml-2 text-2xl font-semibold text-cyan-200">Kuota Tersedia</span>
                    </div>
                    {/* Menampilkan total kuota jika tersedia */}
                    {quotaData.kuota_maksimal && (
                        <p className="mt-2 text-lg text-cyan-100">
                            dari total {quotaData.kuota_maksimal} kuota
                        </p>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default CekKuotaPage;