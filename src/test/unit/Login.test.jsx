import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import Login from "../../components/auth/Login";
import api from "../../api/api";

jest.mock("../../api/api"); // Mockear la API

describe("Login Component", () => {
  it("renders the login form", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    // Verificar los campos del formulario
    expect(screen.getByPlaceholderText("Ingresar correo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingresar contraseña")).toBeInTheDocument();
    expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    const mockUser = {
      token: "fake-token",
      role_id: 1,
      username: "testuser",
    };

    // Simula la respuesta exitosa de la API
    api.post.mockResolvedValueOnce({ data: { msg: mockUser } });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    // Rellenar los campos del formulario
    fireEvent.change(screen.getByPlaceholderText("Ingresar correo"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresar contraseña"), {
      target: { value: "password123" },
    });

    // Simula el clic en el botón de inicio de sesión
    fireEvent.click(screen.getByText("Iniciar Sesión"));

    // Verificar que se llama a la API con los datos correctos
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/users/login", {
        email: "test@example.com",
        password: "password123",
      });
    });

    // Verificar que no hay errores en pantalla
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("handles API errors on login", async () => {
    // Simula una respuesta de error desde la API
    api.post.mockRejectedValueOnce({
      response: {
        data: { errors: ["Correo o contraseña incorrectos."] },
      },
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    // Rellenar los campos del formulario
    fireEvent.change(screen.getByPlaceholderText("Ingresar correo"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresar contraseña"), {
      target: { value: "wrongpassword" },
    });

    // Simula el clic en el botón de inicio de sesión
    fireEvent.click(screen.getByText("Iniciar Sesión"));

    // Verificar que los errores se muestran en la interfaz
    await waitFor(() => {
      expect(screen.getByText("Correo o contraseña incorrectos.")).toBeInTheDocument();
    });
  });

  it("handles unexpected errors on login", async () => {
    // Simula un error inesperado
    api.post.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    // Rellenar los campos del formulario
    fireEvent.change(screen.getByPlaceholderText("Ingresar correo"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresar contraseña"), {
      target: { value: "password123" },
    });

    // Simula el clic en el botón de inicio de sesión
    fireEvent.click(screen.getByText("Iniciar Sesión"));

    // Verificar que aparece el error inesperado
    await waitFor(() => {
      expect(screen.getByText("Ocurrió un error inesperado.")).toBeInTheDocument();
    });
  });
});