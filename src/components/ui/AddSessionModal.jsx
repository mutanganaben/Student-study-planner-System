import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './AddSessionModal.css';

const AddSessionModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    date: '',
    startTime: '',
    endTime: '',
    color: '#6366f1'
  });

  const colors = [
    '#6366f1', // Indigo/Purple
    '#a855f7', // Light Purple
    '#ec4899', // Pink
    '#10b981', // Green
    '#f59e0b', // Orange
    '#3b82f6'  // Blue
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleColorSelect = (color) => {
    setFormData({ ...formData, color });
  };

  const handleAdd = () => {
    onAdd({
      ...formData,
      id: Date.now()
    });
    setFormData({ title: '', course: '', date: '', startTime: '', endTime: '', color: '#6366f1' });
    onClose();
  };

  return (
    <div className="session-modal-overlay">
      <div className="session-modal-content">
        <div className="session-modal-header">
          <h2>Add Study Session</h2>
          <button className="btn-close-modal" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="session-modal-body">
          <div className="form-group">
            <label>Session Title</label>
            <input 
              type="text" 
              name="title" 
              placeholder="e.g., Calculus Study Session" 
              className="form-control"
              value={formData.title} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Course</label>
            <input 
              type="text" 
              name="course" 
              placeholder="e.g., Math 201" 
              className="form-control"
              value={formData.course} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              name="date" 
              className="form-control"
              value={formData.date} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Start Time</label>
              <input 
                type="time" 
                name="startTime" 
                className="form-control"
                value={formData.startTime} 
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input 
                type="time" 
                name="endTime" 
                className="form-control"
                value={formData.endTime} 
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-selection">
              {colors.map(col => (
                <div 
                  key={col} 
                  className={`color-option ${formData.color === col ? 'selected' : ''}`}
                  style={{ backgroundColor: col }}
                  onClick={() => handleColorSelect(col)}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="session-modal-footer">
          <button className="btn-session-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-session-add" onClick={handleAdd}>Add Session</button>
        </div>
      </div>
    </div>
  );
};

export default AddSessionModal;
