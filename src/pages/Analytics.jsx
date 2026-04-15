import React from 'react';
import { Clock, TrendingUp, Target, Award, Brain, Calendar } from 'lucide-react';
import './Analytics.css';

// Helper for Pie Chart Paths
const polarToCartesian = (cx, cy, r, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + (r * Math.cos(angleInRadians)),
    y: cy + (r * Math.sin(angleInRadians))
  };
};

const getPieData = () => {
  const data = [
    { id: 1, label: 'Math: 12h', value: 12, color: '#4f46e5' }, // indigo
    { id: 2, label: 'Physics: 9h', value: 9, color: '#f59e0b' }, // orange
    { id: 3, label: 'History: 6h', value: 6, color: '#10b981' }, // green
    { id: 4, label: 'English: 8h', value: 8, color: '#ec4899' }, // pink
    { id: 5, label: 'Chemistry: 10h', value: 10, color: '#8b5cf6' }, // purple
  ];
  let total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;
  
  return data.map((d) => {
    const sliceAngle = (d.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle += sliceAngle;
    
    // Reverse start/end to draw clockwise
    const start = polarToCartesian(50, 50, 30, endAngle);
    const end = polarToCartesian(50, 50, 30, startAngle);
    const largeArcFlag = sliceAngle <= 180 ? "0" : "1";
    
    const dPath = [
      "M", 50, 50,
      "L", start.x, start.y,
      "A", 30, 30, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
    
    const midAngle = startAngle + sliceAngle / 2;
    const textPos = polarToCartesian(50, 50, 38, midAngle); 
    
    let textAnchor = "middle";
    let dx = 0;
    if (midAngle > 0 && midAngle < 180) {
        textAnchor = "start";
        dx = 1;
    } else if (midAngle > 180 && midAngle < 360) {
        textAnchor = "end";
        dx = -1;
    }
    
    return { ...d, dPath, textPos, textAnchor, dx };
  });
};

const Analytics = () => {
  const weeklyData = [
    { day: 'Mon', hours: 4.5, goal: 5 },
    { day: 'Tue', hours: 2.2, goal: 5 },
    { day: 'Wed', hours: 2.2, goal: 5 },
    { day: 'Thu', hours: 3.0, goal: 5 },
    { day: 'Fri', hours: 4.5, goal: 5 },
    { day: 'Sat', hours: 2.5, goal: 5 },
    { day: 'Sun', hours: 2.0, goal: 5 },
  ];
  
  const pieSlices = getPieData();

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1 className="analytics-title">Progress Analytics</h1>
        <p className="analytics-subtitle">Track your study patterns and performance insights</p>
      </div>

      <div className="stats-grid">
        {/* Card 1 */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-blue">
              <Clock color="white" size={24} />
            </div>
            <span className="stat-indicator indicator-positive">+15%</span>
          </div>
          <div className="stat-info">
            <p className="stat-title">Total Study Hours</p>
            <h2 className="stat-value">124</h2>
            <p className="stat-desc">This month</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-green">
              <TrendingUp color="white" size={24} />
            </div>
            <span className="stat-indicator indicator-positive">+8%</span>
          </div>
          <div className="stat-info">
            <p className="stat-title">Average Daily Hours</p>
            <h2 className="stat-value">4.1</h2>
            <p className="stat-desc">Per day</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-purple">
              <Target color="white" size={24} />
            </div>
            <span className="stat-indicator indicator-positive">90%</span>
          </div>
          <div className="stat-info">
            <p className="stat-title">Goals Achieved</p>
            <h2 className="stat-value">18/20</h2>
            <p className="stat-desc">This month</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-orange">
              <Award color="white" size={24} />
            </div>
            <span className="stat-indicator indicator-positive">Record: 14</span>
          </div>
          <div className="stat-info">
            <p className="stat-title">Study Streak</p>
            <h2 className="stat-value">7 days</h2>
            <p className="stat-desc">Current streak</p>
          </div>
        </div>
      </div>

      <div className="insights-section">
        {/* Bar Chart Panel */}
        <div className="insight-panel">
          <div className="panel-header">
            <h3>Weekly Study Hours</h3>
             <p>25.5 hours this week • 73% goal achieved</p>
          </div>
          
          <div className="bar-chart-container">
            <div className="chart-y-axis">
              <span>8</span>
              <span>6</span>
              <span>4</span>
              <span>2</span>
              <span>0</span>
            </div>
            <div className="chart-grid">
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
              <div className="grid-line"></div>
            </div>
            <div className="chart-bars">
              {weeklyData.map((d, idx) => (
                <div key={idx} className="bar-wrapper">
                  <div className="bar-fill" style={{ height: `${(d.hours / 8) * 100}%` }}></div>
                  <span className="bar-label">{d.day}</span>
                  
                  {/* Tooltip */}
                  <div className="chart-tooltip">
                    <div className="tooltip-day">{d.day}</div>
                    <div className="tooltip-hours">hours : {d.hours}</div>
                    <div className="tooltip-goal">goal : {d.goal}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Pie Chart Panel */}
        <div className="insight-panel">
          <div className="panel-header">
            <h3>Study Time by Course</h3>
            <p>Distribution of your study hours</p>
          </div>
          
          <div className="pie-chart-container">
             <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
               {pieSlices.map((slice) => (
                 <g key={slice.id}>
                   <path 
                     d={slice.dPath} 
                     fill={slice.color} 
                     stroke="white" 
                     strokeWidth="0.5" 
                   />
                   <text 
                     x={slice.textPos.x + slice.dx} 
                     y={slice.textPos.y} 
                     className="pie-svg-text" 
                     fill={slice.color}
                     textAnchor={slice.textAnchor}
                   >
                     {slice.label}
                   </text>
                 </g>
               ))}
             </svg>
          </div>
        </div>
      </div>

      {/* AI Recommendations Panel */}
      <div className="recommendations-panel">
        <div className="panel-header">
          <h3>AI-Powered Recommendations</h3>
          <p>Personalized insights to improve your study habits</p>
        </div>
        <div className="recommendations-grid">
          {/* Recommendation 1 */}
          <div className="rec-card rec-card-green">
            <div className="rec-icon">
              <Brain size={32} className="rec-icon-svg" />
            </div>
            <h4>Optimal Study Time</h4>
            <p>Your peak productivity is at 9 AM. Schedule challenging tasks during this time.</p>
          </div>
          
          {/* Recommendation 2 */}
          <div className="rec-card rec-card-yellow">
            <div className="rec-icon">
              <Calendar size={32} className="rec-icon-svg" />
            </div>
            <h4>Increase Math Study Time</h4>
            <p>Your Math performance could improve with 2 more hours per week.</p>
          </div>
          
          {/* Recommendation 3 */}
          <div className="rec-card rec-card-blue">
            <div className="rec-icon">
              <Target size={32} className="rec-icon-svg" strokeWidth={2.5} />
            </div>
            <h4>Weekend Goal</h4>
            <p>You studied less on weekends. Try to maintain at least 3 hours per day.</p>
          </div>
        </div>
      </div>

      {/* Study Goals Progress Panel */}
      <div className="goals-panel">
        <div className="panel-header">
          <h3>Study Goals Progress</h3>
          <p>Your current goals and achievement status</p>
        </div>
        
        <div className="goals-list">
          {/* Goal 1 */}
          <div className="goal-item">
            <div className="goal-header">
              <span className="goal-title">Weekly Study Target: 35 hours</span>
              <span className="goal-status">25.5 / 35 hours</span>
            </div>
            <div className="progress-track bg-indigo-light">
              <div className="progress-fill fill-indigo" style={{ width: '73%' }}></div>
            </div>
          </div>
          
          {/* Goal 2 */}
          <div className="goal-item">
            <div className="goal-header">
              <span className="goal-title">Complete 20 Assignments</span>
              <span className="goal-status">18 / 20 completed</span>
            </div>
            <div className="progress-track bg-purple-light">
              <div className="progress-fill fill-purple" style={{ width: '90%' }}></div>
            </div>
          </div>
          
          {/* Goal 3 */}
          <div className="goal-item">
            <div className="goal-header">
              <span className="goal-title">Maintain 7-day Study Streak</span>
              <span className="goal-status">7 / 7 days</span>
            </div>
            <div className="progress-track bg-green-light">
              <div className="progress-fill fill-green" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
