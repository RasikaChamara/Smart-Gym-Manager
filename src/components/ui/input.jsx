// src/components/ui/input.jsx
import React from "react";

export const Input = ({ label, value, onChange, placeholder, type = "text", className = "", ...rest }) => (
  <div className="mb-3 w-full">
    {label && <label className="block text-sm font-medium mb-1">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...rest}
    />
  </div>
);
