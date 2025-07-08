import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (!user || !token) {
        alert("User data or token missing");
        return;
      }

      // Save token and user to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect based on profile completion
      if (user.profileComplete) {
  navigate("/mainuserdashboard");
} else {
  navigate("/profile-completion");
}

    } catch (error) {
      console.error("Login error:", error.response || error);
      alert(
        error.response?.data?.error || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="signup-heading">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <p className="auth-link">
          Don’t have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
