import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '~/context/auth';

export default function ProtectedRoute() {
  const { loggedIn, loaded } = useAuth();

  if (!loggedIn && loaded) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
