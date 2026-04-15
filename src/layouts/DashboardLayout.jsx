import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import './Layouts.css'; 

const DashboardLayout = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const location = useLocation();
  
  let pageTitle = 'Dashboard';
  if (location.pathname.includes('/planner')) pageTitle = 'Study Planner';
  else if (location.pathname.includes('/assignments')) pageTitle = 'Assignments';
  else if (location.pathname.includes('/analytics')) pageTitle = 'Progress';
  else if (location.pathname.includes('/settings')) pageTitle = 'Settings';

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-titles">
            <h1 className="header-title">{pageTitle}</h1>
            <p className="header-date">{today}</p>
          </div>
          <div className="header-actions">
            <div className="header-notification">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </div>
            <div className="header-user">
              <div className="user-avatar">
                <User size={18} color="white" />
              </div>
              <span className="user-name">Student</span>
            </div>
          </div>
        </header>
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
