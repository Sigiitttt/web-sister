import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Copy, Printer, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const SopPage = () => {
    const [openSection, setOpenSection] = useState('pendaftaran'); // Buka section pertama secara default

    const sections = [
        {
            id: 'pendaftaran',
            title: 'A. Pendaftaran & Administrasi',
            points: [
                'Wajib Booking Online: Semua pendaki diwajibkan melakukan pendaftaran melalui situs web resmi. Pendaftaran di tempat tidak dilayani.',
                'Identitas Valid: Setiap pendaki wajib mendaftarkan diri dengan identitas sah (KTP/SIM/Kartu Pelajar).',
                'Pembayaran Lunas: Booking dianggap sah hanya setelah pembayaran diverifikasi oleh admin.',
                'Satu Booking, Satu Rombongan: Kode booking berlaku untuk satu rombongan sesuai data yang didaftarkan.',
                'Batas Usia: Pendaki di bawah umur 17 tahun wajib didampingi oleh orang tua atau wali.'
            ]
        },
        {
            id: 'perlengkapan',
            title: 'B. Perlengkapan & Keselamatan',
            points: [
                'Perlengkapan Standar: Setiap pendaki wajib membawa perlengkapan dasar seperti tenda, jaket, lampu, dan P3K.',
                'Kesehatan: Pendaki harus dalam kondisi fisik dan mental sehat.',
                'Lapor Petugas: Rombongan wajib check-in dan check-out di pos perizinan.',
                'Dilarang Mendaki Sendiri: Minimal pendakian adalah 2 orang.'
            ]
        },
        {
            id: 'etika',
            title: 'C. Etika & Kelestarian Lingkungan',
            points: [
                'Bawa Turun Sampahmu: Semua sampah wajib dibawa turun kembali.',
                'Dilarang Membuat Api Unggun: Untuk mencegah kebakaran hutan.',
                'Gunakan Jalur Resmi: Hindari membuka jalur baru.',
                'Lindungi Flora & Fauna: Jangan merusak tanaman atau mengganggu satwa.',
                'Jaga Sopan Santun: Hormati adat dan sesama pendaki.',
                'Tanpa Vandalisme: Dilarang mencoret-coret fasilitas alam.'
            ]
        },
        {
            id: 'sanksi',
            title: 'D. Sanksi Pelanggaran',
            points: [
                'Sanksi tegas diberlakukan berupa peringatan, denda, hingga daftar hitam pendakian.',
                'Pihak pengelola tidak bertanggung jawab atas kelalaian pendaki.'
            ]
        }
    ];

    const toggleSection = (id) => {
        setOpenSection(openSection === id ? null : id);
    };

    const copyToClipboard = () => {
        const textToCopy = sections.map(s => `${s.title}\n${s.points.map(p => `- ${p}`).join('\n')}`).join('\n\n');
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert('SOP disalin ke clipboard');
        } catch (err) {
            alert('Gagal menyalin SOP');
        }
        document.body.removeChild(textArea);
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* --- Kolom Kiri: Visual & Aksi --- */}
                <aside className="lg:col-span-1 lg:sticky top-24 h-fit">
                    <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                        <div className="flex justify-center mb-4">
                            <ShieldCheck className="w-16 h-16 text-cyan-500" strokeWidth={1.5}/>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Prosedur Wajib Pendakian</h1>
                        <p className="mt-3 text-slate-500">
                            Patuhi semua aturan demi keselamatan Anda dan kelestarian alam.
                        </p>
                        <div className="flex flex-col gap-3 mt-6">
                            <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                                <Printer className="w-4 h-4" /> Cetak SOP
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors"
                            >
                                <Copy className="w-4 h-4" /> Salin Teks
                            </button>
                        </div>
                    </div>
                </aside>

                {/* --- Kolom Kanan: Accordion SOP --- */}
                <main className="lg:col-span-2 space-y-4">
                    {sections.map((section) => (
                        <motion.div
                            key={section.id}
                            layout
                            className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full flex justify-between items-center px-6 py-4 text-left"
                            >
                                <span className={`text-lg font-bold ${openSection === section.id ? 'text-cyan-600' : 'text-slate-800'}`}>{section.title}</span>
                                <motion.div animate={{ rotate: openSection === section.id ? 180 : 0 }} className="text-cyan-500">
                                    <ChevronDown className="w-5 h-5" />
                                </motion.div>
                            </button>

                            <motion.div
                                initial={false}
                                animate={{ height: openSection === section.id ? 'auto' : 0, opacity: openSection === section.id ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 pb-6 pt-2 space-y-3">
                                    {section.points.map((p, i) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <div className="w-2 h-2 rounded-full bg-cyan-500 mt-[9px] flex-shrink-0"></div>
                                            <p className="text-slate-600 leading-relaxed">{p}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </main>
            </div>
        </div>
    );
}

export default SopPage;

