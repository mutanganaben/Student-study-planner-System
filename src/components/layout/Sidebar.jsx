import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutGrid, Calendar, CheckSquare, BarChart2, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <BookOpen color="white" size={20} />
            </div>
            <div className="sidebar-brand-text">
              <h2 className="brand-name">StudyPlanner</h2>
              <span className="brand-tagline">Stay Organized</span>
            </div>
          </div>
          <button className="mobile-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="sidebar-divider"></div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={onClose}>
                <LayoutGrid size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/planner" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={onClose}>
                <Calendar size={20} />
                <span>Study Planner</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/assignments" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={onClose}>
                <CheckSquare size={20} />
                <span>Assignments</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={onClose}>
                <BarChart2 size={20} />
                <span>Progress</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={onClose}>
                <Settings size={20} />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
