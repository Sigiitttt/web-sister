// src/pages/admin/VerificationPage.jsx

import React, { useState, useEffect } from 'react';
import { getPendingPayments, verifyPayment } from '../../services/api';

const VerificationPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getPendingPayments();
      setPayments(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (paymentId) => {
    if (!window.confirm("Apakah Anda yakin ingin memverifikasi pembayaran ini?")) return;

    try {
      await verifyPayment(paymentId);
      alert("Pembayaran berhasil diverifikasi.");
      fetchPayments();
    } catch (err) {
      console.error(err);
      alert("Gagal memverifikasi pembayaran.");
    }
  };

  if (loading) return <div className="text-gray-300">Memuat data...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Verifikasi Pembayaran</h1>
      {payments.length === 0 ? (
        <p className="text-gray-400">Tidak ada pembayaran yang menunggu verifikasi.</p>
      ) : (
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-x-auto border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-indigo-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Kode Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Bukti Bayar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-700 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                    {payment.booking.kode_booking}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                    Rp {payment.jumlah.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`http://127.0.0.1:8000/storage/${payment.bukti_bayar}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 underline"
                    >
                      Lihat Bukti
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleVerify(payment.id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-md text-sm transition"
                    >
                      Verifikasi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VerificationPage;
