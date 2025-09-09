import React, { useEffect, useState } from 'react';
import api from '../api';
import UploadModal from '../components/UploadModal';

export default function Dashboard(){
  const [folders, setFolders] = useState([]);
  const [currentParent, setCurrentParent] = useState(null);
  const [images, setImages] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [q, setQ] = useState('');

  const fetchFolders = async (parent=null) => {
    const res = await api.get('/folders', { params: { parent } });
    setFolders(res.data);
  };
  const fetchImages = async (folder=null) => {
    const res = await api.get('/images', { params: { folder } });
    setImages(res.data);
  };

  useEffect(()=>{ fetchFolders(null); fetchImages(null); }, []);

  async function createFolder(){
    if (!folderName) return;
    await api.post('/folders', { name: folderName, parent: currentParent });
    setFolderName('');
    fetchFolders(currentParent);
  }

  function goToFolder(id){
    setCurrentParent(id);
    fetchFolders(id);
    fetchImages(id);
  }

  function goUp(){
    setCurrentParent(null);
    fetchFolders(null);
    fetchImages(null);
  }

  async function doSearch(e){
    e.preventDefault();
    if (!q) return fetchImages(currentParent);
    const res = await api.get('/images/search', { params: { q } });
    setImages(res.data);
  }

  function logout(){
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return (
    <div className="dashboard">
      <div className="top">
        <h2>Dashboard</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="controls">
        <button onClick={goUp}>Go to Root</button>
        <div className="create-folder">
          <input placeholder="New folder name" value={folderName} onChange={e=>setFolderName(e.target.value)} />
          <button onClick={createFolder}>Create Folder</button>
        </div>
      </div>

      <div className="content">
        <div className="folders">
          <h3>Folders</h3>
          <ul>
            {folders.map(f => (
              <li key={f._id}>
                <button className="folder-btn" onClick={()=>goToFolder(f._id)}>{f.name}</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="images-section">
          <div className="search-upload">
            <form onSubmit={doSearch}>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search images by name" />
              <button>Search</button>
            </form>
            <UploadModal currentFolder={currentParent} onUploaded={() => fetchImages(currentParent)} />
          </div>

          <div className="images-grid">
            {images.map(img => (
              <div key={img._id} className="image-card">
                <img src={img.url} alt={img.name} />
                <div className="image-name">{img.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
