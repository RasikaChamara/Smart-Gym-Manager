import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import supabase from "../lib/supabaseClient";

const AdminLayout = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 transition-all duration-300 ${
          collapsed ? "w-20" : "w-60"
        } flex flex-col`}
      >
        <div className="h-20 flex items-center justify-between px-4 border-b border-gray-800">
          <img src={logo} alt="Gym Logo" className="h-10 w-10" />
          {!collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-yellow-400 hover:text-yellow-300"
              title="Collapse"
            >
              ⏪
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-yellow-400 hover:text-yellow-300"
              title="Expand"
            >
              ☰
            </button>
          )}
        </div>

        <nav className="flex-1 mt-4 space-y-2 px-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm transition ${
                isActive ? "bg-yellow-400 text-black" : "hover:bg-gray-700"
              }`
            }
          >
            {!collapsed ? "Dashboard Home" : "🏠"}
          </NavLink>

          <NavLink
            to="/admin/approve-members"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm transition ${
                isActive ? "bg-yellow-400 text-black" : "hover:bg-gray-700"
              }`
            }
          >
            {!collapsed ? "Approve Members" : "✅"}
          </NavLink>

          <NavLink
            to="/admin/payments"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm transition ${
                isActive ? "bg-yellow-400 text-black" : "hover:bg-gray-700"
              }`
            }
          >
            {!collapsed ? "Add Payment" : "💳"}
          </NavLink>

          <NavLink
            to="/admin/attendance"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md text-sm transition ${
                isActive ? "bg-yellow-400 text-black" : "hover:bg-gray-700"
              }`
            }
          >
            {!collapsed ? "Attendance" : "📋"}
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-20 px-6 flex items-center justify-between border-b border-gray-800 bg-black shadow-md">
          <h1 className="text-xl font-bold uppercase tracking-wide">
            Eagles Fitness <span className="text-yellow-400">Centre</span>
          </h1>

          <div className="flex items-center gap-4 text-sm">
            {user && <span className="text-gray-400">{user.email}</span>}
            <button
              onClick={handleLogout}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md text-sm font-semibold"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
