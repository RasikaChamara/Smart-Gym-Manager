// src/components/MemberLayout.jsx
import { Outlet } from "react-router-dom";
import MemberTopbar from "./MemberTopbar";
import MemberNavbar from "./MemberNavbar";

export default function MemberLayout() {
  return (
    <div className="flex flex-col h-screen bg-black text-yellow-400">
      {/* Topbar */}
      <MemberTopbar />

      {/* Page content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <MemberNavbar />
    </div>
  );
}
