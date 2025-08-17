import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function MemberTopbar() {
  const navigate = useNavigate();

  const firstName = localStorage.getItem("firstName") || "Member";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/member/profile");
  };

  return (
    <div className="h-16 bg-black flex items-center justify-between px-4 border-b border-yellow-400">
      {/* Logo + Gym name */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Gym Logo" className="h-10 w-10" />
        <span className="text-yellow-400 font-bold">Eagles Fitness Centre</span>
      </div>

      {/* Member name + Logout */}
      <div className="flex items-center gap-4">
        <button
          onClick={goToProfile}
          className="text-white font-semibold hover:underline"
        >
          {firstName}
        </button>
        <button
          onClick={handleLogout}
          className="bg-yellow-400 text-black px-3 py-1 rounded-md font-semibold hover:bg-yellow-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
