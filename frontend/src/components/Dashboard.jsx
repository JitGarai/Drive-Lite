import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FileUpload from './FileUpload';
import FileList from './FileList';
import { listFiles, listSharedWithMe } from '../api/fileService';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [activeTab, setActiveTab] = useState("myFiles"); // "myFiles" | "sharedWithMe"

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const loadFiles = async () => {
    try {
      const [myFiles, shared] = await Promise.all([
        listFiles(null),
        listSharedWithMe(),
      ]);
      setFiles(myFiles);
      setSharedFiles(shared);
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

  const handleFileUpdated = () => {
    loadFiles(); // simplest way to keep sharedWith/isPublic in sync after ShareModal changes
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

        <div className="files-section">
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <button
              onClick={() => setActiveTab("myFiles")}
              style={{ fontWeight: activeTab === "myFiles" ? "bold" : "normal" }}
            >
              My Files
            </button>
            <button
              onClick={() => setActiveTab("sharedWithMe")}
              style={{ fontWeight: activeTab === "sharedWithMe" ? "bold" : "normal" }}
            >
              Shared With Me
            </button>
          </div>

          {activeTab === "myFiles" && (
            <>
              <FileUpload folderId={null} onUploadComplete={handleUploadComplete} />
              {loadingFiles ? (
                <p>Loading files...</p>
              ) : (
                <FileList
                  files={files}
                  onFileDeleted={handleFileDeleted}
                  onFileUpdated={handleFileUpdated}
                  showShareControls={true}
                />
              )}
            </>
          )}

          {activeTab === "sharedWithMe" && (
            loadingFiles ? (
              <p>Loading files...</p>
            ) : (
              <FileList
                files={sharedFiles}
                onFileDeleted={() => {}} // shared users can't delete files they don't own
                onFileUpdated={handleFileUpdated}
                showShareControls={false}
                showOwner={true}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;