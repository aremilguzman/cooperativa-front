import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PartnersTable from "../../components/partners/PartnersTable";
import { MemoryRouter } from "react-router-dom";

describe("PartnersTable Component", () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const partners = [
    { sid: 1, full_name: "John Doe", phone: "123456789" },
    { sid: 2, full_name: "Jane Doe", phone: "987654321" },
  ];

  it("renders partners in the table", () => {
    render(
      <MemoryRouter>
        <PartnersTable
          partners={partners}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          currentUser={{ role_id: 1 }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    render(
      <MemoryRouter>
        <PartnersTable
          partners={partners}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          currentUser={{ role_id: 1 }}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("edit-button-1"));
    expect(mockOnEdit).toHaveBeenCalledWith(partners[0]);
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <MemoryRouter>
        <PartnersTable
          partners={partners}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          currentUser={{ role_id: 1 }}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("delete-button-1")); // Buscar por data-testid
    expect(mockOnDelete).toHaveBeenCalledWith(partners[0].sid);
  });

  it("does not render delete button for non-admin users", () => {
    render(
      <MemoryRouter>
        <PartnersTable
          partners={partners}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          currentUser={{ role_id: 2 }} // Usuario no administrador
        />
      </MemoryRouter>
    );

    const deleteButtons = screen.queryAllByTestId(/delete-button/i);
    expect(deleteButtons.length).toBe(0);
  });
});
