import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${parsedUser.token}`;
    }

    // Interceptor para manejar el error 401
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 400)
        ) {
          console.log("Token expirado o inválido. Redirigiendo al login...");
          logout();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
    setLoading(false);

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/users/login", { email, password });
      const { token, role_id, username } = response.data.msg;

      const user = { token, role_id, username };
      localStorage.setItem("currentUser", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setCurrentUser(user);

      return response.data;
    } catch (error) {
      // Verifica si el backend devuelve 'errors' como array
      if (error.response && Array.isArray(error.response.data.errors)) {
        throw error.response.data.errors;
      } else if (error.response && error.response.data.error) {
        // Manejo especial para el mensaje "Contraseña incorrecta"
        throw [error.response.data.error];
      } else {
        throw ["Ocurrió un error inesperado."];
      }
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post("/users/register", {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    delete axios.defaults.headers.common["Authorization"];
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
