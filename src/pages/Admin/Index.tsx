
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import Login from "./Login";

export default function AdminIndex() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Login />;
}
