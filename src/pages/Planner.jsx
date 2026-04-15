import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import AddSessionModal from '../components/ui/AddSessionModal';
import './Planner.css';

const Planner = () => {
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7 to 20

  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState('week');
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

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
  
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'English Essay Writing',
      subtitle: 'ENG 202',
      time: '09:00 - 11:00',
      day: 'Fri',
      dateText: 'Apr 9',
      startHour: 9,
      duration: 2,
      colorClass: 'bg-pink'
    },
    {
      id: 2,
      title: 'Calculus Study Session',
      subtitle: 'Math 201',
      time: '10:00 - 12:00',
      day: 'Thu',
      dateText: 'Apr 8',
      startHour: 10,
      duration: 2,
      colorClass: 'bg-blue'
    },
    {
      id: 3,
      title: 'Chemistry Lab Prep',
      subtitle: 'Chem 101',
      time: '14:00 - 16:00',
      day: 'Thu',
      dateText: 'Apr 8',
      startHour: 14,
      duration: 2,
      colorClass: 'bg-purple'
    },
    {
      id: 4,
      title: 'History Reading',
      subtitle: 'HIST 101',
      time: '15:00 - 17:00',
      day: 'Fri',
      dateText: 'Apr 9',
      startHour: 15,
      duration: 2,
      colorClass: 'bg-green'
    }
  ]);

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
                  .filter(ev => ev.day === day.name)
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
                  <button className="btn-remove-session">
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
        onAdd={(session) => {
          // Fallbacks for data parsing
          const startParts = session.startTime ? session.startTime.split(':') : ['12', '00'];
          const endParts = session.endTime ? session.endTime.split(':') : ['13', '00'];
          const startHour = parseInt(startParts[0], 10);
          const endHour = parseInt(endParts[0], 10);
          const duration = Math.max(1, endHour - startHour);
          
          let shortDay = 'Mon', dateText = 'Jan 1';
          if (session.date) {
            // Using split and local parsing to avoid UTC day shift offset issues
            const [y, m, d] = session.date.split('-');
            const dDate = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
            shortDay = dDate.toLocaleDateString('en-US', { weekday: 'short' });
            dateText = `${dDate.toLocaleDateString('en-US', { month: 'short' })} ${dDate.getDate()}`;
          }

          const newEvent = {
            id: session.id,
            title: session.title || '(Untitled Session)',
            subtitle: session.course || '',
            time: `${session.startTime || '12:00'} - ${session.endTime || '13:00'}`,
            day: shortDay,
            dateText: dateText,
            startHour: startHour,
            duration: duration,
            color: session.color
          };

          setEvents(prev => [...prev, newEvent]);
        }} 
      />
    </div>
  );
};

export default Planner;
