import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Target, Award, Brain, Calendar } from 'lucide-react';
import progressService from '../services/progressService';
import './Analytics.css';

// Helper for Pie Chart Paths
const polarToCartesian = (cx, cy, r, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + (r * Math.cos(angleInRadians)),
    y: cy + (r * Math.sin(angleInRadians))
  };
};

const getPieData = (data) => {
  if (!data || data.length === 0) return [];
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
  const [stats, setStats] = useState({
    totalStudyHours: 0,
    hoursChange: 0,
    averageDailyHours: 0,
    avgChange: 0,
    goalsAchieved: 0,
    totalGoals: 0,
    goalCompletionRate: 0,
    studyStreak: 0,
    recordStreak: 0
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [goals, setGoals] = useState({
    weeklyTarget: 35,
    currentHours: 0,
    progress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [statsRes, weeklyRes, coursesRes, recsRes, goalsRes] = await Promise.all([
          progressService.getStats(),
          progressService.getWeeklyData(),
          progressService.getCourseData(),
          progressService.getRecommendations(),
          progressService.getGoals()
        ]);
        setStats(statsRes);
        setWeeklyData(weeklyRes);
        setCourseData(coursesRes);
        setRecommendations(recsRes);
        setGoals(goalsRes);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);
  
  const pieSlices = getPieData(courseData);

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
            <span className={`stat-indicator indicator-${stats.hoursChange >= 0 ? 'positive' : 'negative'}`}>
              {stats.hoursChange >= 0 ? '+' : ''}{stats.hoursChange}%
            </span>
          </div>
          <div className="stat-info">
            <p className="stat-title">Total Study Hours</p>
            <h2 className="stat-value">{stats.totalStudyHours}</h2>
            <p className="stat-desc">This month</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-green">
              <TrendingUp color="white" size={24} />
            </div>
            <span className={`stat-indicator indicator-${stats.avgChange >= 0 ? 'positive' : 'negative'}`}>
              {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange}%
            </span>
          </div>
          <div className="stat-info">
            <p className="stat-title">Average Daily Hours</p>
            <h2 className="stat-value">{stats.averageDailyHours}</h2>
            <p className="stat-desc">Per day</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-purple">
              <Target color="white" size={24} />
            </div>
            <span className="stat-indicator indicator-positive">{stats.goalCompletionRate}%</span>
          </div>
          <div className="stat-info">
            <p className="stat-title">Goals Achieved</p>
            <h2 className="stat-value">{stats.goalsAchieved}/{stats.totalGoals}</h2>
            <p className="stat-desc">This month</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-orange">
              <Award color="white" size={24} />
            </div>
            <span className="stat-indicator indicator-positive">Record: {stats.recordStreak}</span>
          </div>
          <div className="stat-info">
            <p className="stat-title">Study Streak</p>
            <h2 className="stat-value">{stats.studyStreak} {stats.studyStreak === 1 ? 'day' : 'days'}</h2>
            <p className="stat-desc">Current streak</p>
          </div>
        </div>
      </div>

      <div className="insights-section">
        {/* Bar Chart Panel */}
        <div className="insight-panel">
          <div className="panel-header">
            <h3>Weekly Study Hours</h3>
             <p>{weeklyData.reduce((acc, d) => acc + d.hours, 0).toFixed(1)} hours this week</p>
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
              {weeklyData.length > 0 ? weeklyData.map((d, idx) => (
                <div key={idx} className="bar-wrapper">
                  <div className="bar-fill" style={{ height: `${Math.min((d.hours / 8) * 100, 100)}%` }}></div>
                  <span className="bar-label">{d.day}</span>
                  
                  {/* Tooltip */}
                  <div className="chart-tooltip">
                    <div className="tooltip-day">{d.day}</div>
                    <div className="tooltip-hours">hours : {d.hours}</div>
                    <div className="tooltip-goal">goal : {d.goal}</div>
                  </div>
                </div>
              )) : (
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                  <div key={idx} className="bar-wrapper">
                    <div className="bar-fill" style={{ height: '0%' }}></div>
                    <span className="bar-label">{day}</span>
                  </div>
                ))
              )}
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
             {pieSlices.length > 0 ? (
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
             ) : (
               <div className="no-data-msg" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)'}}>
                 No study data available yet.
               </div>
             )}
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
          {recommendations.length > 0 ? recommendations.map((rec, idx) => (
            <div key={idx} className={`rec-card rec-card-${rec.type === 'optimal_time' ? 'green' : rec.type === 'weak_subject' ? 'yellow' : 'blue'}`}>
              <div className="rec-icon">
                {rec.type === 'optimal_time' && <Brain size={32} className="rec-icon-svg" />}
                {rec.type === 'weak_subject' && <Calendar size={32} className="rec-icon-svg" />}
                {rec.type === 'weekend_gap' && <Target size={32} className="rec-icon-svg" strokeWidth={2.5} />}
              </div>
              <h4>{rec.title}</h4>
              <p>{rec.message}</p>
            </div>
          )) : (
            <p style={{gridColumn: '1/-1', textAlign: 'center', color: 'var(--color-text-muted)', padding: '2rem'}}>No recommendations available yet. Keep studying!</p>
          )}
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
              <span className="goal-title">Weekly Study Target: {goals.weeklyTarget} hours</span>
              <span className="goal-status">{goals.currentHours} / {goals.weeklyTarget} hours</span>
            </div>
            <div className="progress-track bg-indigo-light">
              <div className="progress-fill fill-indigo" style={{ width: `${goals.progress}%` }}></div>
            </div>
          </div>
          
          {/* Goal 2 */}
          <div className="goal-item">
            <div className="goal-header">
              <span className="goal-title">Complete Assignments</span>
              <span className="goal-status">{stats.goalsAchieved} / {stats.totalGoals} completed</span>
            </div>
            <div className="progress-track bg-purple-light">
              <div className="progress-fill fill-purple" style={{ width: `${stats.totalGoals > 0 ? (stats.goalsAchieved / stats.totalGoals) * 100 : 0}%` }}></div>
            </div>
          </div>
          
          {/* Goal 3 */}
          <div className="goal-item">
            <div className="goal-header">
              <span className="goal-title">Study Streak</span>
              <span className="goal-status">{stats.studyStreak} {stats.studyStreak === 1 ? 'day' : 'days'}</span>
            </div>
            <div className="progress-track bg-green-light">
              <div className="progress-fill fill-green" style={{ width: `${Math.min((stats.studyStreak / 7) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
