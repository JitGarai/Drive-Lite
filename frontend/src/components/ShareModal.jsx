// src/components/ShareModal.jsx
import { useState } from "react";
import { shareFile, togglePublic } from "../api/fileService";

export default function ShareModal({ file, onClose, onUpdated }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPublic, setIsPublic] = useState(file.isPublic);

  const handleShare = async () => {
    try {
      await shareFile(file._id, email);
      setMessage(`Shared with ${email}`);
      setEmail("");
      onUpdated();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to share");
    }
  };

  const handleTogglePublic = async () => {
    try {
      const result = await togglePublic(file._id, !isPublic);
      setIsPublic(result.isPublic);
      onUpdated();
    } catch (err) {
      setMessage("Failed to update link sharing");
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/shared/${file._id}`;
    navigator.clipboard.writeText(link);
    setMessage("Link copied!");
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Share "{file.originalName}"</h3>

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="email"
            placeholder="Enter email to share with"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "70%", marginRight: "0.5rem" }}
          />
          <button onClick={handleShare}>Share</button>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            <input type="checkbox" checked={isPublic} onChange={handleTogglePublic} />
            {" "}Anyone with the link can access
          </label>
        </div>

        {isPublic && (
          <button onClick={copyLink} style={{ marginBottom: "1rem" }}>
            Copy public link
          </button>
        )}

        {message && <p style={{ fontSize: 12, color: "#555" }}>{message}</p>}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.4)", display: "flex",
  alignItems: "center", justifyContent: "center",
};

const modalStyle = {
  background: "white", padding: "1.5rem", borderRadius: 8,
  width: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
};