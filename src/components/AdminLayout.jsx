import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import supabase from "../lib/supabaseClient";

// Sidebar icons
import dashboardIcon from "../assets/icons/dashboard.png";
import approveIcon from "../assets/icons/approve.png";
import membersIcon from "../assets/icons/members.png";
import addIcon from "../assets/icons/add.png";
import attendanceIcon from "../assets/icons/attendance.png";
import paymentIcon from "../assets/icons/payment.png";
import viewPaymentIcon from "../assets/icons/view_payment.png";
import addMeasureIcon from "../assets/icons/add_measure.png";
import viewMeasureIcon from "../assets/icons/view_measure.png";
import createScheduleIcon from "../assets/icons/create_schedule.png";
import viewScheduleIcon from "../assets/icons/view_schedule.png";
import NotificationIcon from "../assets/icons/notifications.png";
import About from "../assets/icons/about.png";
import mng_ex from "../assets/icons/mng_ex.png";

const AdminLayout = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(true); // Collapsed by default
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const SidebarItem = ({ to, icon, label, end = false }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block px-4 py-2 rounded-md text-sm transition ${
          isActive ? "bg-yellow-400 text-black" : "hover:bg-gray-700"
        }`
      }
    >
      {!collapsed ? (
        label
      ) : (
        <img src={icon} alt={label} className="h-5 w-5 mx-auto" />
      )}
    </NavLink>
  );

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
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-yellow-400 hover:text-yellow-300"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? "☰" : "⏪"}
          </button>
        </div>

        <nav className="flex-1 mt-4 space-y-2 px-2">
          <SidebarItem to="/admin/dashboard" icon={dashboardIcon} label="Dashboard Home" />
          <SidebarItem to="/admin/approve-members" icon={approveIcon} label="Approve Members" />
          <SidebarItem to="/admin/view-members" icon={membersIcon} label="View Members" />
          <SidebarItem to="/admin/add-member-no-email" icon={addIcon} label="Add Member (No Email)" />
          <SidebarItem to="/admin/attendance" icon={attendanceIcon} label="Attendance" />
          <SidebarItem to="/admin/payments" end icon={paymentIcon} label="Add Payment" />
          <SidebarItem to="/admin/payments/view" icon={viewPaymentIcon} label="View Payment" />
          <SidebarItem to="/admin/measurements/add" icon={addMeasureIcon} label="Add Measurements" />
          <SidebarItem to="/admin/measurements/view" icon={viewMeasureIcon} label="View Measurements" />
          <SidebarItem to="/admin/schedule/add" icon={createScheduleIcon} label="Create Schedule" />
          <SidebarItem to="/admin/schedule/view" icon={viewScheduleIcon} label="View Schedules" />
          <SidebarItem to="/admin/notifications" icon={NotificationIcon} label="Notofications" />
          <SidebarItem to="/admin/manage_ex" icon={mng_ex} label="Manage Exercises" />
          <SidebarItem to="/admin/about" icon={About} label="About App" />
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
