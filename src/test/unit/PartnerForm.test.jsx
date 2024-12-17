import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PartnerForm from "../../components/partners/PartnerForm";

describe("PartnerForm Component", () => {
  const mockOnSubmit = jest.fn();
  const mockOnChange = jest.fn();
  const mockOnCancel = jest.fn();

  const formData = {
    full_name: "John Doe",
    email: "john@example.com",
    phone: "123456789",
    address: "123 Main St",
  };

  it("calls onSubmit when the form is submitted", () => {
    render(
      <PartnerForm
        formData={formData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEditing={false}
      />
    );

    fireEvent.submit(screen.getByRole("form"));
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("calls onCancel when the cancel button is clicked", () => {
    render(
      <PartnerForm
        formData={formData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEditing={false}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("calls onChange when inputs are modified", () => {
    render(
      <PartnerForm
        formData={formData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEditing={false}
      />
    );

    fireEvent.change(screen.getByLabelText("Nombre Completo"), {
      target: { value: "Jane Doe" },
    });
    expect(mockOnChange).toHaveBeenCalled();
  });
});
