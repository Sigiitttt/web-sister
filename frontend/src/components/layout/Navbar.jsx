import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from '../ui/Button';

const Navbar = () => {
    // Fungsi untuk styling NavLink yang aktif
    const navLinkClasses = ({ isActive }) =>
        `font-semibold transition-colors duration-300 ${isActive ? 'text-cyan-500' : 'text-slate-600 hover:text-cyan-500'}`;

    return (
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200/80">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="text-3xl font-extrabold text-slate-800">
                        Penanggungan<span className="text-cyan-500">.</span>
                    </Link>

                    {/* Navigasi Desktop */}
                    <nav className="hidden md:flex items-center gap-8">
                        <NavLink to="/" className={navLinkClasses}>
                            Home
                        </NavLink>
                        <NavLink to="/cek-kuota" className={navLinkClasses}>
                            Cek Kuota
                        </NavLink>
                        <NavLink to="/cek-booking" className={navLinkClasses}>
                            Cek Status
                        </NavLink>
                         <NavLink to="/Panduan" className={navLinkClasses}>
                            Panduan
                        </NavLink>
                    </nav>

                    {/* Tombol Aksi Utama */}
                    <div className="hidden md:block">
                        <Link to="/booking">
                            {/* Tombol ini sekarang akan menggunakan gaya 'primary' yang baru */}
                            <Button className="font-bold">
                                Booking Sekarang
                            </Button>
                        </Link>
                    </div>

                    {/* Tombol Menu Mobile (Hamburger) */}
                    <div className="md:hidden">
                        <button className="text-slate-800 p-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

