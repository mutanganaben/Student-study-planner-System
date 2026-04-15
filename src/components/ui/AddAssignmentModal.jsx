import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import './AddAssignmentModal.css';

const AddAssignmentModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    description: '',
    date: '',
    priority: 'Low'
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);

  // Month tracking for calendar
  const currentMonth = currentCalendarDate.getMonth();
  const currentYear = currentCalendarDate.getFullYear();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

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

  const handleAdd = () => {
    onAdd({
      ...formData,
      status: 'pending', // Default
      id: Date.now() // Fake unique ID
    });
    setFormData({ title: '', course: '', description: '', date: '', priority: 'Low' });
    setSelectedDate(null);
    onClose();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Make Monday 0, Sunday 6
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const prevMonth = () => {
    setCurrentCalendarDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentCalendarDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDateSelect = (day) => {
    const d = new Date(currentYear, currentMonth, day);
    setSelectedDate(d);
  };

  const handleDone = () => {
    if (selectedDate) {
      const formatted = `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()].substring(0,3)} ${selectedDate.getFullYear()}`;
      setFormData({ ...formData, date: formatted });
    }
    setIsCalendarOpen(false);
  };

  const handleReset = () => {
    setSelectedDate(null);
    setFormData({ ...formData, date: '' });
  };

  // Render calendar blanks and days
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="cal-day empty"></div>);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = selectedDate && 
                       selectedDate.getDate() === d && 
                       selectedDate.getMonth() === currentMonth && 
                       selectedDate.getFullYear() === currentYear;
    calendarDays.push(
      <div 
        key={`day-${d}`} 
        className={`cal-day ${isSelected ? 'selected' : ''}`}
        onClick={() => handleDateSelect(d)}
      >
        {d}
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Assignment</h2>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Assignment Title</label>
            <input 
              type="text" 
              name="title" 
              placeholder="e.g., Physics Lab Report" 
              value={formData.title} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Course</label>
            <input 
              type="text" 
              name="course" 
              placeholder="e.g., Physics 101" 
              value={formData.course} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              placeholder="Assignment details..." 
              rows="3"
              value={formData.description} 
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group relative">
            <label>Due Date</label>
            <input 
              type="text" 
              name="date" 
              placeholder="Click to select date" 
              value={formData.date} 
              readOnly
              onClick={() => setIsCalendarOpen(true)}
              className="cursor-pointer"
            />
            
            {/* Custom Dark Calendar Popup */}
            {isCalendarOpen && (
              <div className="custom-datepicker" ref={calendarRef}>
                <div className="cal-header">
                  <span className="cal-month-year">{monthNames[currentMonth]} {currentYear} &gt;</span>
                  <div className="cal-nav">
                    <button onClick={prevMonth}><ChevronLeft size={18} /></button>
                    <button onClick={nextMonth}><ChevronRight size={18} /></button>
                  </div>
                </div>
                
                <div className="cal-weekdays">
                  <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                </div>
                
                <div className="cal-grid">
                  {calendarDays}
                </div>

                <div className="cal-footer">
                  <button className="btn-cal-text" onClick={handleReset}>Reset</button>
                  <button className="btn-cal-text" onClick={handleDone}>Done</button>
                </div>
                {/* Visual arrow pointing to input */}
                <div className="cal-arrow-down"></div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={handleAdd}>Add Assignment</button>
        </div>
      </div>
    </div>
  );
};

export default AddAssignmentModal;
