import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { FaSearch, FaPlus } from "react-icons/fa";

//Componente que contiene la cabecera de la tabla de socios
const PartnersHeader = ({
  searchTerm,
  setSearchTerm,
  onAddPartner,
  currentUser,
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <InputGroup className="w-auto">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <FormControl
          placeholder="Buscar socios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
        <Button variant="primary" onClick={onAddPartner}>
          <FaPlus className="me-1" /> Agregar Socio
        </Button>
    </div>
  );
};

export default PartnersHeader;
