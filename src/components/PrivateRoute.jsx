import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute() {
  const { currentUser } = useAuth();

  // Si el usuario está autenticado, renderiza el componente hijo (Outlet),
  // de lo contrario redirige a /login.
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
