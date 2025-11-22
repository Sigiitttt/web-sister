// src/pages/admin/BlacklistPage.jsx

import React, { useState, useEffect } from 'react';
import { getAllHikers, updateHikerStatus } from '../../services/api';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

const BlacklistPage = () => {
  const [hikers, setHikers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedHiker, setSelectedHiker] = useState(null);
  const [newStatus, setNewStatus] = useState('aktif');
  const [reason, setReason] = useState('');

  const fetchHikers = async () => {
    try {
      setLoading(true);
      const response = await getAllHikers();
      const data = response.data?.data.data;
      setHikers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data pendaki.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHikers();
  }, []);

  const openEditModal = (hiker) => {
    setSelectedHiker(hiker);
    setNewStatus(hiker.status);
    setReason(hiker.alasan_blacklist || '');
    setModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedHiker) return;
    if (newStatus === 'blacklist' && !reason) {
      alert("Alasan blacklist harus diisi!");
      return;
    }

    const dataToUpdate = {
      status: newStatus,
      alasan_blacklist: newStatus === 'blacklist' ? reason : "",
    };

    try {
      await updateHikerStatus(selectedHiker.id, dataToUpdate);
      alert("Status pendaki berhasil diperbarui.");
      setModalOpen(false);
      fetchHikers();
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui status.");
    }
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        status === 'aktif'
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white'
      }`}
    >
      {status === 'aktif' ? 'Aktif' : 'Blacklist'}
    </span>
  );

  if (loading) return <div className="text-gray-300">Memuat data...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">
        Manajemen Blacklist Pendaki
      </h1>

      <div className="bg-gray-800 border border-indigo-600 shadow-xl rounded-xl overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 text-sm">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-300 uppercase">
                Nama Lengkap
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-300 uppercase">
                No Identitas
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-300 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-300 uppercase">
                Alasan Blacklist
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-300 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {hikers.length > 0 ? (
              hikers.map((hiker) => (
                <tr key={hiker.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4">{hiker.nama_lengkap}</td>
                  <td className="px-6 py-4">{hiker.no_identitas}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={hiker.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {hiker.alasan_blacklist || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openEditModal(hiker)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Ubah Status
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  Tidak ada data pendaki.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={`Ubah Status: ${selectedHiker?.nama_lengkap}`}
      >
        <form onSubmit={handleUpdateStatus}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200">
                Status Baru
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="mt-1 block w-full p-2 bg-gray-900 text-gray-200 border border-gray-700 rounded-md"
              >
                <option value="aktif">Aktif</option>
                <option value="blacklist">Blacklist</option>
              </select>
            </div>
            {newStatus === 'blacklist' && (
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Alasan Blacklist (wajib diisi)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                  className="mt-1 block w-full p-2 bg-gray-900 text-gray-200 border border-gray-700 rounded-md"
                  required
                />
              </div>
            )}
            <div className="text-right">
              <Button type="submit">Simpan Perubahan</Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BlacklistPage;
