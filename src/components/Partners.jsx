import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert, Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

function Partners() {
  const [partners, setPartners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/partners');
      setPartners(response.data.msg);
    } catch (error) {
      setError('Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (partner = null) => {
    setSelectedPartner(partner);
    setFormData(partner || { full_name: '', email: '', phone: '', address: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPartner(null);
    setFormData({ full_name: '', email: '', phone: '', address: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPartner) {
        await axios.put(`http://localhost:3000/api/partners/${selectedPartner.sid}`, formData);
      } else {
        await axios.post('http://localhost:3000/api/partners', formData);
      }
      fetchPartners();
      handleCloseModal();
    } catch (error) {
      setError('Failed to save partner');
    }
  };

  const handleDelete = async (sid) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await axios.delete(`http://localhost:3000/api/partners/${sid}`);
        fetchPartners();
      } catch (error) {
        setError('Failed to delete partner');
      }
    }
  };

  const filteredPartners = partners.filter(partner =>
    partner.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
        {currentUser.role_id === 1 && (
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FaPlus className="me-1" /> Add Partner
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
        ) : filteredPartners.length > 0 ? (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th>Socio ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPartners.map((partner) => (
                  <tr key={partner.sid}>
                    <td>{partner.sid}</td>
                    <td>{partner.full_name}</td>
                    
                    <td>{partner.phone}</td>
                    
                    <td className="text-end">
                      <Link to={`/partners/${partner.sid}`} className="btn btn-info btn-sm">
                        <FaEye />
                      </Link>
                      {currentUser.role_id === 1 && (
                        <>
                          <Button variant="warning" size="sm" className="ms-2" onClick={() => handleShowModal(partner)}>
                            <FaEdit />
                          </Button>
                          <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(partner.sid)}>
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
          <p className="text-center py-3">No partners found.</p>
        )}
      </Card.Body>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedPartner ? 'Edit Partner' : 'Add Partner'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={formData.address} onChange={handleInputChange} required />
            </Form.Group>
            <div className="text-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedPartner ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
}

export default Partners;