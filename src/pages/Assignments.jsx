import React, { useState } from 'react';
import { Plus, Search, Calendar, Clock, AlertCircle, Edit2, X, CheckCircle } from 'lucide-react';
import AddAssignmentModal from '../components/ui/AddAssignmentModal';
import './Assignments.css';

const initialData = [
    {
      id: 1,
      title: 'Physics Lab Report',
      desc: 'Complete experiment analysis and write full report',
      course: 'Physics 101',
      date: 'Apr 9',
      daysLeft: '2 days left',
      priority: 'high',
      status: 'in progress',
    },
    {
      id: 2,
      title: 'Calculus Problem Set',
      desc: 'Chapter 7 exercises, problems 1-25',
      course: 'Math 201',
      date: 'Apr 10',
      daysLeft: '3 days left',
      priority: 'medium',
      status: 'pending',
    },
    {
      id: 3,
      title: 'English Essay Draft',
      desc: '1500 word essay on Shakespeare',
      course: 'ENG 202',
      date: 'Apr 12',
      daysLeft: '5 days left',
      priority: 'high',
      status: 'in progress',
    },
    {
      id: 4,
      title: 'Chemistry Quiz Prep',
      desc: 'Review chapters 4-6 for quiz',
      course: 'Chem 101',
      date: 'Apr 11',
      daysLeft: '4 days left',
      priority: 'medium',
      status: 'pending',
    }
  ];

const Assignments = () => {
  const [assignments, setAssignments] = useState(initialData);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const cycleStatus = (id, currentStatus) => {
    const statusMap = {
      'pending': 'in progress',
      'in progress': 'completed',
      'completed': 'pending'
    };
    
    setAssignments(prev => prev.map(item => 
      item.id === id ? { ...item, status: statusMap[currentStatus] } : item
    ));
  };

  const filteredAssignments = assignments.filter(item => {
    const matchesFilter = filter === 'All' || item.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totals = {
    all: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    inProgress: assignments.filter(a => a.status === 'in progress').length,
    completed: assignments.filter(a => a.status === 'completed').length,
  };

  const handleAddAssignment = (newAssignment) => {
    // Generate derived properties to match the required array shape
    const daysLeftMatch = newAssignment.date.match(/\d+/);
    const dayNumeric = daysLeftMatch ? parseInt(daysLeftMatch[0]) : 10;
    const currentNumeric = new Date().getDate();
    let computedDaysLeft = `${Math.abs(dayNumeric - currentNumeric)} days left`;
    if (dayNumeric === currentNumeric) computedDaysLeft = 'Due today';

    const completeAssignment = {
      ...newAssignment,
      desc: newAssignment.description, // Reconciling our form key with the row key
      daysLeft: computedDaysLeft,
      priority: newAssignment.priority.toLowerCase()
    };

    setAssignments(prev => [completeAssignment, ...prev]);
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
            {filteredAssignments.map(item => (
              <tr key={item.id}>
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
                      <span className="date-primary">{item.date}</span>
                      <span className="date-secondary">{item.daysLeft}</span>
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
                    onClick={() => cycleStatus(item.id, item.status)}
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
                    <button className="btn-icon icon-edit"><Edit2 size={16} /></button>
                    <button className="btn-icon icon-delete"><X size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
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
