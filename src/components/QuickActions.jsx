import React from "react";
import { useNavigate } from "react-router-dom";

// Reusing your icons
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

const quickActions = [
  { icon: dashboardIcon, label: "Dashboard", path: "/admin/dashboard" },
  { icon: approveIcon, label: "Approve", path: "/admin/approve-members" },
  { icon: membersIcon, label: "Members", path: "/admin/view-members" },
  { icon: addIcon, label: "Add Member", path: "/admin/add-member-no-email" },
  { icon: attendanceIcon, label: "Attendance", path: "/admin/attendance" },
  { icon: paymentIcon, label: "Add Payment", path: "/admin/payments" },
  { icon: viewPaymentIcon, label: "View Payment", path: "/admin/payments/view" },
  { icon: addMeasureIcon, label: "Add Measure", path: "/admin/measurements/add" },
  { icon: viewMeasureIcon, label: "View Measure", path: "/admin/measurements/view" },
  { icon: createScheduleIcon, label: "Create Schedule", path: "/admin/schedule/add" },
  { icon: viewScheduleIcon, label: "View Schedules", path: "/admin/schedule/view" },
  { icon: NotificationIcon, label: "Notifications", path: "/admin/notifications" },
  { icon: mng_ex, label: "Manage Exercises", path: "/admin/manage_ex" },
  { icon: About, label: "About", path: "/admin/about" },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-yellow-400 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center justify-center p-3 bg-gray-900 hover:bg-yellow-400 hover:text-black rounded-lg transition text-sm"
          >
            <img src={action.icon} alt={action.label} className="h-6 w-6 mb-1" />
            <span className="text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
