import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  min
}) => {
  return (
    <div className="w-full">
      {label && (
        // PERBAIKAN: Menyesuaikan warna dengan palet slate
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">
          {label}
        </label>
      )}
      {/* PERBAIKAN: Menyesuaikan warna border, placeholder, dan focus ring */}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className={`mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm ${className}`}
      />
    </div>
  );
};

export default Input;

