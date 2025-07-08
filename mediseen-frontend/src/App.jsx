import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard'; // You can keep this for admin/old use
import Landing from './components/Landing';
import ProtectedRoute from './components/ProtectedRoute';
import CompleteProfile from "./components/CompleteProfile";
import MainUserDashboard from "./components/MainUserDashboard"; // NEW

const App = () => {
  return (
    <GoogleOAuthProvider clientId="your-client-id">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/profile-completion" 
            element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mainuserdashboard" 
            element={
              <ProtectedRoute>
                <MainUserDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
