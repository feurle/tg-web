import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/authStore';
import { ROUTES } from './routes';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
