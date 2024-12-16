import React from "react";
import { Navbar, Button } from "react-bootstrap";
import { FaBars } from "react-icons/fa";

const TopNavbar = ({ activeTab, toggleSidebar, currentUser }) => {
  return (
    <Navbar className="top-navbar" expand={false}>
      <Button
        variant="link"
        className="sidebar-toggle d-md-none"
        onClick={toggleSidebar}
      >
        <FaBars />
      </Button>
      <Navbar.Brand className="d-none d-md-block">
        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      </Navbar.Brand>
      <div className="ms-auto d-flex align-items-center">
        <span className="me-3">Bienvenido, {currentUser.username || "Admin"}</span>
      </div>
    </Navbar>
  );
};

export default TopNavbar;
