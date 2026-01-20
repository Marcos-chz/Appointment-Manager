import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/signIn" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
