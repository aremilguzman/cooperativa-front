import React from "react";
import { Nav, Button } from "react-bootstrap";
import {
  FaUsers,
  FaMoneyBillWave,
  FaClipboardList,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

//componente recibe las props
const Sidebar = ({
  activeTab,
  setActiveTab,
  toggleSidebar,
  sidebarOpen,
  logout,
}) => {
  return (
    <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
      <div className="sidebar-header">
        <h3 className="mb-0">Panel De Control</h3>
        <Button
          variant="link"
          className="sidebar-close d-md-none"
          onClick={toggleSidebar}
        >
          <FaTimes />
        </Button>
      </div>
      <Nav className="flex-column">
        <Nav.Link
          className={activeTab === "partners" ? "active" : ""}
          onClick={() => {
            setActiveTab("partners");
            toggleSidebar();
          }}
        >
          <FaUsers className="icon" />
          <span>Socios</span>
        </Nav.Link>
        <Nav.Link
          className={activeTab === "loans" ? "active" : ""}
          onClick={() => {
            setActiveTab("loans");
            toggleSidebar();
          }}
        >
          <FaMoneyBillWave className="icon" />
          <span>Prestamos</span>
        </Nav.Link>
        <Nav.Link
          className={activeTab === "trackings" ? "active" : ""}
          onClick={() => {
            setActiveTab("trackings");
            toggleSidebar();
          }}
        >
          <FaClipboardList className="icon" />
          <span>Seguimientos</span>
        </Nav.Link>
        <Nav.Link onClick={logout} className="mt-auto">
          <FaSignOutAlt className="icon" />
          <span>Cerrar Sesión</span>
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
