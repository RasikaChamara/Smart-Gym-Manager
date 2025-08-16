// src/components/MemberNavbar.jsx
import { NavLink } from "react-router-dom";
import homeIcon from "../assets/icons/dashboard.png";
import scheduleIcon from "../assets/icons/view_schedule.png";
import workoutIcon from "../assets/icons/view_measure.png";
import paymentsIcon from "../assets/icons/payment.png";

export default function MemberNavbar() {
  const links = [
    { to: "/member", icon: homeIcon, label: "Home" },
    { to: "/member/schedule", icon: scheduleIcon, label: "Schedule" },
    { to: "/member/workouts", icon: workoutIcon, label: "Workouts" },
    { to: "/member/payments", icon: paymentsIcon, label: "Payments" },
  ];

  return (
    <nav className="h-16 bg-black border-t border-yellow-400 flex justify-around items-center">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex flex-col items-center text-sm ${
              isActive ? "text-yellow-400" : "text-gray-400"
            }`
          }
        >
          <img src={link.icon} alt={link.label} className="h-6 w-6" />
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
