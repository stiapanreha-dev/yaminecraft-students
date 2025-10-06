import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Защищённый роут - требует авторизации
 */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-4 py-8">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Роут только для админов
 */
export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  console.log('AdminRoute:', { loading, user: !!user, isAdmin: isAdmin() });

  if (loading) {
    console.log('AdminRoute: showing skeleton');
    return (
      <div className="space-y-4 py-8">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    console.log('AdminRoute: no user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    console.log('AdminRoute: not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoute: rendering children');
  return children;
};
