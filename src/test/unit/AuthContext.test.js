import React from "react";
import { render, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Importa MemoryRouter
import { AuthProvider, useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import { jest } from "@jest/globals";

jest.mock("../../api/api");

describe("AuthContext", () => {
  it("should log in a user", async () => {
    const mockUser = {
      token: "fake-token",
      role_id: 1,
      username: "testuser",
    };

    // Simula la respuesta de la API
    api.post.mockResolvedValueOnce({ data: { msg: mockUser } });

    const TestComponent = () => {
      const { login, currentUser } = useAuth();

      return (
        <div>
          <button onClick={() => login("test@example.com", "password123")}>
            Log in
          </button>
          {currentUser && <span data-testid="username">{currentUser.username}</span>}
        </div>
      );
    };

    // Renderiza el componente con MemoryRouter y AuthProvider
    const { getByText, findByTestId } = render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    // Simula el clic del botón
    await act(async () => {
      getByText("Log in").click();
    });

    // Verifica si el usuario se muestra después de iniciar sesión
    const username = await findByTestId("username");
    expect(username).toHaveTextContent("testuser");
  });
});