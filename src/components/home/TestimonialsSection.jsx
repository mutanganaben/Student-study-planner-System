import React from 'react';
import { Quote } from 'lucide-react';
import samAvatar from '../../assets/sam.jpeg';
import mauriceAvatar from '../../assets/maurice.jpeg';
import './TestimonialsSection.css';

const testimonialsData = [
  {
    id: 1,
    quote: "StudyPlanner helped me organize my chaotic schedule and improve my grades significantly!",
    name: "Sarah Johnson",
    role: "College Student",
    avatar: samAvatar
  },
  {
    id: 2,
    quote: "The progress tracking feature keeps me motivated and accountable for my study goals.",
    name: "Michael Chen",
    role: "Graduate Student",
    avatar: mauriceAvatar
  },
  {
    id: 3,
    quote: "I love how easy it is to manage assignments and never miss a deadline anymore!",
    name: "Emily Rodriguez",
    role: "High School Senior",
    avatar: null
  }
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">Loved by Students Everywhere</h2>
          <p className="testimonials-subtitle">
            See what our users have to say about StudyPlanner
          </p>
        </div>
        
        <div className="testimonials-grid">
          {testimonialsData.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-quote-icon">
                <Quote size={24} fill="currentColor" />
              </div>
              <p className="testimonial-text">"{testimonial.quote}"</p>
              
              <div className="testimonial-author">
                {testimonial.avatar ? (
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="testimonial-avatar"
                  />
                ) : (
                  <div className="testimonial-avatar-placeholder">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div className="testimonial-author-info">
                  <h4 className="testimonial-name">{testimonial.name}</h4>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
