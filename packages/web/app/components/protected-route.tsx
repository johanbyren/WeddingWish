import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '~/context/auth';

export const ProtectedRoute = () => {
  const { user, loaded } = useAuth();

  if (!user && loaded) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};
