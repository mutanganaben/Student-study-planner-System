import React, { useState, useEffect } from 'react';
import { User, Bell, Palette, Lock } from 'lucide-react';
import userService from '../services/userService';
import notificationService from '../services/notificationService';
import './Settings.css';

const Settings = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    university: '',
    bio: ''
  });
  const [notifications, setNotifications] = useState({
    sessionReminders: true,
    deadlineAlerts: true,
    progressReport: true,
    aiRecommendations: false,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, notificationData] = await Promise.all([
          userService.getUserProfile(),
          notificationService.getSettings()
        ]);
        
        setProfile({
          name: profileData.name || '',
          email: profileData.email || '',
          university: profileData.university || '',
          bio: profileData.bio || ''
        });

        if (notificationData && Object.keys(notificationData).length > 0) {
          setNotifications(notificationData);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchData();
  }, []);

  const handleToggle = async (setting) => {
    const newValue = !notifications[setting];
    
    // Optimistic update
    setNotifications(prev => ({
      ...prev,
      [setting]: newValue
    }));

    try {
      await notificationService.updateSettings({ [setting]: newValue });
    } catch (err) {
      console.error('Error saving notification setting:', err);
      // Rollback
      setNotifications(prev => ({
        ...prev,
        [setting]: !newValue
      }));
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUserProfile(profile);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await userService.updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      alert('Password updated successfully!');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error updating password:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update password';
      alert(errorMessage);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you SURE you want to delete your account? This action cannot be undone.')) {
      try {
        await userService.deleteAccount();
        alert('Account deleted successfully');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } catch (err) {
        console.error('Error deleting account:', err);
        alert(err.response?.data?.message || 'Failed to delete account');
      }
    }
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
        
        <form className="settings-form" onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name"
              className="form-control" 
              value={profile.name}
              onChange={handleProfileChange}
            />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              className="form-control" 
              value={profile.email}
              onChange={handleProfileChange}
            />
          </div>
          
          <div className="form-group">
            <label>University/School</label>
            <input 
              type="text" 
              name="university"
              className="form-control" 
              placeholder="e.g., Harvard University" 
              value={profile.university}
              onChange={handleProfileChange}
            />
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea 
              name="bio"
              className="form-control" 
              placeholder="Tell us about yourself..."
              value={profile.bio}
              onChange={handleProfileChange}
            ></textarea>
          </div>
          
          <button type="submit" className="save-btn">Save Changes</button>
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
        
        <form className="settings-form" onSubmit={handleUpdatePassword}>
          <div className="form-group">
            <label>Current Password</label>
            <input 
              type="password" 
              name="currentPassword"
              placeholder="••••••••" 
              className="form-control" 
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              name="newPassword"
              placeholder="••••••••" 
              className="form-control" 
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="••••••••" 
              className="form-control" 
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <button type="submit" className="save-btn">Update Password</button>
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
          <button type="button" className="danger-btn" onClick={handleDeleteAccount}>Delete Account</button>
        </div>
      </div>
      
    </div>
  );
};

export default Settings;
