import React from "react";
import { Form, Button } from "react-bootstrap";

//componente recibe props
const LoanForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  partners,
  isEditing,
}) => {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Monto</Form.Label>
        <Form.Control
          type="number"
          name="amount"
          value={formData.amount}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Tasa de interes</Form.Label>
        <Form.Control
          type="number"
          step="0.01"
          name="interest_rate"
          value={formData.interest_rate}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Duración (meses)</Form.Label>
        <Form.Control
          type="number"
          name="duration"
          value={formData.duration}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Socio</Form.Label>
        <Form.Select
          name="socio_id"
          value={formData.socio_id}
          onChange={onChange}
          required
        >
          <option value="">Selecciona un socio</option>
          {partners.map((partner) => (
            <option key={partner.sid} value={partner.sid}>
              {partner.full_name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <div className="text-end">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          {isEditing ? "Actualizar" : "Agregar"}
        </Button>
      </div>
    </Form>
  );
};

export default LoanForm;
