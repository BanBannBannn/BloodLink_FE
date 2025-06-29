import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const getDashboardPath = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "/admin/admin-dashboard";
    case "NURSE":
      return "/nurse/nurse-dashboard";
    case "MEMBER":
      return "/";
    default:
      return "/unauthorized";
  }
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-red-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.roleName)) {
    return <Navigate to={getDashboardPath(user.roleName)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
