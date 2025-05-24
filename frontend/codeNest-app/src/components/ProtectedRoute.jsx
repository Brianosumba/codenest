import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.role || user.role.trim() === "") {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
