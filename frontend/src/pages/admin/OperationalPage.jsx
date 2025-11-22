import React, { useState, useEffect } from 'react';
import { getTodayBookings, getHistory, checkBookingStatus, checkinBooking, checkoutBooking } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import BookingDetail from '../../components/admin/BookingDetail';

const OperationalPage = () => {
    const [activeTab, setActiveTab] = useState('checkin');
    const [todayBookings, setTodayBookings] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // State untuk pencarian dan modal
    const [searchCode, setSearchCode] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
  
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (activeTab === 'checkin') {
          const response = await getTodayBookings();
          setTodayBookings(response.data.data);
        } else {
          const response = await getHistory();
          setHistory(response.data.data.data);
        }
      } catch (err) {
        setError('Gagal memuat data dari server.');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, [activeTab]);
  
    // --- FUNGSI BARU UNTUK MELIHAT DETAIL ---
    const handleViewDetails = async (kodeBooking) => {
        setSearchLoading(true);
        setSearchError(null);
        setSearchResult(null);
        try {
            const response = await checkBookingStatus(kodeBooking);
            setSearchResult(response.data.data);
            setModalOpen(true); // Buka modal dengan detail yang ditemukan
        } catch (err) {
            alert(`Gagal mengambil detail untuk booking: ${kodeBooking}`);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSearch = async (e) => {
      e.preventDefault();
      if (!searchCode) return;
      // Gunakan kembali fungsi handleViewDetails untuk pencarian manual
      handleViewDetails(searchCode);
    };
  
    const handleCheckin = async (bookingId) => {
      if (!window.confirm(`Lakukan check-in untuk booking ID: ${bookingId}?`)) return;
      try {
        const response = await checkinBooking(bookingId); 
        alert(response.data.message);
        fetchData();
      } catch (err) {
        alert('Gagal melakukan check-in.');
      }
    };
  
    const handleCheckout = async (bookingId) => {
      if (!window.confirm(`Lakukan check-out untuk booking ID: ${bookingId}?`)) return;
      try {
        const response = await checkoutBooking(bookingId);
        alert(response.data.message);
        fetchData();
      } catch (err) {
        alert('Gagal melakukan check-out.');
      }
    };
  
    const renderContent = () => {
      if (loading) {
        return (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-600 border-t-blue-500"></div>
          </div>
        );
      }
      if (error) return <div className="text-red-400 bg-red-900/30 p-4 rounded-lg">{error}</div>;
  
      if (activeTab === 'checkin') {
        return (
          <div className="bg-gray-800 shadow-lg rounded-xl overflow-x-auto border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Kode Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Ketua</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Jumlah Pendaki</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Aksi</th>
                  {/* --- PERBAIKAN: Kolom Detail ditambahkan --- */}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-gray-100">
                {todayBookings.length > 0 ? todayBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4">{booking.kode_booking}</td>
                    <td className="px-6 py-4">{booking.ketua?.nama_lengkap}</td>
                    <td className="px-6 py-4">{booking.jumlah_pendaki}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${booking.status_pendakian === 'booked' ? 'bg-blue-600 text-white' :
                          booking.status_pendakian === 'check-in' ? 'bg-green-600 text-white' :
                          'bg-yellow-600 text-white'}`}
                      >
                        {booking.status_pendakian}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      {booking.status_pendakian === 'booked' && (
                        <Button variant="primary" onClick={() => handleCheckin(booking.id)}>Check-in</Button>
                      )}
                      {booking.status_pendakian === 'check-in' && (
                        <Button variant="secondary" onClick={() => handleCheckout(booking.id)}>Check-out</Button>
                      )}
                    </td>
                    {/* --- PERBAIKAN: Tombol Detail ditambahkan --- */}
                    <td className="px-6 py-4">
                        <Button variant="secondary" onClick={() => handleViewDetails(booking.kode_booking)}>Lihat</Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-400"> {/* Colspan diubah menjadi 6 */}
                      Tidak ada booking hari ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      }
  
      if (activeTab === 'history') {
        return (
          <div className="bg-gray-800 shadow-lg rounded-xl overflow-x-auto border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Kode Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Tanggal Pendakian</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Ketua</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Jumlah Pendaki</th>
                  {/* --- PERBAIKAN: Kolom Detail ditambahkan --- */}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-gray-100">
                {history.length > 0 ? history.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">{item.kode_booking}</td>
                    <td className="px-6 py-4">{new Date(item.tanggal_pendakian).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">{item.ketua?.nama_lengkap}</td>
                    <td className="px-6 py-4">{item.jumlah_pendaki}</td>
                    {/* --- PERBAIKAN: Tombol Detail ditambahkan --- */}
                    <td className="px-6 py-4">
                        <Button variant="secondary" onClick={() => handleViewDetails(item.kode_booking)}>Lihat</Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-400"> {/* Colspan diubah menjadi 5 */}
                      Riwayat masih kosong.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      }
    };
  
    return (
      <>
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Operasional Harian</h1>
  
        <div className="mb-8 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Cari Semua Booking</h2>
          <form onSubmit={handleSearch} className="flex items-end gap-4">
            <Input
              label="Masukkan Kode Booking"
              id="search_booking"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
              placeholder="Cari berdasarkan kode..."
            />
            <Button type="submit" disabled={searchLoading} className="h-10">
              {searchLoading ? 'Mencari...' : 'Cari'}
            </Button>
          </form>
          {searchError && <p className="text-red-400 mt-2">{searchError}</p>}
        </div>
  
        <div className="mb-4 border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('checkin')}
              className={`${activeTab === 'checkin' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Daftar Check-in Hari Ini
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`${activeTab === 'history' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Riwayat Pendakian
            </button>
          </nav>
        </div>
  
        {renderContent()}
  
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title={`Detail Booking: ${searchResult?.kode_booking}`}
        >
          <BookingDetail booking={searchResult} />
        </Modal>
      </>
    );
}

export default OperationalPage;

