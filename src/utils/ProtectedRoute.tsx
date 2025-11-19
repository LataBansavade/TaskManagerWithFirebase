import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string;
}) => {
  const { user, isAuthenticating, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner className="w-12 h-12" /> 
      </div>
    );
  }

  if (!isAuthenticating) {
    return <Navigate to="/auth" state={{ from: location.pathname }} />;
  }

  if (!user) {
    return <div>Access Denied. Please log in.</div>;
  }

  if (allowedRoles && user.email !== allowedRoles) {
    return (
      <div>
        <h1>Access Denied. You do not have permission to view this page</h1>
        <Button variant="outline" onClick={() => navigate("/")}>
          Go Back
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;



// a higher-order component (HOC) that ensures only authorized users can 
// access certain routes in your application. It uses authentication and 
// role-based access control to determine whether a user is allowed to
//  view the route.
