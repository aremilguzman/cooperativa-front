import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { FaSearch, FaPlus } from "react-icons/fa";

//componente recibe props
const TrackingsHeader = ({
  searchTerm,
  setSearchTerm,
  onAddTracking,
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <InputGroup className="w-auto">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <FormControl
          placeholder="Buscar Seguimientos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Button variant="primary" onClick={onAddTracking}>
        <FaPlus className="me-1" /> Agregar Seguimiento
      </Button>
    </div>
  );
};

export default TrackingsHeader;
