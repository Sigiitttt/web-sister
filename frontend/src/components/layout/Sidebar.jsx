import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem('authToken');
      navigate('/admin/login');
    }
  };

  const navLinkClasses = ({ isActive }) =>
    isActive
      ? 'flex items-center px-4 py-2 mt-2 text-gray-100 bg-gray-700 rounded-md'
      : 'flex items-center px-4 py-2 mt-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-gray-100';

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-800 border-r rtl:border-r-0 rtl:border-l">
      <h2 className="text-3xl font-semibold text-center text-white">Admin Panel</h2>
      
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          <NavLink to="/admin/dashboard" className={navLinkClasses}>
            <span className="mx-4 font-medium">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/verifikasi" className={navLinkClasses}>
            <span className="mx-4 font-medium">Verifikasi Pembayaran</span>
          </NavLink>
          <NavLink to="/admin/operasional" className={navLinkClasses}>
            <span className="mx-4 font-medium">Operasional Harian</span>
          </NavLink>
          {/* --- PERBAIKAN: Tautan Baru Ditambahkan --- */}
          <NavLink to="/admin/kuota" className={navLinkClasses}>
            <span className="mx-4 font-medium">Manajemen Kuota</span>
          </NavLink>
          <NavLink to="/admin/blacklist" className={navLinkClasses}>
            <span className="mx-4 font-medium">Manajemen Blacklist</span>
          </NavLink>
        </nav>

        <div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 mt-2 text-gray-400 rounded-md hover:bg-red-800 hover:text-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="mx-4 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
