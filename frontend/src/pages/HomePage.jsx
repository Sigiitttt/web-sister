import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSop, getWeather } from '../services/api';

// --- Komponen Ikon SVG (Tema Cyan) ---
const ServiceIcon = ({ children }) => (
    <div className="bg-cyan-100 text-cyan-600 rounded-lg p-3 inline-flex mb-4 transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white">
        {children}
    </div>
);
const CalendarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const UsersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>);
const ClipboardListIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>);
const BookOpenIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);

// --- Kartu Galeri ---
const GalleryCard = ({ image, title, location }) => (
    <div className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative">
        <img src={image} alt={title} className="w-full h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm opacity-80">{location}</p>
        </div>
    </div>
);

// --- Kartu Layanan (sebagai Link) ---
const ServiceCardLink = ({ to, icon, title, children }) => (
    <Link to={to} className="block text-center p-6 bg-slate-50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group">
        <ServiceIcon>{icon}</ServiceIcon>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-slate-500 mt-2">{children}</p>
    </Link>
);

const HomePage = () => {
    const [sopData, setSopData] = useState([]);
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [sopResponse, weatherResponse] = await Promise.all([getSop(), getWeather()]);
                setSopData(sopResponse.data.data);
                setWeatherData(weatherResponse.data.data);
            } catch (err) {
                setError("Gagal memuat data dari server. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-white">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-cyan-500"></div>
        </div>
    );
    if (error) return <div className="p-4"><div className="text-center text-red-700 bg-red-100 p-4 rounded-lg">{error}</div></div>;

    return (
        <div className="bg-white text-slate-800">
            {/* --- Section 1: Hero Full Screen --- */}
            <section
                className="relative flex items-center justify-center min-h-screen text-center text-white bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599661443834-1c09a8a7a036?q=80&w=2070&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 p-4 flex flex-col items-center">
                    <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight drop-shadow-lg max-w-4xl">
                        Jelajahi Puncak <span className="text-cyan-400">Penanggungan</span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl mx-auto">
                        Gerbang digital untuk merencanakan pendakian yang aman dan tak terlupakan.
                    </p>
                </div>
            </section>

            {/* --- Section 2: Galeri Gambar --- */}
            <section className="py-16 lg:py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Jelajahi Keindahan Gunung Penanggungan</h2>
                        <p className="text-slate-500 mt-2">Lihat beberapa pemandangan menakjubkan yang menanti Anda di puncak.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <GalleryCard image="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop" title="Puncak Pawitra" location="Penanggungan, Jawa Timur" />
                        <GalleryCard image="https://images.unsplash.com/photo-1542224562-e28de8f867b3?q=80&w=2071&auto=format&fit=crop" title="Jalur Pendakian" location="Via Tamiajeng" />
                        <GalleryCard image="https://images.unsplash.com/photo-1605647540924-852290f6b0d5?q=80&w=2070&auto=format&fit=crop" title="Pemandangan Matahari Terbit" location="Pos 4" />
                    </div>
                </div>
            </section>

            {/* --- Section 3: Layanan & Informasi --- */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Semua yang Anda Butuhkan</h2>
                        <p className="text-slate-500 mt-2">Informasi penting sebelum memulai pendakian.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Kolom Kiri: Layanan/Fitur (Sekarang menjadi Link) */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <ServiceCardLink to="/cek-kuota" icon={<UsersIcon />} title="Cek Kuota Real-time">
                                Lihat ketersediaan kuota pendakian secara langsung.
                            </ServiceCardLink>
                            <ServiceCardLink to="/booking" icon={<CalendarIcon />} title="Booking Mudah">
                                Daftarkan diri dan kelompok Anda hanya dalam beberapa langkah.
                            </ServiceCardLink>
                            <ServiceCardLink to="/SopPage" icon={<ClipboardListIcon />} title="SOP Jelas">
                                Pelajari semua aturan wajib untuk pendakian yang aman.
                            </ServiceCardLink>
                            <ServiceCardLink to="/Panduan" icon={<BookOpenIcon />} title="Panduan Lengkap">
                                Temukan tips dan panduan berguna untuk perjalanan Anda.
                            </ServiceCardLink>
                        </div>

                        {/* Kolom Kanan: Cuaca & SOP */}
                        <div className="lg:col-span-1 space-y-8">
                            {weatherData && (
                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <h3 className="text-2xl font-bold mb-4">Cuaca Saat Ini</h3>
                                    <div className="text-center mb-4">
                                        <p className="text-6xl font-bold text-cyan-500">{weatherData.suhu}</p>
                                        <p className="font-semibold text-slate-600">{weatherData.kondisi}</p>
                                    </div>
                                    <p className="text-sm text-slate-400 text-center">Diperbarui: {new Date(weatherData.timestamp).toLocaleTimeString('id-ID')}</p>
                                </div>
                            )}
                            {sopData.length > 0 && (
                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <h3 className="text-2xl font-bold mb-4">Aturan Penting</h3>
                                    <ul className="space-y-2 text-slate-600 text-sm">
                                        {sopData.slice(0, 3).map((item) => (
                                            <li key={item.id} className="flex items-start gap-2">
                                                <span className="text-cyan-500 mt-1">&#10003;</span>
                                                <span>{item.aturan}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;