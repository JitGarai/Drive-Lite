import { getDownloadUrl, deleteFile } from "../api/fileService";

export default function FileList({ files, onFileDeleted }) {
  const validFiles = files.filter(Boolean); // drops any undefined/null entries

  const handleDownload = async (fileId) => {
    const url = await getDownloadUrl(fileId);
    window.open(url, "_blank");
  };

  const handleDelete = async (fileId) => {
    await deleteFile(fileId);
    onFileDeleted(fileId);
  };

  if (validFiles.length === 0) {
    return <p style={{ color: "#888" }}>No files yet. Upload something!</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {validFiles.map((file) => (
        <li
          key={file._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.5rem",
            borderBottom: "1px solid #eee",
          }}
        >
          <span>{file.originalName}</span>
          <div>
            <button onClick={() => handleDownload(file._id)}>Download</button>
            <button onClick={() => handleDelete(file._id)} style={{ marginLeft: 8 }}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}