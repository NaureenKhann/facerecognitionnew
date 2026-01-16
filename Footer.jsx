import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/Footer.css';
const Footer = () => {
    return (
<footer className="footer">
        <div className="footer-content">
          <p>© 2024 Smart Attendance System. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    );
};

export default Footer;