import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'danger'
  disabled = false,
  className = '',
}) => {
  // --- PERBAIKAN: Penyesuaian gaya dasar agar lebih modern ---
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform';

  // --- PERBAIKAN: Palet warna disesuaikan dengan tema cyan ---
  const variantClasses = {
    primary: 'bg-cyan-500 text-white hover:bg-cyan-600 focus:ring-cyan-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-105',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

