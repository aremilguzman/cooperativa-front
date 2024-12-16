import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import api from "../../api/api";

function LoanDetail() {
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/loans/${id}`);
        if (response.data && response.data.msg) {
          setLoan(response.data.msg);
        } else {
          setError("Loan data not found");
        }
      } catch (error) {
        setError(
          "Failed to fetch loan details: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
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

  if (!loan) {
    return <Alert variant="warning">No loan data available.</Alert>;
  }

  return (
    <div
      style={{
        backgroundColor: "#dfdfdf", // Cambia este color al que desees
        minHeight: "100vh",
      }}
      className="d-flex justify-content-center align-items-center"
    >
      <div className="container-sm mt-4">
        <Card className="shadow-lg border-0 rounded-4">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div className="bg-light rounded-circle p-3">
                <div className="fw-bold text-center">ID</div>
                <div className="text-center">{loan.pid}</div>
              </div>
              <div className="text-end">
                <div className="text-muted small">Created At</div>
                <div className="fw-bold">
                  {new Date(loan.fecha_creacion).toLocaleDateString()}
                </div>
              </div>
            </div>

            <Row className="g-4">
              <Col md={6}>
                <div className="mb-3">
                  <div className="text-muted small">Partner Name</div>
                  <div className="fw-bold">{loan.socio_nombre}</div>
                </div>
                <div className="mb-3">
                  <div className="text-muted small">Amount</div>
                  <div className="fw-bold">${loan.amount}</div>
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <div className="text-muted small">Interest Rate</div>
                  <div className="fw-bold">{loan.interest_rate}%</div>
                </div>
                <div className="mb-3">
                  <div className="text-muted small">Duration</div>
                  <div className="fw-bold">{loan.duration} months</div>
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
              <Link to={`/partners/${loan.socio_id}`}>
                <Button variant="success">
                  <FaUser className="me-2" />
                  View Partner
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default LoanDetail;
