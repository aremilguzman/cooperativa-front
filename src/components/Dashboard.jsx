import React, { useState } from 'react';
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import Partners from './Partners';
import Loans from './Loans';
import Trackings from './Trackings';
import { FaUsers, FaMoneyBillWave, FaClipboardList, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('partners');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'partners':
        return <Partners />;
      case 'loans':
        return <Loans />;
      case 'trackings':
        return <Trackings />;
      default:
        return <Partners />;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h3 className="mb-0">Admin Panel</h3>
          <Button variant="link" className="sidebar-close d-md-none" onClick={toggleSidebar}>
            <FaTimes />
          </Button>
        </div>
        <Nav className="flex-column">
          <Nav.Link 
            className={activeTab === 'partners' ? 'active' : ''} 
            onClick={() => {
              setActiveTab('partners');
              setSidebarOpen(false);
            }}
          >
            <FaUsers className="icon" />
            <span>Partners</span>
          </Nav.Link>
          <Nav.Link 
            className={activeTab === 'loans' ? 'active' : ''} 
            onClick={() => {
              setActiveTab('loans');
              setSidebarOpen(false);
            }}
          >
            <FaMoneyBillWave className="icon" />
            <span>Loans</span>
          </Nav.Link>
          <Nav.Link 
            className={activeTab === 'trackings' ? 'active' : ''} 
            onClick={() => {
              setActiveTab('trackings');
              setSidebarOpen(false);
            }}
          >
            <FaClipboardList className="icon" />
            <span>Trackings</span>
          </Nav.Link>
          <Nav.Link onClick={logout} className="mt-auto">
            <FaSignOutAlt className="icon" />
            <span>Logout</span>
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navbar */}
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
            <span className="me-3">Welcome, {currentUser.username || 'Admin'}</span>
          </div>
        </Navbar>

        {/* Content Area */}
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
