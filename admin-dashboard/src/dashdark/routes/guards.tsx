import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import paths from 'routes/paths';
import Splash from 'components/loader/Splash';

/** Redirects unauthenticated users to /authentication/signin */
export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  return user ? <Outlet /> : <Navigate to={paths.signin} replace />;
};

/** Redirects already-authenticated users away from login pages */
export const GuestRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  return !user ? <Outlet /> : <Navigate to="/" replace />;
};
