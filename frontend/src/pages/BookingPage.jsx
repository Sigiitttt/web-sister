import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Notification from '../components/ui/Notification';
import BookingTicket from '../components/ui/BookingTicket';

// Import library untuk PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Komponen Ikon SVG ---
const FormIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const BookingPage = () => {
    const navigate = useNavigate();
    const ticketRef = useRef();
    
    const [formData, setFormData] = useState({
        tanggal_pendakian: '',
        jenis_kendaraan: '',
        jenis_pendakian: 'menginap',
        ketua: {
            nama_lengkap: '', no_identitas: '', alamat: '', 
            tanggal_lahir: '', jenis_kelamin: 'L', telepon: '', email: ''
        },
        members: [],
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [bookingResult, setBookingResult] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const showNotification = useCallback((message, type) => setNotification({ message, type }), []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleKetuaChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, ketua: { ...prev.ketua, [name]: value } }));
    };

    const handleMemberChange = (index, e) => {
        const { name, value } = e.target;
        const newMembers = [...formData.members];
        newMembers[index][name] = value;
        setFormData(prev => ({ ...prev, members: newMembers }));
    };

    const addMember = () => {
        setFormData(prev => ({
            ...prev,
            members: [...prev.members, { 
                nama_lengkap: '', no_identitas: '', alamat: '', 
                tanggal_lahir: '', jenis_kelamin: 'L'
            }],
        }));
    };

    const removeMember = (index) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        const payload = { ...formData };

        try {
            const response = await createBooking(payload);
            setBookingResult({
                ...response.data.data,
                tanggal_pendakian: formData.tanggal_pendakian,
                jenis_pendakian: formData.jenis_pendakian,
            });
            setModalOpen(true);
        } catch (err) {
            showNotification('Gagal membuat booking, periksa kembali data Anda.', 'error');
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors || { form: ["Isian form tidak valid."] });
            } else {
                setErrors({ form: ["Terjadi kesalahan pada server."] });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = () => {
        const ticketElement = ticketRef.current;
        html2canvas(ticketElement, { scale: 2 })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`tiket-pendakian-${bookingResult.kode_booking}.pdf`);
            });
    };

    return (
        <>
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <FormIcon />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Formulir Pendaftaran</h1>
                    <p className="mt-2 text-lg text-slate-500">
                        Lengkapi semua data di bawah ini untuk memulai petualangan Anda.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        {errors && (
                            <div className="mb-6 text-left text-red-700 bg-red-100 p-4 rounded-md">
                                <p className="font-bold mb-2">Terjadi Kesalahan:</p>
                                <ul className="list-disc list-inside text-sm">
                                    {Object.values(errors).flat().map((msg, index) => ( <li key={index}>{msg}</li> ))}
                                </ul>
                            </div>
                        )}
                        
                        <div className="space-y-8">
                            {/* --- Bagian 1: Rincian Perjalanan --- */}
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">1. Rincian Perjalanan</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <Input label="Tanggal Pendakian" type="date" name="tanggal_pendakian" value={formData.tanggal_pendakian} onChange={handleInputChange} required />
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Jenis Pendakian</label>
                                        <select name="jenis_pendakian" value={formData.jenis_pendakian} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
                                            <option value="menginap">Menginap (Camping)</option>
                                            <option value="tektok">Tektok (PP Sehari)</option>
                                        </select>
                                    </div>
                                    <Input label="Kendaraan" name="jenis_kendaraan" placeholder="Cth: Motor Vario" value={formData.jenis_kendaraan} onChange={handleInputChange} required />
                                </div>
                            </div>
                            
                            {/* --- Bagian 2: Data Ketua --- */}
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">2. Data Ketua Kelompok</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Nama Lengkap" name="nama_lengkap" value={formData.ketua.nama_lengkap} onChange={handleKetuaChange} required />
                                    <Input label="No. Identitas (KTP/SIM)" name="no_identitas" value={formData.ketua.no_identitas} onChange={handleKetuaChange} required />
                                    <Input label="Tanggal Lahir" name="tanggal_lahir" type="date" value={formData.ketua.tanggal_lahir} onChange={handleKetuaChange} required />
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-1">Jenis Kelamin</label>
                                        <select name="jenis_kelamin" value={formData.ketua.jenis_kelamin} onChange={handleKetuaChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                    <Input label="Email" name="email" type="email" value={formData.ketua.email} onChange={handleKetuaChange} required />
                                    <Input label="No. Telepon" name="telepon" type="tel" value={formData.ketua.telepon} onChange={handleKetuaChange} required />
                                    <Input label="Alamat" name="alamat" value={formData.ketua.alamat} onChange={handleKetuaChange} required className="md:col-span-2" />
                                </div>
                            </div>

                            {/* --- Bagian 3: Data Anggota --- */}
                            <div>
                                <div className="flex justify-between items-center border-b pb-2 mb-4">
                                    <h3 className="text-xl font-bold text-slate-800">3. Data Anggota</h3>
                                    <Button type="button" variant="secondary" onClick={addMember}>Tambah Anggota</Button>
                                </div>
                                <div className="space-y-4">
                                    {formData.members.map((member, index) => (
                                        <div key={index} className="p-4 bg-slate-50 rounded-lg relative space-y-4 border border-slate-200">
                                            <p className="font-semibold text-slate-700">Anggota {index + 1}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input label="Nama Lengkap" name="nama_lengkap" value={member.nama_lengkap} onChange={(e) => handleMemberChange(index, e)} required />
                                                <Input label="No. Identitas" name="no_identitas" value={member.no_identitas} onChange={(e) => handleMemberChange(index, e)} required />
                                                <Input label="Tanggal Lahir" name="tanggal_lahir" type="date" value={member.tanggal_lahir} onChange={(e) => handleMemberChange(index, e)} required />
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-600 mb-1">Jenis Kelamin</label>
                                                    <select name="jenis_kelamin" value={member.jenis_kelamin} onChange={(e) => handleMemberChange(index, e)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
                                                        <option value="L">Laki-laki</option>
                                                        <option value="P">Perempuan</option>
                                                    </select>
                                                </div>
                                                <Input label="Alamat" name="alamat" value={member.alamat} onChange={(e) => handleMemberChange(index, e)} required className="md:col-span-2" />
                                            </div>
                                            <Button type="button" variant="danger" className="absolute top-2 right-2 px-2 py-1 text-xs" onClick={() => removeMember(index)}>Hapus</Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" disabled={loading} className="w-full text-lg py-3">
                                    {loading ? 'Memproses...' : 'Daftar Sekarang'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </form>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Booking Berhasil">
                {bookingResult && (
                    <div className="space-y-4">
                        <div>
                            <p>Pendaftaran Anda telah berhasil dibuat.</p>
                            <p className="text-lg font-bold">Kode Booking: <span className="text-cyan-600">{bookingResult.kode_booking}</span></p>
                            <p>Total Pembayaran: <span className="font-semibold">Rp {Number(bookingResult.total_bayar).toLocaleString('id-ID')}</span></p>
                        </div>
                        <div className="border-t pt-4">
                            <Button onClick={handleDownloadPdf} className="w-full">
                                Simpan Tiket (PDF)
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <BookingTicket 
                    ref={ticketRef} 
                    bookingData={bookingResult} 
                    ketua={formData.ketua}
                    members={formData.members}
                />
            </div>
        </>
    );
};

export default BookingPage;