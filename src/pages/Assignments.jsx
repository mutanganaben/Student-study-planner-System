import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Clock, AlertCircle, Edit2, X, CheckCircle } from 'lucide-react';
import AddAssignmentModal from '../components/ui/AddAssignmentModal';
import assignmentService from '../services/assignmentService';
import './Assignments.css';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const data = await assignmentService.getAssignments();
      setAssignments(data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const cycleStatus = async (id, currentStatus) => {
    const statuses = ['pending', 'in progress', 'completed'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
      const updated = await assignmentService.updateAssignment(id, { status: nextStatus });
      setAssignments(prev => prev.map(item => 
        item._id === id ? updated : item
      ));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await assignmentService.deleteAssignment(id);
        setAssignments(prev => prev.filter(item => item._id !== id));
      } catch (err) {
        console.error('Error deleting assignment:', err);
      }
    }
  };

  const filteredAssignments = assignments.filter(item => {
    const matchesFilter = filter === 'All' || item.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = (item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.course?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const totals = {
    all: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    inProgress: assignments.filter(a => a.status === 'in progress').length,
    completed: assignments.filter(a => a.status === 'completed').length,
  };

  const handleAddAssignment = async (newAssignment) => {
    try {
      const data = {
        title: newAssignment.title,
        desc: newAssignment.description,
        course: newAssignment.course,
        date: newAssignment.date,
        priority: newAssignment.priority.toLowerCase()
      };
      const created = await assignmentService.createAssignment(data);
      setAssignments(prev => [created, ...prev]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding assignment:', err);
      alert(err.response?.data?.message || 'Failed to add assignment');
    }
  };

  const getDaysLeft = (dateStr) => {
    const dueDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  return (
    <div className="assignments-container">
      {/* Header */}
      <div className="assignments-header">
        <div>
          <h1>Assignment Tracker</h1>
          <p>Manage and track all your assignments</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> Add Assignment
        </button>
      </div>

      {/* Controls */}
      <div className="controls-row">
        <div className="search-bar-container">
          <Search size={18} className="search-icon-abs" />
          <input 
            type="text" 
            placeholder="Search assignments..." 
            className="search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-toggle-container">
          {['All', 'Pending', 'In Progress', 'Completed'].map(f => (
            <button 
              key={f} 
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid-4">
        <div className="stat-box">
          <h4>Total Assignments</h4>
          <span className="stat-val val-black">{totals.all}</span>
        </div>
        <div className="stat-box">
          <h4>Pending</h4>
          <span className="stat-val val-orange">{totals.pending}</span>
        </div>
        <div className="stat-box">
          <h4>In Progress</h4>
          <span className="stat-val val-blue">{totals.inProgress}</span>
        </div>
        <div className="stat-box">
          <h4>Completed</h4>
          <span className="stat-val val-green">{totals.completed}</span>
        </div>
      </div>

      {/* Table */}
      {error && <div className="error-message" style={{color: '#ef4444', backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #fee2e2'}}>{error}</div>}
      <div className="assignments-table-wrapper">
        <table className="assignments-table">
          <thead>
            <tr>
              <th className="checkbox-cell">
                <div className="checkbox-custom"><div className="checkbox-inner"></div></div>
              </th>
              <th>Assignment</th>
              <th>Course</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Loading assignments...</td></tr>
            ) : error ? (
               <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem', color: '#ef4444'}}>{error}. Please check your connection.</td></tr>
            ) : filteredAssignments.length > 0 ? (
              filteredAssignments.map(item => (
                <tr key={item._id}>
                  <td className="checkbox-cell">
                    <div className="checkbox-custom"><div className="checkbox-inner"></div></div>
                  </td>
                  <td>
                    <div className="assignment-info">
                      <span className="assign-title">{item.title}</span>
                      <span className="assign-desc">{item.desc}</span>
                    </div>
                  </td>
                  <td>
                    <span className="course-text">{item.course}</span>
                  </td>
                  <td>
                    <div className="due-date-col">
                      <Calendar size={18} color="#94a3b8" />
                      <div className="date-text-group">
                        <span className="date-primary">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span className="date-secondary">{getDaysLeft(item.date)}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`pill-badge pill-${item.priority}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td>
                    <span 
                      className={`status-badge status-${item.status.replace(' ', '-')}`}
                      onClick={() => cycleStatus(item._id, item.status)}
                      title="Click to change status"
                    >
                      {item.status === 'in progress' && <Clock size={14} />}
                      {item.status === 'pending' && <AlertCircle size={14} />}
                      {item.status === 'completed' && <CheckCircle size={14} />}
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon icon-edit" onClick={() => cycleStatus(item._id, item.status)} title="Change Status"><Edit2 size={16} /></button>
                      <button className="btn-icon icon-delete" onClick={() => handleDelete(item._id)}><X size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No assignments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AddAssignmentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddAssignment} 
      />
    </div>
  );
};

export default Assignments;
