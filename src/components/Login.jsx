import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Failed to log in');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Card className="shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body className="p-4">
          <h4 className="text-center mb-4">LOGIN</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button 
              variant="success" 
              type="submit" 
              className="w-100 mb-3"
              style={{ backgroundColor: '#008000' }}
            >
              Login
            </Button>
            <div className="text-center">
              <div className="mb-2">Don't have an Account?</div>
              <Link to="/register">
                <Button 
                  variant="link" 
                  className="w-100"
                  
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;

