import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a spinner

  // not logged in -> go to login, keep "from" for redirect back
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  // role-gated route (e.g., admin only)
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}
