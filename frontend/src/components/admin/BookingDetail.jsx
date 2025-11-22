import React from 'react';

// Komponen Badge untuk Status
const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: 'bg-yellow-200 text-yellow-800',
    verified: 'bg-green-200 text-green-800',
    rejected: 'bg-red-200 text-red-800',
    booked: 'bg-blue-200 text-blue-800',
    'check-in': 'bg-indigo-200 text-indigo-800',
    'check-out': 'bg-gray-300 text-gray-800',
  };
  const displayText = (status || '').replace('_', ' ').toUpperCase();
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-200'}`}>
      {displayText}
    </span>
  );
};

// Komponen untuk menampilkan satu baris detail
const DetailRow = ({ label, value }) => (
    <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="font-semibold text-slate-800">{value || '-'}</p>
    </div>
);

const BookingDetail = ({ booking }) => {
  if (!booking) return null;

  // --- PERBAIKAN: Logika filter anggota dari CekBookingPage diterapkan di sini ---
  const membersOnly = booking.members?.filter(
    member => member.id !== booking.ketua?.id
  );

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    return new Date(dateTimeString).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
  }

  return (
    <div className="space-y-6 text-slate-800">
        {/* Detail Utama */}
        <div className="p-4 border rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-4">
            <DetailRow label="Tanggal Pendakian" value={new Date(booking.tanggal_pendakian).toLocaleDateString('id-ID', { dateStyle: 'long' })} />
            <DetailRow label="Total Bayar" value={`Rp ${booking.total_bayar.toLocaleString('id-ID')}`} />
            <div><p className="text-sm text-slate-500">Status Bayar</p><p><StatusBadge status={booking.status_pembayaran} /></p></div>
            <div><p className="text-sm text-slate-500">Status Pendakian</p><p><StatusBadge status={booking.status_pendakian} /></p></div>
        </div>

        {/* Detail Tambahan */}
        <div className="p-4 border rounded-lg grid grid-cols-2 gap-4">
            <DetailRow label="Jenis Pendakian" value={booking.jenis_pendakian} />
            <DetailRow label="Kendaraan" value={booking.jenis_kendaraan} />
            <DetailRow label="Waktu Check-in" value={formatDateTime(booking.checkins?.[0]?.waktu_checkin)} />
            <DetailRow label="Waktu Check-out" value={formatDateTime(booking.checkins?.[0]?.waktu_checkout)} />
        </div>

        {/* Detail Peserta */}
        <div className="p-4 border rounded-lg">
            <h4 className="text-lg font-bold mb-2">Informasi Peserta</h4>
            
            {/* --- PERBAIKAN: Menampilkan detail Ketua --- */}
            <div className="mt-2">
                <p className="font-bold text-slate-600 mb-2">Ketua Kelompok</p>
                <div className="p-3 bg-slate-50 rounded-lg text-sm">
                    <p><strong>Nama:</strong> {booking.ketua?.nama_lengkap || '-'}</p>
                    <p><strong>No. Identitas:</strong> {booking.ketua?.no_identitas || '-'}</p>
                </div>
            </div>
            
            {/* --- PERBAIKAN: Menampilkan detail Anggota (sudah difilter) --- */}
            {membersOnly && membersOnly.length > 0 ? (
                <div className="mt-4">
                    <p className="font-bold text-slate-600 mb-2">Anggota</p>
                    <div className="space-y-2">
                        {membersOnly.map((member, index) => (
                           <div key={member.id || index} className="p-3 bg-slate-50 rounded-lg text-sm">
                                <p><strong>Nama:</strong> {member.nama_lengkap || '-'}</p>
                                <p><strong>No. Identitas:</strong> {member.no_identitas || '-'}</p>
                           </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-4">
                    <p className="font-bold text-slate-600 mb-2">Anggota</p>
                    <p className="text-sm text-slate-500">- (Tidak ada anggota)</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default BookingDetail;

