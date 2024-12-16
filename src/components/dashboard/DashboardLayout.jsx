import React from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const DashboardLayout = ({
  activeTab,
  setActiveTab,
  toggleSidebar,
  sidebarOpen,
  logout,
  currentUser,
  children,
}) => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
        logout={logout}
      />

      {/* Contenido */}
      <div className="main-content">
        <TopNavbar
          activeTab={activeTab}
          toggleSidebar={toggleSidebar}
          currentUser={currentUser}
        />
        <div className="content-wrapper">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
