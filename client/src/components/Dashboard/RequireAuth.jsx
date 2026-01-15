import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader className="min-h-[50vh]" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
