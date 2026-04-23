import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar } from 'lucide-react';
import { useAuth } from '../context';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Registration form submitted', formData);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      console.log('Password mismatch');
      return setError('Passwords do not match');
    }

    setIsSubmitting(true);
    
    try {
      console.log('Attempting to register with backend...');
      const response = await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      console.log('Registration successful!');
      setSuccess(response.message || 'Registration successful!');
      // Navigate to dashboard immediately
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <Link to="/" className="auth-logo">
          <div className="brand-icon">
            <Calendar size={24} color="#ffffff" strokeWidth={2.5} />
          </div>
          <span className="brand-text">StudyPlanner</span>
        </Link>
        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-subtitle">Start organizing your academic life today</p>
      </div>

      <div className="auth-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <div className="auth-input-wrapper">
              <User className="auth-input-icon" size={20} />
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your Full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={20} />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={20} />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-checkbox">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
            />
            <label htmlFor="agreeTerms">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success" style={{ 
            padding: '1rem', 
            backgroundColor: '#ecfdf5', 
            color: '#065f46', 
            borderRadius: '0.5rem', 
            marginBottom: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            border: '1px solid #a7f3d0'
          }}>{success}</div>}

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
