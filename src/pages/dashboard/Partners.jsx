import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Modal, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import PartnersHeader from "../../components/partners/PartnersHeader";
import PartnersTable from "../../components/partners/PartnersTable";
import PartnerForm from "../../components/partners/PartnerForm";
import api from "../../api/api";

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchPartners();
  }, []);

  //funcion para traer los socios
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await api.get("/partners");
      setPartners(response.data.msg);
    } catch (error) {
      setError("Error al cargar los socios");
    } finally {
      setLoading(false);
    }
  };

  //funcion para emitir mensaje satisfactorio
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  //funcion para mostrar modal
  const handleShowModal = (partner = null) => {
    setSelectedPartner(partner);
    setFormData(
      partner || { full_name: "", email: "", phone: "", address: "" }
    );
    setShowModal(true);
  };

  //funcion para cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPartner(null);
  };

  //funcion para manejar cambios en los inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //funcion para enviar datos al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPartner) {
        await api.put(`/partners/${selectedPartner.sid}`, formData);
        showSuccessMessage("Socio actualizado exitosamente!");
      } else {
        await api.post("/partners", formData);
        showSuccessMessage("Socio agregado exitosamente!");
      }
      fetchPartners();
      handleCloseModal();
    } catch (error) {
      setError("Error al intentar guardar datos del socio");
    }
  };

  //funcion para eliminar socios
  const handleDelete = async (sid) => {
    if (window.confirm("Seguro que quieres eliminar este socio?")) {
      try {
        await api.delete(`/partners/${sid}`);
        showSuccessMessage("Socio eliminado exitosamente!");
        fetchPartners();
      } catch (error) {
        setError("Error al eliminar socio");
      }
    }
  };

  const filteredPartners = partners.filter(
    (partner) =>
      partner.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <Card.Header>
        <PartnersHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddPartner={() => handleShowModal()}
          currentUser={currentUser}
        />
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <PartnersTable
            partners={filteredPartners}
            onEdit={handleShowModal}
            onDelete={handleDelete}
            currentUser={currentUser}
          />
        )}
      </Card.Body>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPartner ? "Edit Partner" : "Add Partner"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PartnerForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isEditing={!!selectedPartner}
          />
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default PartnersPage;
