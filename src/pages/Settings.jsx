import React, { useState } from 'react';
import { User, Bell, Palette, Lock } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    sessionReminders: true,
    deadlineAlerts: true,
    progressReport: true,
    aiRecommendations: false,
  });

  const handleToggle = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="settings-panel">
        <div className="panel-header-row">
          <User className="panel-icon" size={20} />
          <h3>Profile Settings</h3>
        </div>
        
        <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" className="form-control" />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" />
          </div>
          
          <div className="form-group">
            <label>University/School</label>
            <input type="text" className="form-control" placeholder="e.g., Harvard University" />
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea className="form-control" placeholder="Tell us about yourself..."></textarea>
          </div>
          
          <button type="button" className="save-btn">Save Changes</button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="settings-panel">
        <div className="panel-header-row">
          <Bell className="panel-icon" size={20} />
          <h3>Notification Preferences</h3>
        </div>
        
        <div className="settings-list">
          <div className="settings-list-item">
            <div className="item-info">
              <span className="item-title">Study Session Reminders</span>
              <span className="item-desc">Get notified before scheduled study sessions</span>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.sessionReminders} 
                onChange={() => handleToggle('sessionReminders')} 
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="settings-list-item">
            <div className="item-info">
              <span className="item-title">Assignment Deadline Alerts</span>
              <span className="item-desc">Receive alerts for upcoming assignment deadlines</span>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.deadlineAlerts} 
                onChange={() => handleToggle('deadlineAlerts')} 
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="settings-list-item">
            <div className="item-info">
              <span className="item-title">Weekly Progress Report</span>
              <span className="item-desc">Get weekly summaries of your study progress</span>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.progressReport} 
                onChange={() => handleToggle('progressReport')} 
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          
          <div className="settings-list-item">
            <div className="item-info">
              <span className="item-title">AI Recommendations</span>
              <span className="item-desc">Receive personalized study recommendations</span>
            </div>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={notifications.aiRecommendations} 
                onChange={() => handleToggle('aiRecommendations')} 
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Study Preferences */}
      <div className="settings-panel">
        <div className="panel-header-row">
          <Palette className="panel-icon" size={20} />
          <h3>Study Preferences</h3>
        </div>
        
        <div className="settings-form">
          <div className="form-group">
            <label>Default Study Session Duration</label>
            <select className="form-control" defaultValue="1 hour">
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="1.5 hours">1.5 hours</option>
              <option value="2 hours">2 hours</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Daily Study Goal (hours)</label>
            <input type="number" className="form-control" defaultValue={5} min={1} max={24} />
          </div>
          
          <div className="form-group">
            <label>First Day of Week</label>
            <select className="form-control" defaultValue="Monday">
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Time Format</label>
            <select className="form-control" defaultValue="24-hour">
              <option value="12-hour">12-hour</option>
              <option value="24-hour">24-hour</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Security */}
      <div className="settings-panel">
        <div className="panel-header-row">
          <Lock className="panel-icon" size={20} />
          <h3>Security</h3>
        </div>
        
        <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" placeholder="••••••••" className="form-control" />
          </div>
          
          <div className="form-group">
            <label>New Password</label>
            <input type="password" placeholder="••••••••" className="form-control" />
          </div>
          
          <div className="form-group">
            <label>Confirm New Password</label>
            <input type="password" placeholder="••••••••" className="form-control" />
          </div>
          
          <button type="button" className="save-btn">Update Password</button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="settings-panel-danger">
        <div className="panel-header-row">
          <h3>Danger Zone</h3>
        </div>
        
        <div className="danger-action-block">
          <div className="danger-info">
            <span className="danger-title">Delete Account</span>
            <span className="danger-desc">Permanently delete your account and all associated data</span>
          </div>
          <button type="button" className="danger-btn">Delete Account</button>
        </div>
      </div>
      
    </div>
  );
};

export default Settings;
