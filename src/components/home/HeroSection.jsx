import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import heroImage from '../../assets/photo.jpg';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="container hero-container">
        
        <div className="hero-content">
          <h1 className="hero-title">
            Organize Your<br />
            Academic Life<br />
            with <span className="text-highlight">Smart<br/>Planning</span>
          </h1>
          
          <p className="hero-subtitle">
            Take control of your studies with intelligent scheduling, assignment tracking, and progress analytics.
          </p>
          
          <div className="hero-actions">
            <Button variant="primary" size="lg" className="cta-button" onClick={() => navigate('/register')}>
              Start Free Trial <ArrowRight size={20} />
            </Button>
            
            <Button variant="secondary" size="lg" className="cta-button">
              Watch Demo
            </Button>
          </div>
        </div>
        
        <div className="hero-image-wrapper">
          <img 
            src={heroImage} 
            alt="Study Planner Dashboard" 
            className="hero-image"
          />
        </div>
        
      </div>
    </section>
  );
};

export default HeroSection;
