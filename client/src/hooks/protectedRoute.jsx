import { Navigate, Outlet } from 'react-router-dom';
import useAuth from './useAuth';

const ProtectedRoute = () => {
    const { loading, loggedIn } = useAuth();

    if (loading) return <div>Loading...</div>;

    return loggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;