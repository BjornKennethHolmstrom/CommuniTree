// src/components/ui/alert.js
import React from 'react';

export const Alert = ({ children, variant = 'default' }) => {
  const baseStyles = 'p-4 mb-4 rounded-md';
  const variantStyles = {
    default: 'bg-blue-100 text-blue-700',
    destructive: 'bg-red-100 text-red-700',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`}>
      {children}
    </div>
  );
};
