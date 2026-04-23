import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Book, TrendingUp, AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import assignmentService from '../services/assignmentService';
import sessionService from '../services/sessionService';
import dashboardService from '../services/dashboardService';
import './Dashboard.css';

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    weeklyStudyHours: 0,
    completedTasks: 0,
    activeCourses: 0,
    studyStreak: 0
  });
  const [weeklyChart, setWeeklyChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentData, sessionData, statsData, chartData] = await Promise.all([
          assignmentService.getAssignments(),
          sessionService.getSessions(),
          dashboardService.getStats(),
          dashboardService.getWeeklyData()
        ]);
        setAssignments(assignmentData);
        setSessions(sessionData);
        setStats(statsData);
        setWeeklyChart(chartData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === todayStr);


  // Filter upcoming assignments (example logic)
  const upcomingAssignments = assignments
    .filter(a => a.status !== 'completed')
    .slice(0, 3);

  return (
    <div className="dashboard-overview">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-blue">
              <Clock color="white" size={24} />
            </div>
            <span className="stat-badge badge-positive">+12%</span>
          </div>
          <p className="stat-title">Study Hours This Week</p>
          <h2 className="stat-value">{stats.weeklyStudyHours}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-green">
              <CheckCircle color="white" size={24} />
            </div>
            <span className="stat-badge badge-positive">+{assignments.filter(a => a.status === 'completed').length}</span>
          </div>
          <p className="stat-title">Completed Tasks</p>
          <h2 className="stat-value">{stats.completedTasks}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-purple">
              <Book color="white" size={24} />
            </div>
            <span className="stat-badge badge-neutral">-</span>
          </div>
          <p className="stat-title">Active Courses</p>
          <h2 className="stat-value">{stats.activeCourses}</h2>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-orange">
              <TrendingUp color="white" size={24} />
            </div>
            <span className="stat-badge badge-positive">+2</span>
          </div>
          <p className="stat-title">Study Streak</p>
          <h2 className="stat-value">{stats.studyStreak} {stats.studyStreak === 1 ? 'day' : 'days'}</h2>
        </div>
      </div>

      {/* Main Content Row */}
      <div className="dashboard-row">
        {/* Chart Panel */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <h3>Weekly Study Hours</h3>
              <p>Your study pattern this week</p>
            </div>
            <Link to="/dashboard/analytics" className="panel-link">
              View Details <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="chart-container-inner">
            <div className="chart-grid">
              <div className="grid-lines-h">
                <div className="grid-line-h"></div>
                <div className="grid-line-h"></div>
                <div className="grid-line-h"></div>
                <div className="grid-line-h"></div>
                <div className="grid-line-h"></div>
              </div>
              <div className="grid-lines-v">
                <div className="grid-line-v-wrapper"><div className="grid-line-v"></div></div>
                <div className="grid-line-v-wrapper"><div className="grid-line-v"></div></div>
                <div className="grid-line-v-wrapper"><div className="grid-line-v"></div></div>
                <div className="grid-line-v-wrapper"><div className="grid-line-v"></div></div>
                <div className="grid-line-v-wrapper"><div className="grid-line-v"></div></div>
                <div className="grid-line-v-wrapper"><div className="grid-line-v"></div></div>
                <div className="grid-line-v-wrapper"><div className="grid-line-v"></div></div>
              </div>
            </div>
            
            <div className="chart-axis-y">
              <span>8</span>
              <span>6</span>
              <span>4</span>
              <span>2</span>
              <span>0</span>
            </div>
            
            <div className="chart-axis-x">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="chart-bars-layer">
              {weeklyChart.length > 0 ? (
                weeklyChart.map((data) => {
                  const maxHours = 8; // Max value for chart Y-axis
                  const heightPercentage = Math.min((data.hours / maxHours) * 100, 100);
                  
                  return (
                    <div key={data.day} className="chart-bar-container">
                      <div className="chart-bar" style={{ height: `${heightPercentage}%` }}>
                        <div className="chart-tooltip">
                          <div className="chart-tooltip-day">{data.day}</div>
                          <div className="chart-tooltip-val">hours: {data.hours}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="chart-bar-container">
                    <div className="chart-bar" style={{ height: '0%' }}></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Deadlines Panel */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <h3>Upcoming Deadlines</h3>
            </div>
            <Link to="/dashboard/assignments" className="panel-link">View All</Link>
          </div>

          <div className="deadline-list">
            {loading ? (
              <p>Loading assignments...</p>
            ) : upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((assignment) => (
                <div key={assignment._id} className="deadline-item">
                  <div className="deadline-info">
                    <div className={`deadline-icon-wrapper ${assignment.priority === 'high' ? 'red' : 'yellow'}`}>
                      <AlertCircle size={18} strokeWidth={2.5} />
                    </div>
                    <div className="deadline-details">
                      <h4>{assignment.title}</h4>
                      <p>{assignment.course}</p>
                    </div>
                  </div>
                  <div className="deadline-time">
                    {new Date(assignment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))
            ) : (
              <p>No upcoming deadlines!</p>
            )}
          </div>

          <Link to="/dashboard/assignments" className="add-task-btn" style={{textDecoration: 'none'}}>
            <Calendar size={18} /> Add New Assignment
          </Link>
        </div>
      </div>

      {/* Today's Schedule Panel */}
      <div className="dashboard-panel schedule-panel">
        <div className="panel-header">
          <div className="panel-title">
            <h3>Today's Schedule</h3>
            <p>{todaySessions.length} sessions planned for today</p>
          </div>
          <Link to="/dashboard/planner" className="panel-link" style={{display: 'flex', alignItems: 'center'}}>
            View Calendar <ChevronRight size={16} />
          </Link>
        </div>

        <div className="schedule-list">
          {todaySessions.length > 0 ? (
            todaySessions.map((session) => (
              <div key={session._id} className="schedule-item">
                <div className="schedule-left">
                  <div className="task-checkbox" style={{ backgroundColor: session.color }}></div>
                  <div className="task-details">
                    <h4>{session.title}</h4>
                    <p>{session.subject}</p>
                  </div>
                </div>
                <div className="schedule-right">
                  <span className="task-time">{session.startTime}</span>
                  <span className={`task-badge badge-${session.status || 'scheduled'}`}>
                    {session.status || 'scheduled'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-sessions-msg" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No study sessions scheduled for today.
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="quick-actions-grid">
        <Link to="/dashboard/planner" className="action-card action-schedule">
          <Calendar size={28} className="action-icon" />
          <div className="action-text">
            <h3>Schedule Study Session</h3>
            <p>Plan your next study session</p>
          </div>
        </Link>

        <Link to="/dashboard/assignments" className="action-card action-assignment">
          <CheckCircle size={28} className="action-icon" />
          <div className="action-text">
            <h3>Add Assignment</h3>
            <p>Track a new assignment or task</p>
          </div>
        </Link>

        <Link to="/dashboard/analytics" className="action-card action-progress">
          <TrendingUp size={28} className="action-icon" />
          <div className="action-text">
            <h3>View Progress</h3>
            <p>Check your study analytics</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
