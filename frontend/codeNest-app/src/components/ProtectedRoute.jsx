import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.role || user.role.trim() === "") {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
