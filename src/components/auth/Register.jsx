import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Card, Alert } from "react-bootstrap";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      await register(username, email, password);
      navigate("/login");
    } catch (error) {
      
      if (error.errors) {
        setErrors(error.errors); 
      } else {
        setErrors(["Ocurrió un error inesperado."]); 
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Card className="shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <Card.Body className="p-4">
          <h4 className="text-center mb-4">REGISTRARSE</h4>
          {errors.length > 0 && (
            <Alert variant="danger">
              <ul className="mb-0">
                {errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresar nombre"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresar correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Contraseña:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresar contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mb-3">
              Registrarse
            </Button>
            <div className="text-center">
              <div className="mb-2">Ya tienes una cuenta?</div>
              <Link to="/login">
                <Button variant="link" className="w-100">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Register;
