import React, { useState, useEffect } from 'react';
import './AuthModal.css';

export default function AuthModal({ open, mode = 'login', onClose }) {
  const [current, setCurrent] = useState(mode);
  useEffect(() => setCurrent(mode), [mode]);

  // form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccessMsg("");
    setLoading(true);
    try {
      if (current === 'signup') {
  const res = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, username })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        setSuccessMsg("Welcome!");
        // switch to login after successful signup
        setCurrent('login');
        setUsername(''); setPassword(''); setEmail('');
      } else {
  const res = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        setSuccessMsg("You're logged in.");
        // store token locally (simple demo)
        localStorage.setItem('auth_token', data.token);
        // close modal on success after a short delay
        setTimeout(() => {
          setSuccessMsg("");
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="auth-overlay" onMouseDown={onClose}>
      <div className="auth-modal fade-in" onMouseDown={(e) => e.stopPropagation()}>
        {/* Left Panel - Green Welcome */}
        <div className="auth-left">
          <div className="auth-welcome">Welcome Back!</div>
          <p>To keep connected with us please login with your personal info</p>
          <button className="auth-signup-btn" onClick={() => setCurrent('signup')}>
            SIGN UP
          </button>
        </div>

        {/* Right Panel - Login Form */}
        <div className="auth-right">
          <form className="auth-form" onSubmit={(e) => handleSubmit(e)}>
            <h1 className="auth-title">
              {current === 'login' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="auth-subtitle">
              {current === 'login' ? 'Sign in to your account' : 'Create your account'}
            </p>

            {current === 'signup' && (
              <div className="auth-field">
                <label className="auth-label">Username</label>
                <input
                  className="auth-input"
                  placeholder="Enter your username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                className="auth-input"
                placeholder="Enter your email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                placeholder="Enter your password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="auth-actions">
              <label className="auth-remember">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>
                Forgot Password?
              </a>
            </div>

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? (current === 'login' ? 'Signing in...' : 'Signing up...') : (current === 'login' ? 'SIGN IN' : 'SIGN UP')}
            </button>


            {/* Success and error messages at the bottom */}
            <div style={{ marginTop: 18, minHeight: 24, textAlign: "center", fontSize: "1rem" }}>
              {error && <span style={{ color: 'red' }}>{error}</span>}
              {successMsg && <span style={{ color: "#00A86B" }}>{successMsg}</span>}
            </div>

            <div className="auth-footer">
              {current === 'login' ? (
                <span>Don't have an account? <a href="#" className="link-btn" onClick={() => setCurrent('signup')}>Sign Up</a></span>
              ) : (
                <span>Already have an account? <a href="#" className="link-btn" onClick={() => setCurrent('login')}>Sign In</a></span>
              )}
            </div>
          </form>
        </div>

        <button className="auth-close" aria-label="Close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}
