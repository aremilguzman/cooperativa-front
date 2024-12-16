import React from "react";
import { Form, Button } from "react-bootstrap";

//Componente para agregar socios
const PartnerForm = ({ formData, onChange, onSubmit, onCancel, isEditing }) => {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nombre Completo</Form.Label>
        <Form.Control
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Correo Electrónico</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Dirección</Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={formData.address}
          onChange={onChange}
          required
        />
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

export default PartnerForm;
