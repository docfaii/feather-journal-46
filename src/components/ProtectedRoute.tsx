import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, isGuestMode } = useAuth();

  if (loading) {
    // Return a loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-2 w-24 bg-muted-foreground/30 rounded mb-2 mx-auto"></div>
          <div className="h-2 w-16 bg-muted-foreground/30 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isGuestMode) {
    // Redirect to landing page if not authenticated and not in guest mode
    return <Navigate to="/landing" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
