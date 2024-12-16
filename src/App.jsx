import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import PartnerDetail from "./pages/details/PartnerDetail";
import LoanDetail from "./pages/details/LoanDetail";
import TrackingDetail from "./pages/details/TrackingDetail";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
      <Router>
    <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Ruta protegida */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/partners/:id" element={<PartnerDetail />} />
            <Route path="/loans/:id" element={<LoanDetail />} />
            <Route path="/trackings/:id" element={<TrackingDetail />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    </AuthProvider>
      </Router>
  );
}

export default App;
