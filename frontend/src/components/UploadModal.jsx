import React, { useState } from 'react';
import api from '../api';

export default function UploadModal({ currentFolder, onUploaded }){
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);

  async function submit(e){
    e.preventDefault();
    if (!file || !name) return alert('provide name and image');
    const data = new FormData();
    data.append('image', file);
    data.append('name', name);
    if (currentFolder) data.append('folder', currentFolder);

    try {
      await api.post('/images/upload', data, { headers: {'Content-Type': 'multipart/form-data'} });
      setName(''); setFile(null);
      if (onUploaded) onUploaded();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  }

  return (
    <form onSubmit={submit} className="upload-form">
      <input placeholder="Image name" value={name} onChange={e=>setName(e.target.value)} />
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
      <button>Upload</button>
    </form>
  );
}
