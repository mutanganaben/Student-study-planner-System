import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Bell, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context';
import Sidebar from '../components/layout/Sidebar';
import notificationService from '../services/notificationService';
import './Layouts.css'; 

const DashboardLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const location = useLocation();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
    // Poll for notifications every 2 minutes
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  let pageTitle = 'Dashboard';
  if (location.pathname.includes('/planner')) pageTitle = 'Study Planner';
  else if (location.pathname.includes('/assignments')) pageTitle = 'Assignments';
  else if (location.pathname.includes('/analytics')) pageTitle = 'Progress';
  else if (location.pathname.includes('/settings')) pageTitle = 'Settings';

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <button className="mobile-toggle" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
            <div className="header-titles">
              <h1 className="header-title">{pageTitle}</h1>
              <p className="header-date">{today}</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="header-notification" onClick={toggleNotifications} ref={dropdownRef}>
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
              
              {showNotifications && (
                <div className="notification-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-header">
                    <h4>Notifications</h4>
                    <button className="close-dropdown" onClick={() => setShowNotifications(false)}>
                       <X size={16} />
                    </button>
                  </div>
                  <div className="notification-list">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div 
                          key={n._id} 
                          className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                          onClick={() => handleMarkAsRead(n._id)}
                        >
                          {!n.isRead && <div className="item-dot"></div>}
                          <div className="item-content">
                            <span className="item-message">{n.message}</span>
                            <span className="item-time">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-notifications">
                        No new notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="header-user">
              <div className="user-avatar">
                <User size={18} color="white" />
              </div>
              <span className="user-name">{user?.name || 'Student'}</span>
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
