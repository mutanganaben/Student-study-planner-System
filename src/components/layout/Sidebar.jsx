import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, LayoutGrid, Calendar, CheckSquare, BarChart2, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <BookOpen color="white" size={20} />
        </div>
        <div className="sidebar-brand-text">
          <h2 className="brand-name">StudyPlanner</h2>
          <span className="brand-tagline">Stay Organized</span>
        </div>
      </div>
      
      <div className="sidebar-divider"></div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <LayoutGrid size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/planner" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Calendar size={20} />
              <span>Study Planner</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/assignments" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <CheckSquare size={20} />
              <span>Assignments</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <BarChart2 size={20} />
              <span>Progress</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Settings size={20} />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
