// src/components/ui/button.jsx
import React from "react";

export const Button = ({ children, onClick, className = "", type = "button", ...rest }) => (
  <button
    onClick={onClick}
    type={type}
    className={`bg-[#FFD700]-600 hover:bg-blue-700 text-black font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 ${className}`}
    {...rest}
  >
    {children}
  </button>
);
