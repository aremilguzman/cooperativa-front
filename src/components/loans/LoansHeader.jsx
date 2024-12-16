import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { FaSearch, FaPlus } from "react-icons/fa";

const LoansHeader = ({ searchTerm, setSearchTerm, onAddLoan, currentUser }) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <InputGroup className="w-auto">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <FormControl
          placeholder="Buscar prestamo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
        <Button variant="primary" onClick={onAddLoan}>
          <FaPlus className="me-1" /> Agregar Prestamo
        </Button>
      
    </div>
  );
};

export default LoansHeader;
