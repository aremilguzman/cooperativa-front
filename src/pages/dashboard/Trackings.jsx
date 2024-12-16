import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Card, Alert, Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import TrackingsHeader from "../../components/trackings/TrackingsHeader";
import TrackingsTable from "../../components/trackings/TrackingsTable";
import TrackingForm from "../../components/trackings/TrackingForm";

const TrackingsPage = () => {
  const [trackings, setTrackings] = useState([]);
  const [loans, setLoans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTracking, setSelectedTracking] = useState(null);
  const [formData, setFormData] = useState({
    t_date: "",
    status: "",
    notas: "",
    prestamo_id: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchTrackings();
    fetchLoans();
  }, []);

  //funcion para traer los seguimientos
  const fetchTrackings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/trackings");
      setTrackings(response.data.msg);
    } catch (error) {
      setError("Error al cargar seguimientos");
    } finally {
      setLoading(false);
    }
  };

  //funcion para traer los prestamos asociados
  const fetchLoans = async () => {
    try {
      const response = await api.get("/loans");
      setLoans(response.data.msg);
    } catch (error) {
      console.error("Error al cargar los prestamos", error);
    }
  };

  //funcion para emitir mensaje satisfactorio
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  //funcion para mostrar modal
  const handleShowModal = (tracking = null) => {
    setSelectedTracking(tracking);
    setFormData(
      tracking || { t_date: "", status: "", notas: "", prestamo_id: "" }
    );
    setShowModal(true);
  };

  //funcion para cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTracking(null);
    setFormData({ t_date: "", status: "", notas: "", prestamo_id: "" });
  };

  //funcion para manejar cambios en los inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //funcion para enviar datos al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTracking) {
        await api.put(`/trackings/${selectedTracking.tid}`, {
          t_date: formData.t_date,
          status: formData.status,
          notas: formData.notas,
        });
        showSuccessMessage("Seguimiento actualizado exitosamente!");
      } else {
        await api.post("/trackings", formData);
        showSuccessMessage("Seguimiento agregado exitosamente!");
      }
      fetchTrackings();
      handleCloseModal();
    } catch (error) {
      setError("Error al intentar guardar datos del seguimiento");
    }
  };

  const handleDelete = async (tid) => {
    if (window.confirm("Seguro que quieres eliminar este seguimiento?")) {
      try {
        await api.delete(`/trackings/${tid}`);
        showSuccessMessage("Seguimiento eliminado exitosamente!");
        fetchTrackings();
      } catch (error) {
        setError("Error al eliminar seguimiento");
      }
    }
  };

  const filteredTrackings = trackings.filter(
    (tracking) =>
      tracking.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tracking.tid.toString().includes(searchTerm)
  );

  return (
    <Card>
      <Card.Header>
        <TrackingsHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddTracking={() => handleShowModal()}
          currentUser={currentUser}
        />
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <TrackingsTable
            trackings={filteredTrackings}
            onEdit={handleShowModal}
            onDelete={handleDelete}
            currentUser={currentUser}
          />
        )}
      </Card.Body>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedTracking ? "Edit Tracking" : "Add Tracking"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TrackingForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            loans={loans}
            isEditing={!!selectedTracking}
          />
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default TrackingsPage;
