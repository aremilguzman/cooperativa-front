import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Importa MemoryRouter
import { AuthProvider } from "../../context/AuthContext";
import Login from "../../components/auth/Login";
import api from "../../api/api";

jest.mock("../../api/api"); // Simula las llamadas a la API

describe("Login Component", () => {
  it("renders login form and handles success", async () => {
    // Simula la respuesta de la API
    api.post.mockResolvedValueOnce({
      data: {
        msg: {
          token: "fake-token",
          role_id: 1,
          username: "testuser",
        },
      },
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    // Simula entrada de datos en el formulario
    fireEvent.change(screen.getByPlaceholderText("Enter your Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Password"), {
      target: { value: "password123" },
    });

    // Simula clic en el botón de Login
    fireEvent.click(screen.getByText("Login"));

    // Verifica el comportamiento esperado
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/users/login", {
        email: "test@example.com",
        password: "password123",
      });
      expect(localStorage.getItem("currentUser")).not.toBeNull();
    });
  });
});