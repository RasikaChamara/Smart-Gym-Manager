import { NavLink, Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          <img src={logo} alt="Gym Logo" className="h-12 w-12 mr-2" />
        </div>
        <nav className="flex-1 mt-4 space-y-2 px-4">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? 'bg-yellow-400 text-black' : 'hover:bg-gray-700'
              }`
            }
          >
            Dashboard Home
          </NavLink>

          {/* Add more links here as you build more features */}
          {/* Example:
          <NavLink to="/admin/members" className="...">Manage Members</NavLink>
          */}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-20 px-6 flex items-center justify-between border-b border-gray-800 bg-black shadow-md">
          <h1 className="text-2xl font-bold tracking-wide uppercase">
            Eagles Fitness <span className="text-yellow-400">Centre</span>
          </h1>
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
