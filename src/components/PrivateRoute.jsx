import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("token"); // hoặc sessionStorage, hoặc context

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
