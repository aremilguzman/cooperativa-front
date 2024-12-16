import React from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

//componente para reflejar la tabla de socios
const PartnersTable = ({ partners, onEdit, onDelete, currentUser }) => {
  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner.sid}>
              <td>{partner.sid}</td>
              <td>{partner.full_name}</td>
              <td>{partner.phone}</td>
              <td className="text-end">
                <Link
                  to={`/partners/${partner.sid}`}
                  className="btn btn-info btn-sm"
                >
                  <FaEye />
                </Link>
                <Button
                      variant="warning"
                      size="sm"
                      className="ms-2"
                      onClick={() => onEdit(partner)}
                    >
                      <FaEdit />
                    </Button>
                {currentUser.role_id === 1 && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => onDelete(partner.sid)}
                    >
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
  );
};

export default PartnersTable;
