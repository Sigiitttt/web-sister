import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Notifikasi hilang setelah 5 detik

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const baseClasses = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white z-50 flex justify-between items-center';
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type] || 'bg-gray-500'}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold">X</button>
    </div>
  );
};

export default Notification;
