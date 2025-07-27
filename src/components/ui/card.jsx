// src/components/ui/card.jsx
import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white p-4 rounded-2xl shadow-md w-full ${className}`}>
    {children}
  </div>
);
