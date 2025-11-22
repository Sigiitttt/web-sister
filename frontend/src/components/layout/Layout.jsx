// src/components/layout/Layout.jsx

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
// 1. Import Outlet dari react-router-dom
import { Outlet } from 'react-router-dom';

// 2. Hapus 'children' dari props
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow ">
        {/* 3. Ganti {children} dengan <Outlet /> */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;