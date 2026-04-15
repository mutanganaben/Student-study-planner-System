import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './CTASection.css';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="container cta-container">
        <h2 className="cta-title">Ready to Transform Your Study Habits?</h2>
        <p className="cta-subtitle">
          Join thousands of students who are already achieving their academic goals with StudyPlanner
        </p>
        <button className="cta-button-light" onClick={() => navigate('/register')}>
          Get Started for Free <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default CTASection;
