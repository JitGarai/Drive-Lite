import { useState } from "react";
import { uploadFile } from "../api/fileService";

export default function FileUpload({ folderId, onUploadComplete }) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setProgress(0);

    try {
      const savedFile = await uploadFile(file, folderId, setProgress);
      onUploadComplete(savedFile);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <input type="file" onChange={handleFileChange} disabled={uploading} />

      {uploading && (
        <div style={{ marginTop: "0.5rem" }}>
          <div style={{ background: "#eee", borderRadius: 4, overflow: "hidden", height: 8 }}>
            <div
              style={{
                width: `${progress}%`,
                background: "#4f46e5",
                height: "100%",
                transition: "width 0.2s",
              }}
            />
          </div>
          <span style={{ fontSize: 12 }}>{progress}%</span>
        </div>
      )}

      {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}
    </div>
  );
}