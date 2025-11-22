import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // PERBAIKAN: Mengubah ke tema terang agar serasi
    <footer className="bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Booking Online Pendakian Penanggungan.
          </p>
          <div className="text-sm text-slate-500">
            {/* Tautan Login Admin dengan gaya yang disesuaikan */}
            <Link to="/admin/login" className="hover:text-cyan-500 font-semibold transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

