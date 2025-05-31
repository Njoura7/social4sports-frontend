import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return null; // Or a loading spinner

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;