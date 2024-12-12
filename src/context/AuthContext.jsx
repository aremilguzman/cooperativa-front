import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        { email, password }
      );
      const { token, role_id } = response.data.msg;

      const user = { token, role_id };
      localStorage.setItem("currentUser", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setCurrentUser(user);

      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        { username, email, password }
      );
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
