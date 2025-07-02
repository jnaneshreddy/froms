import React from 'react';

const Button = ({ children, text, onClick, className, disabled = false, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-white rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children || text}
    </button>
  );
};

export default Button;
