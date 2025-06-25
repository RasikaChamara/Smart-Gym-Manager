import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // or spinner

  if (!user) return <Navigate to="/" replace />; // not logged in

  if (role !== allowedRole) return <Navigate to="/unauthorized" replace />;

  return <Outlet />; // render child routes
};

export default ProtectedRoute;
