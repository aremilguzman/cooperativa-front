import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert, Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

function Loans() {
  const [loans, setLoans] = useState([]);
  const [partners, setPartners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    interest_rate: '',
    duration: '',
    socio_id: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchLoans();
    fetchPartners();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/loans');
      setLoans(response.data.msg);
    } catch (error) {
      setError('Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/partners');
      setPartners(response.data.msg);
    } catch (error) {
      console.error('Failed to fetch partners', error);
    }
  };

  const handleShowModal = (loan = null) => {
    setSelectedLoan(loan);
    setFormData(loan || { amount: '', interest_rate: '', duration: '', socio_id: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
    setFormData({ amount: '', interest_rate: '', duration: '', socio_id: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedLoan) {
        await axios.put(`http://localhost:3000/api/loans/${selectedLoan.pid}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/loans', formData);
      }
      fetchLoans();
      handleCloseModal();
    } catch (error) {
      setError('Failed to save loan');
    }
  };

  const handleDelete = async (pid) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await axios.delete(`http://localhost:3000/api/loans/${pid}`);
        fetchLoans();
      } catch (error) {
        setError('Failed to delete loan');
      }
    }
  };

  const filteredLoans = loans.filter(loan =>
    loan.socio_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.pid.toString().includes(searchTerm)
  );

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <InputGroup className="w-auto">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <FormControl
              placeholder="Search loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
        {currentUser.role_id === 1 && (
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FaPlus className="me-1" /> Add Loan
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        {loading ? (
          <div className="text-center py-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredLoans.length > 0 ? (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Monto</th>
                  <th>Tasa Interes</th>
                  <th>Duración</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <tr key={loan.pid}>
                    <td>{loan.pid}</td>
                    <td>${loan.amount}</td>
                    <td>{loan.interest_rate}%</td>
                    <td>{loan.duration} months</td>
                    <td className="text-end">
                      <Link to={`/loans/${loan.pid}`} className="btn btn-info btn-sm">
                        <FaEye />
                      </Link>
                      {currentUser.role_id === 1 && (
                        <>
                          <Button variant="warning" size="sm" className="ms-2" onClick={() => handleShowModal(loan)}>
                            <FaEdit />
                          </Button>
                          <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(loan.pid)}>
                            <FaTrash />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <p className="text-center py-3">No loans found.</p>
        )}
      </Card.Body>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedLoan ? 'Edit Loan' : 'Add Loan'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" name="amount" value={formData.amount} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Interest Rate</Form.Label>
              <Form.Control type="number" step="0.01" name="interest_rate" value={formData.interest_rate} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration (months)</Form.Label>
              <Form.Control type="number" name="duration" value={formData.duration} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Partner</Form.Label>
              <Form.Select name="socio_id" value={formData.socio_id} onChange={handleInputChange} required>
                <option value="">Select a partner</option>
                {partners.map(partner => (
                  <option key={partner.sid} value={partner.sid}>{partner.full_name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="text-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedLoan ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
}

export default Loans;
