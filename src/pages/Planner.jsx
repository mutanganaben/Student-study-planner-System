import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import AddSessionModal from '../components/ui/AddSessionModal';
import sessionService from '../services/sessionService';
import './Planner.css';

const Planner = () => {
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 to 20

  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState('week');
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await sessionService.getSessions();
      const mappedEvents = data.map(mapSessionToEvent);
      setEvents(mappedEvents);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const mapSessionToEvent = (session) => {
    const [y, m, d] = session.date.split('-');
    const dDate = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
    
    const startParts = session.startTime ? session.startTime.split(':') : ['12', '00'];
    const startHour = parseInt(startParts[0], 10);
    
    // Calculate duration in hours
    const endParts = session.endTime ? session.endTime.split(':') : ['13', '00'];
    const endHour = parseInt(endParts[0], 10);
    const endMin = parseInt(endParts[1] || '0', 10);
    const startMin = parseInt(startParts[1] || '0', 10);
    const duration = (endHour + endMin/60) - (startHour + startMin/60);

    return {
      id: session._id,
      title: session.title,
      subtitle: session.subject || '',
      time: `${session.startTime || '12:00'} - ${session.endTime || '13:00'}`,
      day: dDate.toLocaleDateString('en-US', { weekday: 'short' }),
      dateText: `${dDate.toLocaleDateString('en-US', { month: 'short' })} ${dDate.getDate()}`,
      fullDate: session.date, // "YYYY-MM-DD"
      startHour: startHour + startMin/60,
      duration: Math.max(0.5, duration),
      color: session.color
    };
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  const weekStart = getStartOfWeek(currentDate);

  const dynamicDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const today = new Date();
    const isActive = 
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      num: d.getDate(),
      fullDate: d.toISOString().split('T')[0],
      active: isActive
    };
  });

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const formatMonthDay = (d) => {
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    return `${month} ${d.getDate()}`;
  };

  const dateRangeText = `${formatMonthDay(weekStart)} - ${formatMonthDay(weekEnd)}`;
  const currentMonthYear = weekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrevWeek = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const handleRemoveSession = async (id) => {
    if (window.confirm('Delete this study session?')) {
      try {
        await sessionService.deleteSession(id);
        setEvents(prev => prev.filter(ev => ev.id !== id));
      } catch (err) {
        console.error('Error deleting session:', err);
      }
    }
  };

  const handleAddSession = async (session) => {
    try {
      // Calculate duration in minutes for backend
      const startParts = session.startTime.split(':');
      const endParts = session.endTime.split(':');
      const startMins = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
      const endMins = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
      const duration = Math.max(30, endMins - startMins);

      const sessionData = {
        title: session.title,
        subject: session.course,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: duration,
        color: session.color
      };

      const created = await sessionService.createSession(sessionData);
      setEvents(prev => [...prev, mapSessionToEvent(created)]);
      setIsSessionModalOpen(false);
    } catch (err) {
      console.error('Error adding session:', err);
      alert(err.response?.data?.message || 'Failed to add session');
    }
  };

  return (
    <div className="planner-container">
      {/* Header */}
      <div className="planner-header-row">
        <div className="planner-title-group">
          <h1>Study Calendar</h1>
          <p>{currentMonthYear}</p>
        </div>
        <div className="planner-actions">
          <div className="view-toggle-group">
            <button 
              className={`view-btn ${activeView === 'week' ? 'active' : ''}`}
              onClick={() => setActiveView('week')}
            >
              Week
            </button>
            <button 
              className={`view-btn ${activeView === 'month' ? 'active' : ''}`}
              onClick={() => setActiveView('month')}
            >
              Month
            </button>
          </div>
          <button className="btn-add-session" onClick={() => setIsSessionModalOpen(true)}>
            <Plus size={18} /> Add Session
          </button>
        </div>
      </div>

      {error && <div className="error-message-bar">{error}</div>}
      {loading && <div className="planner-loading">Loading study sessions...</div>}


      {/* Date Navigator */}
      <div className="date-navigator">
        <button className="date-nav-btn" onClick={handlePrevWeek}>
          <ChevronLeft size={20} />
        </button>
        <div className="date-range">
          {dateRangeText}
        </div>
        <button className="date-nav-btn" onClick={handleNextWeek}>
          <ChevronRight size={20} />
        </button>
      </div>

      {activeView === 'week' ? (
        <div className="timetable-wrapper">
          {/* Timetable Matrix */}
          <div className="timetable-grid">
            {/* Header Row */}
            <div className="time-axis-header"></div>
            {dynamicDays.map((day, idx) => (
              <div key={idx} className={`timetable-header-cell ${day.active ? 'active' : ''}`}>
                <span className="day-name">{day.name}</span>
                <span className="day-number">{day.num}</span>
              </div>
            ))}

            {/* Time & Day Columns */}
            <div className="time-label-column">
              {hours.map((hour) => (
                <div key={hour} className="time-label">
                  {`${hour}:00`}
                </div>
              ))}
            </div>

            {dynamicDays.map((day, dIdx) => (
              <div key={dIdx} className="day-column">
                {/* Grid cell lines */}
                {hours.map((hour) => (
                  <div key={hour} className="grid-cell"></div>
                ))}

                {/* Tuesday light highlight block to match Image 1 precisely */}
                {day.name === 'Tue' && (
                  <div 
                    className="time-slot-highlight" 
                    style={{ top: '0px', height: '120px' }} // 7:00 to 9:00
                  ></div>
                )}

                {/* Events for this day */}
                {events
                  .filter(ev => ev.fullDate === day.fullDate)
                  .map(ev => {
                    const topPos = (ev.startHour - 7) * 60;
                    const height = ev.duration * 60;
                    return (
                      <div 
                        key={ev.id} 
                        className={`event-card ${ev.colorClass || ''}`}
                        style={{ 
                          top: `${topPos}px`, 
                          height: `${height}px`, 
                          ...(ev.color ? { backgroundColor: ev.color } : {}) 
                        }}
                      >
                        <span className="event-title">{ev.title}</span>
                        <span className="event-subtitle">{ev.subtitle}</span>
                        <span className="event-time">{ev.time}</span>
                      </div>
                    )
                  })
                }
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="sessions-list-wrapper">
          {/* Month / List View */}
          <h3>All Study Sessions</h3>
          <div className="sessions-list-container">
            {events.map((ev) => (
              <div key={ev.id} className="session-list-item">
                <div className="session-left">
                  <div 
                    className={`session-dot ${ev.colorClass || ''}`} 
                    style={{ ...(ev.color ? { backgroundColor: ev.color } : {}) }}
                  ></div>
                  <div className="session-info">
                    <h4>{ev.title}</h4>
                    <p>{ev.subtitle}</p>
                  </div>
                </div>
                <div className="session-right">
                  <div className="session-datetime">
                    <span className="date">{ev.dateText}</span>
                    <span className="time">{ev.time}</span>
                  </div>
                  <button className="btn-remove-session" onClick={() => handleRemoveSession(ev.id)}>
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attach Modal */}
      <AddSessionModal 
        isOpen={isSessionModalOpen} 
        onClose={() => setIsSessionModalOpen(false)} 
        onAdd={handleAddSession} 
      />
    </div>
  );
};

export default Planner;
