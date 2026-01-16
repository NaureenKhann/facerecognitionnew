// components/Navbar.jsx - CORRECT
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Import CSS separately
import '../styles/Navbar.css';
import '../styles/Footer.css';
import '../styles/Login.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <span className="logo-icon">🎓</span>
          <h1>Smart Attendance</h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;