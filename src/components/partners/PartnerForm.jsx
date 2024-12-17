import React from "react";
import { Form, Button } from "react-bootstrap";

//Componente para agregar socios
const PartnerForm = ({ formData, onChange, onSubmit, onCancel, isEditing }) => {
  return (
    <Form onSubmit={onSubmit} role="form">
      <Form.Group className="mb-3">
        <Form.Label htmlFor="full_name">Nombre Completo</Form.Label>
        <Form.Control
          id="full_name"
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="email">Correo Electrónico</Form.Label>
        <Form.Control
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="phone">Teléfono</Form.Label>
        <Form.Control
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="address">Dirección</Form.Label>
        <Form.Control
          id="address"
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
