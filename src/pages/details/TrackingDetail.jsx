import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaMoneyBill } from 'react-icons/fa';
import api from '../../api/api';

function TrackingDetail() {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/trackings/${id}`);
        if (response.data && response.data.msg) {
          setTracking(response.data.msg);
        } else {
          setError('Tracking data not found');
        }
      } catch (error) {
        setError('Failed to fetch tracking details: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
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

  if (!tracking) {
    return <Alert variant="warning">No tracking data available.</Alert>;
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
              <div className="text-center">{tracking.tid}</div>
            </div>
            <div className="text-end">
              <div className="text-muted small">Created At</div>
              <div className="fw-bold">{new Date(tracking.created_at).toLocaleDateString()}</div>
            </div>
          </div>

          <Row className="g-4">
            <Col md={6}>
              <div className="mb-3">
                <div className="text-muted small">Date</div>
                <div className="fw-bold">{new Date(tracking.t_date).toLocaleDateString()}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Status</div>
                <div className="fw-bold">{tracking.status}</div>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <div className="text-muted small">Loan Amount</div>
                <div className="fw-bold">${tracking.prestamo_monto}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small">Notes</div>
                <div className="fw-bold">{tracking.notas || 'N/A'}</div>
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
            <Link to={`/loans/${tracking.prestamo_id}`}>
              <Button variant="success">
                <FaMoneyBill className="me-2" />
                View Loan
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
    </div>

  );
}

export default TrackingDetail;