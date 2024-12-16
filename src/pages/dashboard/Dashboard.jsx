import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Partners from "../dashboard/Partners";
import "../../styles/dashboard.css";
import LoansPage from "./Loans";
import TrackingsPage from "./Trackings";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("partners");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "partners":
        return <Partners />;
      case "loans":
        return <LoansPage />;
      case "trackings":
        return <TrackingsPage />;
      default:
        return <Partners />;
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      toggleSidebar={toggleSidebar}
      sidebarOpen={sidebarOpen}
      logout={logout}
      currentUser={currentUser}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
