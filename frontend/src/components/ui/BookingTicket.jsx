import React from 'react';

// Komponen ini didesain khusus untuk dicetak ke PDF.
const BookingTicket = React.forwardRef(({ bookingData, ketua, members }, ref) => {
    if (!bookingData) return null;

    // --- PERBAIKAN: Logika filter untuk memastikan ketua tidak muncul di daftar anggota ---
    const membersOnly = members?.filter(
        member => member.no_identitas !== ketua?.no_identitas
    ) || [];

    // Menggunakan inline style untuk warna agar kompatibel dengan html2canvas
    const styles = {
        container: { width: '800px', backgroundColor: 'white', color: 'black', fontFamily: 'sans-serif' },
        header: { borderBottom: '2px solid black' },
        sectionTitle: { borderBottom: '1px solid #E5E7EB', color: '#374151' },
        label: { color: '#6B7280' },
        value: { color: '#111827', fontWeight: '600' },
        footer: { borderTop: '2px dashed #9CA3AF', color: '#4B5563' },
        qrPlaceholder: { width: '100px', height: '100px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB' }
    };

    return (
        <div ref={ref} className="p-8" style={styles.container}>
            {/* --- HEADER TIKET --- */}
            <div className="pb-4 mb-4 flex justify-between items-start" style={styles.header}>
                <div>
                    <h1 className="text-3xl font-bold">TIKET PENDAKIAN</h1>
                    <p className="text-lg text-slate-600">Gunung Penanggungan</p>
                </div>
                <div className="text-center">
                    <div style={styles.qrPlaceholder} className="flex items-center justify-center text-xs text-gray-400">QR Code</div>
                </div>
            </div>

            {/* --- INFORMASI UTAMA --- */}
            <div className="grid grid-cols-3 gap-6 my-8">
                <div>
                    <p className="text-sm" style={styles.label}>Kode Booking</p>
                    <p className="text-xl font-mono" style={styles.value}>{bookingData.kode_booking}</p>
                </div>
                <div>
                    <p className="text-sm" style={styles.label}>Tanggal Pendakian</p>
                    <p className="text-lg" style={styles.value}>{new Date(bookingData.tanggal_pendakian).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                </div>
                <div>
                    <p className="text-sm" style={styles.label}>Jenis Pendakian</p>
                    <p className="text-lg capitalize" style={styles.value}>{bookingData.jenis_pendakian}</p>
                </div>
            </div>

            {/* --- INFORMASI PESERTA --- */}
            <div className="mt-8">
                <h2 className="text-xl font-bold pb-2 mb-4" style={styles.sectionTitle}>INFORMASI PESERTA</h2>
                
                {/* Ketua */}
                <div className="mb-4">
                    <p className="font-semibold" style={styles.label}>Ketua Kelompok</p>
                    <p className="text-lg" style={styles.value}>{ketua?.nama_lengkap}</p>
                </div>

                {/* Anggota */}
                {membersOnly.length > 0 && (
                    <div>
                        <p className="font-semibold" style={styles.label}>Anggota ({membersOnly.length} orang)</p>
                        <ul className="list-decimal list-inside mt-2">
                            {membersOnly.map((member, index) => (
                                <li key={index} className="text-lg" style={styles.value}>{member.nama_lengkap}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* --- FOOTER TIKET --- */}
            <div className="mt-10 pt-6 text-center text-sm" style={styles.footer}>
                <p>Terima kasih telah melakukan pendaftaran. Mohon segera lakukan pembayaran dan unggah bukti di halaman "Cek Status".</p>
                <p className="font-bold mt-2">Simpan tiket ini sebagai bukti pendaftaran Anda.</p>
            </div>
        </div>
    );
});

export default BookingTicket;

