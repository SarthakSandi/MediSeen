// src/components/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import reminderImg from "../assets/reminder.png";


const Landing = () => {
  return (
    <div className="landing-container">
      <nav className="navbar">
        <h1 className="logo">Mediseen</h1>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </nav>

      <div className="landing-content">
        <div className="text">
          <h2>Never Miss a Medicine Again</h2>
          <p>Mediseen is your personal reminder for all your medications. Simple. Friendly. Reliable.</p>
          <Link to="/signup" className="cta-button">Get Started</Link>
        </div>
        <div className="image">
          <img src={reminderImg} alt="Reminder" />
        </div>
      </div>

      <footer>
        <p>© 2025 Mediseen. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
