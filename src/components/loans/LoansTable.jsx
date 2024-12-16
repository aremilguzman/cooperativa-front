import React from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const LoansTable = ({ loans, onEdit, onDelete, currentUser }) => {
  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Monto</th>
            <th>Tasa de Interes</th>
            <th>Duración</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.pid}>
              <td>{loan.pid}</td>
              <td>${loan.amount}</td>
              <td>{loan.interest_rate}%</td>
              <td>{loan.duration} meses</td>
              <td className="text-end">
                <Link to={`/loans/${loan.pid}`} className="btn btn-info btn-sm">
                  <FaEye />
                </Link>
                <Button
                  variant="warning"
                  size="sm"
                  className="ms-2"
                  onClick={() => onEdit(loan)}
                >
                  <FaEdit />
                </Button>
                {currentUser.role_id === 1 && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => onDelete(loan.pid)}
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

export default LoansTable;
