import React from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const TrackingsTable = ({ trackings, onEdit, onDelete, currentUser }) => {
  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Monto del prestamo</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {trackings.map((tracking) => (
            <tr key={tracking.tid}>
              <td>{tracking.tid}</td>
              <td>{new Date(tracking.t_date).toLocaleDateString()}</td>
              <td>{tracking.status}</td>
              <td>${tracking.prestamo_monto}</td>
              <td className="text-end">
                <Link
                  to={`/trackings/${tracking.tid}`}
                  className="btn btn-info btn-sm"
                >
                  <FaEye />
                </Link>
                {currentUser.role_id === 1 && (
                  <>
                    <Button
                      variant="warning"
                      size="sm"
                      className="ms-2"
                      onClick={() => onEdit(tracking)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => onDelete(tracking.tid)}
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

export default TrackingsTable;
