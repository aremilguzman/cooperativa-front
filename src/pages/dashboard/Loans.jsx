import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { Card, Alert, Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import LoansHeader from "../../components/loans/LoansHeader";
import LoansTable from "../../components/loans/LoansTable";
import LoanForm from "../../components/loans/LoanForm";

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [partners, setPartners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    interest_rate: "",
    duration: "",
    socio_id: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchLoans();
    fetchPartners();
  }, []);

  //funcion para traer los prestamos
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await api.get("/loans");
      setLoans(response.data.msg);
    } catch (error) {
      setError("Error al cargar los prestamos");
    } finally {
      setLoading(false);
    }
  };

  //funcion para traer los socios asociados
  const fetchPartners = async () => {
    try {
      const response = await api.get("/partners");
      setPartners(response.data.msg);
    } catch (error) {
      console.error("Error al cargar los socios", error);
    }
  };

  //funcion para emitir mensaje satisfactorio
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  //funcion para mostrar el modal
  const handleShowModal = (loan = null) => {
    setSelectedLoan(loan);
    setFormData(
      loan || { amount: "", interest_rate: "", duration: "", socio_id: "" }
    );
    setShowModal(true);
  };

  //funcion para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
    setFormData({ amount: "", interest_rate: "", duration: "", socio_id: "" });
  };

  //funcion para manejar cambios en los inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //funcion para enviar datos al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedLoan) {
        await api.put(`/loans/${selectedLoan.pid}`, formData);
        showSuccessMessage("Prestamo actualizado exitosamente!");
      } else {
        await api.post("/loans", formData);
        showSuccessMessage("Prestamo agregado exitosamente!");
      }
      fetchLoans();
      handleCloseModal();
    } catch (error) {
      setError("Error al intentar guardar datos del prestamo");
    }
  };

  //funcion para eliminar prestamos
  const handleDelete = async (pid) => {
    if (window.confirm("Seguro que quieres eliminar este prestamo?")) {
      try {
        await api.delete(`/loans/${pid}`);
        showSuccessMessage("Prestamo eliminado exitosamente!");
        fetchLoans();
      } catch (error) {
        setError("Error al eliminar prestamo");
      }
    }
  };

  const filteredLoans = loans.filter(
    (loan) =>
      loan.socio_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.pid.toString().includes(searchTerm)
  );

  return (
    <Card>
      <Card.Header>
        <LoansHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAddLoan={() => handleShowModal()}
          currentUser={currentUser}
        />
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <LoansTable
            loans={filteredLoans}
            onEdit={handleShowModal}
            onDelete={handleDelete}
            currentUser={currentUser}
          />
        )}
      </Card.Body>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedLoan ? "Edit Loan" : "Add Loan"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoanForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            partners={partners}
            isEditing={!!selectedLoan}
          />
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default LoansPage;
