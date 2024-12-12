import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

function PartnerDetail() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/partners/${id}`);
        if (response.data && response.data.msg) {
          setPartner(response.data.msg);
        } else {
          setError('Partner data not found');
        }
      } catch (error) {
        setError('Failed to fetch partner details: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!partner) {
    return <Alert variant="warning">No partner data available.</Alert>;
  }

  return (
    <div style={{
      backgroundColor: "#dfdfdf", // Cambia este color al que desees
      minHeight: "100vh",
    }}
    className="d-flex justify-content-center align-items-center">
    <div className="container-sm mt-4">
      <Card className="shadow-lg border-0 rounded-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div className="bg-light rounded-circle p-3">
              <div className="fw-bold text-center">ID</div>
              <div className="text-center">{partner.sid}</div>
            </div>
            <div className="text-end">
              <div className="text-muted small">Created At</div>
              <div className="fw-bold">{new Date(partner.created_at).toLocaleDateString()}</div>
            </div>
          </div>

          <Row className="g-4">
            <Col md={6}>
              <div className="mb-3">
                <div className="text-muted small">Full Name</div>
                <div className="fw-bold">{partner.full_name}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Email</div>
                <div className="fw-bold">{partner.email}</div>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <div className="text-muted small">Phone</div>
                <div className="fw-bold">{partner.phone}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Address</div>
                <div className="fw-bold">{partner.address}</div>
              </div>
            </Col>
          </Row>

          <div className="mt-4 d-flex gap-2">
            <Link to="/dashboard">
              <Button variant="dark">
                <FaArrowLeft className="me-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
    </div>
  );
}

export default PartnerDetail;