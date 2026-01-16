import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (token && userRole) {
      redirectBasedOnRole(userRole);
    }
  }, []);

  // Redirect function based on role
  const redirectBasedOnRole = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'teacher':
        navigate('/teacher/dashboard');
        break;
      case 'student':
        navigate('/student/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  // Demo credentials with validation
  const demoCredentials = {
    'admin@college.edu': { password: 'admin123', role: 'admin', name: 'Admin User' },
    'teacher@college.edu': { password: 'teacher123', role: 'teacher', name: 'Teacher User' },
    'student@college.edu': { password: 'student123', role: 'student', name: 'Student User' }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password } = formData;

    // Basic validation
    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email exists in demo credentials
    if (demoCredentials[email]) {
      const user = demoCredentials[email];
      
      // Check password
      if (password === user.password) {
        // Save user data to localStorage
        localStorage.setItem('authToken', 'demo-jwt-token-' + Date.now());
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Log success
        console.log(`Login successful as ${user.role}`);
        
        // Redirect based on role
        redirectBasedOnRole(user.role);
      } else {
        setError('Invalid password. Please try again.');
      }
    } else {
      setError('Email not found. Please use demo credentials.');
    }

    setLoading(false);
  };

  // Fill demo credentials
  const fillDemoCredentials = (email, password, role) => {
    setFormData({ 
      email, 
      password 
    });
    setError('');
    
    // Optional: Show which role was selected
    console.log(`Filled ${role} credentials`);
  };

  // Quick login buttons data
  const quickLoginOptions = [
    { 
      email: 'admin@college.edu', 
      password: 'admin123', 
      role: 'admin', 
      label: 'Admin Login',
      icon: '👑'
    },
    { 
      email: 'teacher@college.edu', 
      password: 'teacher123', 
      role: 'teacher', 
      label: 'Teacher Login',
      icon: '👨‍🏫'
    },
    { 
      email: 'student@college.edu', 
      password: 'student123', 
      role: 'student', 
      label: 'Student Login',
      icon: '👨‍🎓'
    }
  ];

  // Logout any existing session when visiting login page
  useEffect(() => {
    // Optional: Clear previous session if needed
    // localStorage.clear();
  }, []);

  return (
    <div className="login-page">
      <main className="login-main">
        <div className="login-container">
          <div className="login-wrapper">
            {/* Left Side - Login Form */}
            <div className="login-form-container">
              <div className="form-header">
                <div className="login-logo">
                  <span className="logo-icon">🎓</span>
                  <h1>Smart Attendance</h1>
                </div>
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to access your account</p>
              </div>

              {error && (
                <div className="error-alert">
                  <span className="error-icon">!</span>
                  <span className="error-text">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <label htmlFor="email" className="input-label">
                    Email Address
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your college email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      disabled={loading}
                      className="login-input"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="password" className="input-label">
                    Password
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      disabled={loading}
                      className="login-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Demo Credentials Section */}
              <div className="demo-section">
                <h4 className="demo-title">Quick Login (Demo)</h4>
                <p className="demo-subtitle">Click any button to auto-fill credentials:</p>
                <div className="demo-buttons">
                  {quickLoginOptions.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`demo-btn ${option.role}`}
                      onClick={() => {
                        fillDemoCredentials(option.email, option.password, option.role);
                        
                        // Auto-login after 300ms (optional)
                        setTimeout(() => {
                          if (!loading) {
                            handleSubmit(new Event('submit'));
                          }
                        }, 300);
                      }}
                      disabled={loading}
                    >
                      <span className="demo-btn-icon">
                        {option.icon}
                      </span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
                
                <div className="demo-credentials-info">
                  <p><strong>Admin:</strong> admin@college.edu / admin123</p>
                  <p><strong>Teacher:</strong> teacher@college.edu / teacher123</p>
                  <p><strong>Student:</strong> student@college.edu / student123</p>
                </div>
              </div>
            </div>

            {/* Right Side - Info Section */}
            <div className="login-info-container">
              <div className="info-content">
                <h3 className="info-title">
                  Smart Attendance System
                </h3>
                <p className="info-description">
                  Advanced facial recognition and GPS-based attendance tracking system
                  for educational institutions.
                </p>

                <div className="features-list">
                  <div className="feature-item">
                    <div className="feature-icon">📍</div>
                    <div className="feature-text">
                      <h4>GPS Verification</h4>
                      <p>Attendance only within campus boundaries</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">👤</div>
                    <div className="feature-text">
                      <h4>Face Recognition</h4>
                      <p>AI-powered secure authentication</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">📊</div>
                    <div className="feature-text">
                      <h4>Real-time Reports</h4>
                      <p>Instant analytics and insights</p>
                    </div>
                  </div>
                </div>

                <div className="role-info">
                  <h4 className="role-title">Available User Roles:</h4>
                  <div className="role-cards">
                    <div className="role-card admin">
                      <div className="role-icon">👑</div>
                      <h5>Administrator</h5>
                      <p>Full system control and management</p>
                    </div>
                    <div className="role-card teacher">
                      <div className="role-icon">👨‍🏫</div>
                      <h5>Teacher</h5>
                      <p>Take attendance and view reports</p>
                    </div>
                    <div className="role-card student">
                      <div className="role-icon">👨‍🎓</div>
                      <h5>Student</h5>
                      <p>Mark attendance and view records</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;