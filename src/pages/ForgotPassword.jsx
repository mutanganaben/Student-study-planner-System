import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Calendar, ArrowLeft } from 'lucide-react';
import authService from '../services/authService';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await authService.forgotPassword(email);
      setSuccess(response.message || 'If this email exists, a reset link has been sent.');
    } catch (err) {
      console.error('Forgot password error:', err);
      // Even on error, we might want to show the generic message to avoid leaking info, 
      // but if the user requested "no silent failure", we should probably show what happened 
      // or at least the generic message if it's a "not found" (which should be 200 anyway).
      setError(err.response?.data?.message || 'If this email exists, a reset link has been sent.');
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
        <h1 className="auth-title">Forgot Password?</h1>
        <p className="auth-subtitle">No worries, we'll send you reset instructions.</p>
      </div>

      <div className="auth-card">
        {success ? (
          <div className="auth-success-state">
            <div className="auth-success-icon">
              <Mail size={48} color="#059669" />
            </div>
            <p className="auth-success-message">{success}</p>
            <Link to="/login" className="auth-submit-btn" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="auth-input-icon" size={20} />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Reset Password'}
            </button>

            <Link to="/login" className="auth-back-link">
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
