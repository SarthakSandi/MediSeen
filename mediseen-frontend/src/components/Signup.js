import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address (e.g., gmail.com, yahoo.com, etc.).");
      return;
    }
    if (!passwordRegex.test(password)) {
      alert("Password must contain at least one lowercase, one uppercase, one number, and one special character.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/signup", {
        name,
        email,
        password,
      });
      alert("Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="signup-heading">Create an Account</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-input"
            required
          />
          <button type="submit" className="auth-button">
            Sign Up
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
