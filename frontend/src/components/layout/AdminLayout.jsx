// src/components/layout/AdminLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Wrapper agar konten rapih */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-800">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
