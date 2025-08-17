import React from "react";

export const Card = ({ children, className = "" }) => (
  <div
    className={`
      bg-yellow-500 
      text-black 
      p-6 
      rounded-2xl 
      shadow-md 
      w-full 
      cursor-pointer 
      transition-all 
      duration-300 
      hover:shadow-[0_0_20px_6px_rgba(255,215,0,0.8)] 
      hover:scale-105
      ${className}
    `}
  >
    {children}
  </div>
);
