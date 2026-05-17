import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="full-loader"><div className="spinner" /><p>Loading...</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="full-loader"><div className="spinner" /><p>Verifying admin...</p></div>;
  if (!user || !isAdmin) return <Navigate to="/home" replace />;
  return children;
}

export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="full-loader"><div className="spinner" /></div>;
  if (user) return <Navigate to="/home" replace />;
  return children;
}
