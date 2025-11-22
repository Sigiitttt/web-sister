import React from 'react';

const Card = ({ children, className = '', title }) => {
  return (
    // PERBAIKAN: Menggunakan bayangan (shadow) yang lebih lembut dan sudut yang lebih modern (rounded-xl)
    <div className={`bg-white shadow-md rounded-xl overflow-hidden ${className}`}>
      {title && (
        // PERBAIKAN: Menyesuaikan warna dengan palet slate
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;

