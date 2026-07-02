import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
      <div className="dashboard-content">
        <h2>Welcome, {user?.username}!</h2>
        <div className="user-info">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Account Created:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="protected-message">
          <p>This is a protected route. Only authenticated users can see this content.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;