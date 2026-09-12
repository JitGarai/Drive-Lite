import { useState } from "react";
import { getDownloadUrl, deleteFile } from "../api/fileService";
import ShareModal from "./ShareModal";

export default function FileList({ files, onFileDeleted, onFileUpdated, showShareControls = true, showOwner = false }) {
  const [sharingFile, setSharingFile] = useState(null);
  const validFiles = files.filter(Boolean);

  const handleDownload = async (fileId) => {
    const url = await getDownloadUrl(fileId);
    window.open(url, "_blank");
  };

  const handleDelete = async (fileId) => {
    await deleteFile(fileId);
    onFileDeleted(fileId);
  };

  if (validFiles.length === 0) {
    return <p style={{ color: "#888" }}>No files here.</p>;
  }

  return (
    <>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {validFiles.map((file) => (
          <li key={file._id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem", borderBottom: "1px solid #eee" }}>
            <span>
              {file.originalName}
              {showOwner && file.owner?.email && (
                <span style={{ color: "#888", fontSize: 12, marginLeft: 8 }}>
                  (shared by {file.owner.username || file.owner.email})
                </span>
              )}
            </span>
            <div>
              <button onClick={() => handleDownload(file._id)}>Download</button>
              {showShareControls && (
                <>
                  <button onClick={() => setSharingFile(file)} style={{ marginLeft: 8 }}>Share</button>
                  <button onClick={() => handleDelete(file._id)} style={{ marginLeft: 8 }}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {sharingFile && (
        <ShareModal
          file={sharingFile}
          onClose={() => setSharingFile(null)}
          onUpdated={onFileUpdated}
        />
      )}
    </>
  );
}