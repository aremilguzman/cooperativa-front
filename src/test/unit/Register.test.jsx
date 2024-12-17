import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Proporciona el contexto del router
import { AuthProvider } from "../../context/AuthContext";
import Register from "../../components/auth/Register";
import api from "../../api/api";

jest.mock("../../api/api"); // Mockear la API

describe("Register Component", () => {
  it("renders the registration form", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </MemoryRouter>
    );

    // Verificar que los campos del formulario se renderizan
    expect(screen.getByPlaceholderText("Ingresar nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingresar correo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ingresar contraseña")).toBeInTheDocument();
    expect(screen.getByText("Registrarse")).toBeInTheDocument();
  });

  it("handles successful registration", async () => {
    // Simula la respuesta exitosa de la API
    api.post.mockResolvedValueOnce({
      data: { ok: true, msg: "User registered successfully" },
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </MemoryRouter>
    );

    // Rellenar los campos del formulario
    fireEvent.change(screen.getByPlaceholderText("Ingresar nombre"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresar correo"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresar contraseña"), {
      target: { value: "password123" },
    });

    // Simula el clic en el botón de registro
    fireEvent.click(screen.getByText("Registrarse"));

    // Verificar que se llama a la API con los datos correctos
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/users/register", {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
    });

    // Verificar que no se muestran errores
    expect(
      screen.queryByText("Ocurrió un error inesperado.")
    ).not.toBeInTheDocument();
  });

  it("handles API errors on registration", async () => {
    // Simula una respuesta de error desde la API
    api.post.mockRejectedValueOnce({
      response: {
        data: { errors: ["El email ya existe.", "Contraseña muy corta."] },
      },
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </MemoryRouter>
    );

    // Rellenar los campos del formulario
    fireEvent.change(screen.getByPlaceholderText("Ingresar nombre"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresar correo"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresar contraseña"), {
      target: { value: "pass" },
    });

    // Simula el clic en el botón de registro
    fireEvent.click(screen.getByText("Registrarse"));

    // Verificar que se muestran los errores
    await waitFor(() => {
      expect(screen.getByText("El email ya existe.")).toBeInTheDocument();
      expect(screen.getByText("Contraseña muy corta.")).toBeInTheDocument();
    });
  });
});