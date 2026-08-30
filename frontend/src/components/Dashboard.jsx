import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FileUpload from './FileUpload';
import FileList from './FileList';
import { listFiles } from '../api/fileService';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const loadFiles = async () => {
    try {
      const data = await listFiles(null); // root folder for now
      setFiles(data);
    } catch (err) {
      console.error('Failed to load files:', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUploadComplete = (newFile) => {
    setFiles((prev) => [...prev, newFile]);
  };

  const handleFileDeleted = (fileId) => {
    setFiles((prev) => prev.filter((f) => f._id !== fileId));
  };

  useEffect(() => {
  console.log("files state:", files);
}, [files]);
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

        <div className="files-section">
          <h3>My Files</h3>
          <FileUpload folderId={null} onUploadComplete={handleUploadComplete} />

          {loadingFiles ? (
            <p>Loading files...</p>
          ) : (
            <FileList files={files} onFileDeleted={handleFileDeleted} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;