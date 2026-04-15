import React from 'react';
import { Calendar, CheckSquare, BarChart2, Brain } from 'lucide-react';
import './FeaturesSection.css';

const featuresData = [
  {
    title: 'Smart Study Planner',
    description: 'Organize your study schedule with an intuitive calendar and drag-and-drop sessions.',
    icon: Calendar,
  },
  {
    title: 'Assignment Tracker',
    description: 'Keep track of all your assignments, deadlines, and priorities in one place.',
    icon: CheckSquare,
  },
  {
    title: 'Progress Analytics',
    description: 'Visualize your study hours and productivity with detailed charts and insights.',
    icon: BarChart2,
  },
  {
    title: 'AI Recommendations',
    description: 'Get personalized study plan suggestions and ideal study time recommendations.',
    icon: Brain,
  },
];

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="features-header">
          <h2 className="features-title">Everything You Need to Succeed</h2>
          <p className="features-subtitle">
            Powerful features designed to help students stay organized and productive
          </p>
        </div>
        
        <div className="features-grid">
          {featuresData.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">
                  <Icon className="feature-icon" size={24} />
                </div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
