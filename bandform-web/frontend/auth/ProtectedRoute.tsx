import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export default function ProtectedRoute({ adminOnly }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
