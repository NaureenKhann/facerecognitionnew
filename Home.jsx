import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const Home = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
     <Navbar />

      {/* Hero Section */}
      <main className="hero-section">
        <div className='home'>
          <div className="hero-content">
            <div className="hero-text-container">
              <div className="title-wrapper">
                <h2 className="hero-title">
                  Facial Recognition<br />
                  <span className="highlight">Attendance System</span>
                </h2>
                <div className="title-decoration">
                  <div className="decoration-line"></div>
                  <div className="decoration-dot"></div>
                  <div className="decoration-line"></div>
                </div>
              </div>
              
              <p className="hero-description">
                Secure, accurate, and efficient attendance tracking using AI and GPS technology.
                Mark attendance only within campus premises with facial verification.
              </p>
              
              <div className="cta-buttons">
                <Link to="/Login" className="cta-btn primary-btn">
                  <span className="btn-text">Login to Your Account</span>
                  <span className="btn-icon">→</span>
                </Link>
                <Link to="/Register" className="cta-btn secondary-btn">
                  <span className="btn-text">Create New Account</span>
                  <span className="btn-icon">+</span>
                </Link>
              </div>
            </div>
            
            <div className="features-container">
              <div className="features-title">Key Features</div>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">📍</div>
                    <div className="icon-glow"></div>
                  </div>
                  <h3 className="feature-title">GPS Location Verification</h3>
                  <p className="feature-desc">Ensures attendance is marked only within authorized campus boundaries</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">👤</div>
                    <div className="icon-glow"></div>
                  </div>
                  <h3 className="feature-title">Face Recognition</h3>
                  <p className="feature-desc">Advanced AI-powered facial verification for secure authentication</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">📊</div>
                    <div className="icon-glow"></div>
                  </div>
                  <h3 className="feature-title">Real-time Reports</h3>
                  <p className="feature-desc">Instant analytics and reporting for administrators and students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
     <Footer/>
    </div>
  );
};

export default Home;