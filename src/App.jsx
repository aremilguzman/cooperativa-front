import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import PartnerDetail from "./components/PartnerDetail";
import LoanDetail from "./components/LoanDetail";
import TrackingDetail from "./components/TrackingDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
