import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container footer-container">
        <p>© {currentYear} StudyPlanner. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
