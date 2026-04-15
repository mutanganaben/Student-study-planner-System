import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Book, TrendingUp, AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
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
          <h2 className="stat-value">24.5</h2>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-green">
              <CheckCircle color="white" size={24} />
            </div>
            <span className="stat-badge badge-positive">+8%</span>
          </div>
          <p className="stat-title">Completed Tasks</p>
          <h2 className="stat-value">18</h2>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-purple">
              <Book color="white" size={24} />
            </div>
            <span className="stat-badge badge-neutral">-</span>
          </div>
          <p className="stat-title">Active Courses</p>
          <h2 className="stat-value">6</h2>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-orange">
              <TrendingUp color="white" size={24} />
            </div>
            <span className="stat-badge badge-positive">+2</span>
          </div>
          <p className="stat-title">Study Streak</p>
          <h2 className="stat-value">7 days</h2>
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
            <a href="#" className="panel-link">View Details &gt;</a>
          </div>
          
          <div className="chart-container-inner">
            <div className="chart-grid">
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
            </div>
            
            <div className="chart-axis-y">
              <span>8</span>
              <span>6</span>
              <span>4</span>
              <span>2</span>
              <span>0</span>
            </div>
            
            <div className="chart-axis-x">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            <div className="chart-bars-layer">
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '50%' }}></div></div>
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '40%' }}></div></div>
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '65%' }}></div></div>
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '35%' }}></div></div>
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '55%' }}></div></div>
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '30%' }}></div></div>
              <div className="chart-bar-container"><div className="chart-bar" style={{ height: '25%' }}></div></div>
            </div>
          </div>
        </div>

        {/* Deadlines Panel */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title">
              <h3>Upcoming Deadlines</h3>
            </div>
            <a href="#" className="panel-link">View All</a>
          </div>

          <div className="deadline-list">
            <div className="deadline-item">
              <div className="deadline-info">
                <div className="deadline-icon-wrapper red">
                  <AlertCircle size={18} strokeWidth={2.5} />
                </div>
                <div className="deadline-details">
                  <h4>Physics Lab Report</h4>
                  <p>Physics 101</p>
                </div>
              </div>
              <div className="deadline-time">Tomorrow</div>
            </div>

            <div className="deadline-item">
              <div className="deadline-info">
                <div className="deadline-icon-wrapper yellow">
                  <AlertCircle size={18} strokeWidth={2.5} />
                </div>
                <div className="deadline-details">
                  <h4>Essay Draft</h4>
                  <p>English</p>
                </div>
              </div>
              <div className="deadline-time">Apr 10</div>
            </div>

            <div className="deadline-item">
              <div className="deadline-info">
                <div className="deadline-icon-wrapper red">
                  <AlertCircle size={18} strokeWidth={2.5} />
                </div>
                <div className="deadline-details">
                  <h4>Midterm Exam</h4>
                  <p>Biology</p>
                </div>
              </div>
              <div className="deadline-time">Apr 12</div>
            </div>
          </div>

          <button className="add-task-btn">
            <Calendar size={18} /> Add New Assignment
          </button>
        </div>
      </div>

      {/* Today's Schedule Panel */}
      <div className="dashboard-panel schedule-panel">
        <div className="panel-header">
          <div className="panel-title">
            <h3>Today's Schedule</h3>
            <p>4 tasks planned for today</p>
          </div>
          <a href="#" className="panel-link" style={{display: 'flex', alignItems: 'center'}}>
            View Calendar <ChevronRight size={16} />
          </a>
        </div>

        <div className="schedule-list">
          {/* Task 1 */}
          <div className="schedule-item">
            <div className="schedule-left">
              <div className="task-checkbox"></div>
              <div className="task-details">
                <h4>Complete Math Assignment</h4>
                <p>Calculus II</p>
              </div>
            </div>
            <div className="schedule-right">
              <span className="task-time">10:00 AM</span>
              <span className="task-badge badge-high">high</span>
            </div>
          </div>

          {/* Task 2 */}
          <div className="schedule-item">
            <div className="schedule-left">
              <div className="task-checkbox"></div>
              <div className="task-details">
                <h4>Review Chemistry Notes</h4>
                <p>Organic Chemistry</p>
              </div>
            </div>
            <div className="schedule-right">
              <span className="task-time">2:00 PM</span>
              <span className="task-badge badge-medium">medium</span>
            </div>
          </div>

          {/* Task 3 */}
          <div className="schedule-item">
            <div className="schedule-left">
              <div className="task-checkbox"></div>
              <div className="task-details">
                <h4>Group Project Meeting</h4>
                <p>English Literature</p>
              </div>
            </div>
            <div className="schedule-right">
              <span className="task-time">4:00 PM</span>
              <span className="task-badge badge-low">low</span>
            </div>
          </div>

          {/* Task 4 */}
          <div className="schedule-item">
            <div className="schedule-left">
              <div className="task-checkbox"></div>
              <div className="task-details">
                <h4>Read Chapter 5</h4>
                <p>History</p>
              </div>
            </div>
            <div className="schedule-right">
              <span className="task-time">7:00 PM</span>
              <span className="task-badge badge-medium">medium</span>
            </div>
          </div>
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
