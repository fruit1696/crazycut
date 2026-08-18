import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function AdminRoute() {
  const { isAuthenticated, user, authChecked, isLoadingAuth } = useAuth();
  if (isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}