import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert, Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

function Trackings() {
  const [trackings, setTrackings] = useState([]);
  const [loans, setLoans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState(null);
  const [formData, setFormData] = useState({
    t_date: '',
    status: '',
    notas: '',
    prestamo_id: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchTrackings();
    fetchLoans();
  }, []);

  const fetchTrackings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/trackings');
      setTrackings(response.data.msg);
    } catch (error) {
      setError('Failed to fetch trackings');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/loans');
      setLoans(response.data.msg);
    } catch (error) {
      console.error('Failed to fetch loans', error);
    }
  };

  const handleShowModal = (tracking = null) => {
    setSelectedTracking(tracking);
    setFormData(tracking || { t_date: '', status: '', notas: '', prestamo_id: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTracking(null);
    setFormData({ t_date: '', status: '', notas: '', prestamo_id: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTracking) {
        await axios.put(`http://localhost:3000/api/trackings/${selectedTracking.tid}`, {
          t_date: formData.t_date,
          status: formData.status,
          notas: formData.notas
        });
      } else {
        await axios.post('http://localhost:3000/api/trackings', formData);
      }
      fetchTrackings();
      handleCloseModal();
    } catch (error) {
      setError('Failed to save tracking');
    }
  };

  const handleDelete = async (tid) => {
    if (window.confirm('Are you sure you want to delete this tracking?')) {
      try {
        await axios.delete(`http://localhost:3000/api/trackings/${tid}`);
        fetchTrackings();
      } catch (error) {
        setError('Failed to delete tracking');
      }
    }
  };

  const filteredTrackings = trackings.filter(tracking =>
    tracking.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tracking.tid.toString().includes(searchTerm)
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
              placeholder="Search trackings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
        {currentUser.role_id === 1 && (
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FaPlus className="me-1" /> Add Tracking
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
        ) : filteredTrackings.length > 0 ? (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Loan Amount</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrackings.map((tracking) => (
                  <tr key={tracking.tid}>
                    <td>{tracking.tid}</td>
                    <td>{new Date(tracking.t_date).toLocaleDateString()}</td>
                    <td>{tracking.status}</td>
                    <td>${tracking.prestamo_monto}</td>
                    <td className="text-end">
                      <Link to={`/trackings/${tracking.tid}`} className="btn btn-info btn-sm">
                        <FaEye />
                      </Link>
                      {currentUser.role_id === 1 && (
                        <>
                          <Button variant="warning" size="sm" className="ms-2" onClick={() => handleShowModal(tracking)}>
                            <FaEdit />
                          </Button>
                          <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(tracking.tid)}>
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
          <p className="text-center py-3">No trackings found.</p>
        )}
      </Card.Body>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTracking ? 'Edit Tracking' : 'Add Tracking'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            
              <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="t_date" value={formData.t_date} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleInputChange} >
                <option value="">Select a status</option>
                <option value="pendiente">pendiente</option>
                <option value="en proceso">en proceso</option>
                <option value="finalizado">finalizado</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" rows={3} name="notas" value={formData.notas} onChange={handleInputChange} />
            </Form.Group>
            {!selectedTracking && (
              <Form.Group className="mb-3">
                <Form.Label>Loan</Form.Label>
                <Form.Select name="prestamo_id" value={formData.prestamo_id} onChange={handleInputChange} required>
                  <option value="">Select a loan</option>
                  {loans.map(loan => (
                    <option key={loan.pid} value={loan.pid}>Loan ID: {loan.pid} - Amount: ${loan.amount}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            <div className="text-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedTracking ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
}

export default Trackings;

