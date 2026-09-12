import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export default function SharedFile() {
  const { fileId } = useParams();
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [fileName, setFileName] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchLink = async () => {
      try {
        // plain axios call — deliberately NOT using the app's authenticated
        // instance, since this page must work for logged-out visitors too
        const { data } = await axios.get(
          `${API_BASE}/files/${fileId}/public-download-url`
        );
        setDownloadUrl(data.downloadUrl);
        setFileName(data.fileName);
        setStatus("ready");
      } catch (err) {
        setErrorMsg(err.response?.data?.error || "This link is invalid or expired.");
        setStatus("error");
      }
    };

    fetchLink();
  }, [fileId]);

  if (status === "loading") {
    return <div style={containerStyle}><p>Loading shared file...</p></div>;
  }

  if (status === "error") {
    return (
      <div style={containerStyle}>
        <h2>Unable to access file</h2>
        <p>{errorMsg}</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2>{fileName}</h2>
      <p>This file has been shared with you.</p>
      <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
        <button style={{ padding: "0.5rem 1rem", fontSize: 16 }}>Download</button>
      </a>
    </div>
  );
}

const containerStyle = {
  maxWidth: 500,
  margin: "4rem auto",
  padding: "2rem",
  textAlign: "center",
  fontFamily: "sans-serif",
};