import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingState } from "./States";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]"><LoadingState label="Loading session..." /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
