import React from "react";
import { Form, Button } from "react-bootstrap";

//componente recibe props
const TrackingForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  loans,
  isEditing,
}) => {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Fecha</Form.Label>
        <Form.Control
          type="date"
          name="t_date"
          value={formData.t_date}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Estado</Form.Label>
        <Form.Select name="status" value={formData.status} onChange={onChange}>
          <option value="">Seleccionar estado (opcional)</option>
          <option value="pendiente">pendiente</option>
          <option value="en proceso">en proceso</option>
          <option value="finalizado">finalizado</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Nota</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="notas"
          value={formData.notas}
          onChange={onChange}
        />
      </Form.Group>
      {!isEditing && (
        <Form.Group className="mb-3">
          <Form.Label>Prestamo</Form.Label>
          <Form.Select
            name="prestamo_id"
            value={formData.prestamo_id}
            onChange={onChange}
            required
          >
            <option value="">Selecionar prestamo asociado</option>
            {loans.map((loan) => (
              <option key={loan.pid} value={loan.pid}>
                ID: {loan.pid} - Monto: ${loan.amount}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}
      <div className="text-end">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {isEditing ? "Actualizar" : "Agregar"}
        </Button>
      </div>
    </Form>
  );
};

export default TrackingForm;
