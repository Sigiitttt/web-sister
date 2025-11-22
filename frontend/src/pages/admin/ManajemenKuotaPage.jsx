import React, { useState, useEffect, useCallback } from 'react';
import { getAdminQuotas, saveQuota } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Notification from '../../components/ui/Notification';

const ManajemenKuotaPage = () => {
    const [quotas, setQuotas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });
    
    // State untuk form tambah/ubah
    const [formData, setFormData] = useState({ tanggal: '', kuota_maksimal: 100 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Fungsi untuk menampilkan notifikasi
    const showNotification = useCallback((message, type) => {
        setNotification({ message, type });
    }, []);

    // Fungsi untuk mengambil data kuota dari API
    const fetchQuotas = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAdminQuotas();
            // Backend mengirim data paginasi, array ada di dalam response.data.data.data
            setQuotas(response.data.data.data || []);
        } catch (err) {
            setError('Gagal memuat data kuota dari server.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Panggil fetchQuotas saat komponen pertama kali dimuat
    useEffect(() => {
        fetchQuotas();
    }, [fetchQuotas]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.tanggal) {
            showNotification('Tanggal harus diisi.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            await saveQuota(formData);
            showNotification('Kuota berhasil disimpan!', 'success');
            fetchQuotas(); // Muat ulang daftar kuota
            setFormData({ tanggal: '', kuota_maksimal: 100 }); // Reset form
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Gagal menyimpan kuota. Pastikan data sudah benar.';
            showNotification(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-gray-800">
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            <h1 className="text-3xl font-bold mb-6">Manajemen Kuota Pendakian</h1>

            <Card className="mb-8">
                <h2 className="text-xl font-bold mb-4">Tambah atau Ubah Kuota</h2>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-4">
                    <div className="flex-1 w-full">
                        <Input label="Tanggal" type="date" name="tanggal" value={formData.tanggal} onChange={handleInputChange} required />
                    </div>
                    <div className="flex-1 w-full">
                        <Input label="Kuota Maksimal" type="number" name="kuota_maksimal" value={formData.kuota_maksimal} onChange={handleInputChange} required min="0" />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="h-10 w-full md:w-auto">
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Kuota'}
                    </Button>
                </form>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4">Daftar Kuota Mendatang</h2>
                {error && <p className="text-red-500">{error}</p>}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kuota Maksimal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kuota Terpakai</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sisa Kuota</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan="4" className="text-center py-4">Memuat data...</td></tr>
                            ) : quotas.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-4">Tidak ada data kuota mendatang.</td></tr>
                            ) : (
                                quotas.map(quota => (
                                    <tr key={quota.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(quota.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                        <td className="px-6 py-4">{quota.kuota_maksimal}</td>
                                        <td className="px-6 py-4">{quota.kuota_terpakai || 0}</td>
                                        <td className="px-6 py-4 font-bold text-green-600">{ (quota.kuota_maksimal - (quota.kuota_terpakai || 0)) }</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ManajemenKuotaPage;
