import React, { useState } from 'react';
import { checkBookingStatus, uploadPaymentProof } from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

// --- Komponen Ikon SVG ---
const TicketSearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h3m2-4H5m11-4a2 2 0 012 2v3a2 2 0 01-2 2h-3m-2-4h5M9 15l-3 3m0 0l3-3m-3 3h5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Komponen Badge untuk Status
const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    booked: 'bg-cyan-100 text-cyan-800',
    'check-in': 'bg-indigo-100 text-indigo-800',
    'check-out': 'bg-slate-100 text-slate-800',
  };
  const displayText = (status || '').replace('_', ' ').toUpperCase();
  return (
    <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusStyles[status] || statusStyles['booked']}`}>
      {displayText}
    </span>
  );
};

const CekBookingPage = () => {
  const [kodeBooking, setKodeBooking] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('Masukkan kode booking unik Anda untuk melihat status pendaftaran dan pembayaran.');

  const [paymentProof, setPaymentProof] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleCekStatus = async (e) => {
    e.preventDefault();
    if (!kodeBooking) {
      setError('Kode booking tidak boleh kosong.');
      return;
    }

    setLoading(true);
    setError(null);
    setBookingDetails(null);
    setMessage(null);
    setUploadMessage('');

    try {
      const response = await checkBookingStatus(kodeBooking);
      setBookingDetails(response.data.data);
    } catch (err) {
      setBookingDetails(null);
      setError(err.response?.data?.message || 'Kode booking tidak ditemukan atau terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const handlePaymentUpload = async (e) => {
    e.preventDefault();
    if (!paymentProof) {
      alert("Silakan pilih file bukti pembayaran terlebih dahulu.");
      return;
    }
    setUploading(true);
    setUploadMessage('');
    const formData = new FormData();
    formData.append('bukti_bayar', paymentProof);

    try {
      const response = await uploadPaymentProof(kodeBooking, formData);
      setUploadMessage(response.data.message);
      // Otomatis refresh status setelah 1 detik
      setTimeout(() => {
        const mockEvent = { preventDefault: () => { } };
        handleCekStatus(mockEvent);
      }, 1000);
    } catch (err) {
      setUploadMessage("Gagal mengunggah bukti pembayaran.");
    } finally {
      setUploading(false);
    }
  };

  const membersOnly = bookingDetails?.members?.filter(
    member => member.id !== bookingDetails.ketua?.id
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <TicketSearchIcon />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Cek Status Booking</h1>
        <p className="mt-2 text-lg text-slate-500">
          Lacak status pendaftaran dan pembayaran Anda di sini.
        </p>
      </div>

      <Card>
        <form onSubmit={handleCekStatus} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-grow w-full">
            <Input
              label="Kode Booking Anda"
              id="kode_booking"
              value={kodeBooking}
              onChange={(e) => setKodeBooking(e.target.value.toUpperCase())}
              placeholder="Contoh: PENAN-ABCDE123"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto h-10">
            {loading ? 'Mencari...' : 'Cari'}
          </Button>
        </form>
      </Card>

      <div className="mt-8">
        {loading && (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        )}
        {error && <p className="text-center text-red-600 font-semibold bg-red-100 p-3 rounded-lg">{error}</p>}
        {message && !bookingDetails && !error && !loading && <p className="text-center text-slate-500">{message}</p>}

        {bookingDetails && (
          <div className="transform transition-all animate-fade-in-up">
            <Card title={`Detail Booking: ${bookingDetails.kode_booking}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div><p className="text-sm text-slate-500">Tanggal Pendakian</p><p className="font-semibold">{new Date(bookingDetails.tanggal_pendakian).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p></div>
                <div><p className="text-sm text-slate-500">Total Bayar</p><p className="font-semibold">Rp {bookingDetails.total_bayar.toLocaleString('id-ID')}</p></div>
                <div><p className="text-sm text-slate-500">Status Pembayaran</p><p><StatusBadge status={bookingDetails.status_pembayaran} /></p></div>
                <div><p className="text-sm text-slate-500">Status Pendakian</p><p><StatusBadge status={bookingDetails.status_pendakian} /></p></div>
              </div>

              <hr className="my-6" />

              <div>
                <h4 className="text-lg font-bold text-slate-700 mb-2">Informasi Peserta</h4>
                <div className="space-y-3">
                  <div><p className="text-sm text-slate-500">Ketua Kelompok</p><p className="font-semibold">{bookingDetails.ketua?.nama_lengkap}</p></div>
                  <div>
                    <p className="text-sm text-slate-500">Anggota</p>
                    {membersOnly && membersOnly.length > 0 ? (
                      <ul className="list-disc list-inside pl-1">
                        {membersOnly.map((member) => (
                          <li key={member.id} className="font-semibold">{member.nama_lengkap}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-semibold">- (Tidak ada anggota)</p>
                    )}
                  </div>
                </div>
              </div>

              {bookingDetails.status_pembayaran === 'pending' && (
                <div className="pt-6 border-t mt-6">
                  <h3 className="text-lg font-bold text-slate-700">Unggah Bukti Pembayaran</h3>
                  <p className="text-sm text-slate-500 mb-4">Silakan unggah bukti transfer Anda untuk diverifikasi oleh admin.</p>
                  <form onSubmit={handlePaymentUpload} className="space-y-4">
                    <Input
                      label="Pilih File Gambar"
                      id="bukti_bayar"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      required
                    />
                    <Button type="submit" disabled={uploading}>
                      {uploading ? 'Mengunggah...' : 'Unggah Pembayaran'}
                    </Button>
                    {uploadMessage && <p className="text-green-600 font-semibold mt-2">{uploadMessage}</p>}
                  </form>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CekBookingPage;


