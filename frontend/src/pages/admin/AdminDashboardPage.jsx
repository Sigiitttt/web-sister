// // src/pages/admin/AdminDashboardPage.jsx

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ShieldCheck, CalendarCheck, CreditCard } from 'lucide-react'; // icon modern
// import Card from '../../components/ui/Card';

// const AdminDashboardPage = () => {
//   const menuItems = [
//     {
//       to: "/admin/verifikasi",
//       title: "Verifikasi Pembayaran",
//       desc: "Lihat dan verifikasi pembayaran yang masuk.",
//       icon: <CreditCard className="w-8 h-8 text-indigo-400" />
//     },
//     {
//       to: "/admin/operasional",
//       title: "Operasional Harian",
//       desc: "Proses check-in, check-out, dan lihat riwayat.",
//       icon: <CalendarCheck className="w-8 h-8 text-green-400" />
//     },
//     {
//       to: "/admin/blacklist",
//       title: "Manajemen Blacklist",
//       desc: "Kelola daftar pendaki yang di-blacklist.",
//       icon: <ShieldCheck className="w-8 h-8 text-red-400" />
//     }
//   ];

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6 text-gray-100">Dashboard Admin</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {menuItems.map((item, idx) => (
//           <Link key={idx} to={item.to}>
//             <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 hover:from-gray-700 hover:to-gray-800 transition-all rounded-2xl p-6 shadow-lg hover:shadow-xl flex flex-col items-start space-y-3">
//               <div className="p-3 bg-gray-700 rounded-xl">
//                 {item.icon}
//               </div>
//               <h3 className="text-xl font-semibold">{item.title}</h3>
//               <p className="mt-1 text-gray-400 text-sm">{item.desc}</p>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboardPage;


// src/pages/admin/AdminDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { getPendingPayments, getTodayBookings, getAllHikers, getHistory } from '../../services/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const StatCard = ({ title, value, unit }) => (
  <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
    <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-white mt-2">
      {value}{' '}
      <span className="text-xl font-medium text-gray-400">{unit}</span>
    </p>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    pendingPayments: 0,
    hikersToday: 0,
    totalHikers: 0,
  });
  const [hikerStatusData, setHikerStatusData] = useState(null);
  const [monthlyHistoryData, setMonthlyHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsRes, todayRes, hikersRes, historyRes] = await Promise.all([
          getPendingPayments(),
          getTodayBookings(),
          getAllHikers(),
          getHistory(),
        ]);

        const allHikers = hikersRes.data.data.data;
        const history = historyRes.data.data.data;

        if (!Array.isArray(allHikers) || !Array.isArray(history)) {
          throw new Error("Format data dari API tidak sesuai harapan.");
        }

        setStats({
          pendingPayments: paymentsRes.data.data.length,
          hikersToday: todayRes.data.data.length,
          totalHikers: allHikers.length,
        });
        
        const activeCount = allHikers.filter(p => p.status === 'aktif').length;
        const blacklistCount = allHikers.filter(p => p.status === 'blacklist').length;
        setHikerStatusData({
          labels: ['Aktif', 'Blacklist'],
          datasets: [{
            label: 'Status Pendaki',
            data: [activeCount, blacklistCount],
            backgroundColor: ['#10B981', '#EF4444'],
            borderColor: ['#1F2937', '#1F2937'],
            borderWidth: 2,
          }],
        });

        const monthlyCounts = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

        history.forEach(item => {
          const month = new Date(item.tanggal_pendakian).getMonth();
          monthlyCounts[month] = (monthlyCounts[month] || 0) + item.jumlah_pendaki;
        });
        
        const labels = monthNames;
        const data = labels.map((_, index) => monthlyCounts[index] || 0);

        setMonthlyHistoryData({
          labels,
          datasets: [{
            label: 'Jumlah Pendaki / Bulan',
            data: data,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          }],
        });

      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
        setError("Tidak dapat memuat data statistik.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 bg-red-900/30 p-4 rounded-md">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Pembayaran Menunggu Verifikasi" value={stats.pendingPayments} unit="Transaksi" />
        <StatCard title="Pendaki Check-in Hari Ini" value={stats.hikersToday} unit="Kelompok" />
        <StatCard title="Total Pendaki Terdaftar" value={stats.totalHikers} unit="Orang" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-100">Riwayat Pendaki per Bulan</h3>
          {monthlyHistoryData && <Bar options={{ responsive: true, plugins: { legend: { labels: { color: "#E5E7EB" } }}}} data={monthlyHistoryData} />}
        </div>
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-100">Komposisi Status Pendaki</h3>
          {hikerStatusData && <Doughnut options={{ responsive: true, plugins: { legend: { labels: { color: "#E5E7EB" } }}}} data={hikerStatusData} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
