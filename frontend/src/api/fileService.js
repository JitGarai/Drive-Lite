import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export async function uploadFile(file, folderId = null, onProgress){
    const { data } = await axios.post(`${API_BASE}/files/generate-upload-url`, {
        fileName: file.name,
        fileType: file.type,
    })

    const {uploadUrl, key} = data;

    await axios.put( uploadUrl, file, {
        headers: {
            "Content-Type": file.type,
            Authorization: undefined,
        },
        onUploadProgress: (event) => {
            if(onProgress){
                const present = Math.round((event.loaded*100)/event.total);
                onProgress(present);
            }
        }
    })

    const{ data: savedFies } = await axios.post(`${API_BASE}/files`, {
        key,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        folder: folderId,
    });

    return savedFies;
}
export async function listFiles(folderId = null) {
    const { data } = await axios.get(`${API_BASE}/files`, {
        params: { folder: folderId},

    })
    return data;   
}

export async function getDownloadUrl(fileId){
    const { data } = await axios.get(`${API_BASE}/files/${fileId}/download-url`);
    return data.downloadUrl
}
export async function deleteFile(fileId) {
    await axios.delete(`${API_BASE}/files/${fileId}`);
}

export async function shareFile(fileId, email) {
  const { data } = await axios.post(`${API_BASE}/files/${fileId}/share`, { email });
  return data;
}

export async function unshareFile(fileId, userId) {
  const { data } = await axios.delete(`${API_BASE}/files/${fileId}/share/${userId}`);
  return data;
}

export async function togglePublic(fileId, isPublic) {
  const { data } = await axios.patch(`${API_BASE}/files/${fileId}/public`, { isPublic });
  return data;
}

export async function listSharedWithMe() {
  const { data } = await axios.get(`${API_BASE}/files/shared-with-me`);
  return data;
}