import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API/api";
import "../styles/folderManager.css";
import { FaFolderPlus, FaFolder, FaEllipsisV } from "react-icons/fa";
import FolderModal from "./FolderModal";

const FolderManager = () => {
  const [folders, setFolders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);

  const navigate = useNavigate();

  // === Fetch folders on load ===
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/folders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFolders(res.data);
      } catch (err) {
        console.error("Failed to fetch folders:", err);
      }
    };

    fetchFolders();
  }, []);

  // === Create new folder ===
  const handleCreate = async (folderData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.post("/folders", folderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFolders((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Failed to create folder:", err);
    }
  };

  // === Update folder ===
  const handleUpdate = async (folderId, updatedData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.put(`/folders/${folderId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders((prev) =>
        prev.map((f) => (f._id === folderId ? res.data : f))
      );
    } catch (err) {
      console.error("Failed to update folder:", err);
    }
  };

  // === Delete folder ===
  const handleDelete = async (folderId) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/folders/${folderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders((prev) => prev.filter((f) => f._id !== folderId));
    } catch (err) {
      console.error("Failed to delete folder:", err);
    }
  };

  return (
    <div className="folder-section">
      <h2 className="folder-title">Your Folders</h2>

      <div className="folder-grid">
        {folders.map((folder) => (
          <div
            key={folder._id}
            className="folder-card"
            style={{ backgroundColor: folder.color || "#e5e7eb" }}
            onClick={() => navigate(`/folders/${folder._id}`)} // 👈 Navigera till detaljer
          >
            <div className="folder-icon-wrapper">
              <FaFolder size={24} color="#fcd34d" />
            </div>
            <span className="folder-name">{folder.name}</span>

            {/* Edit menu icon */}
            <FaEllipsisV
              className="folder-menu"
              onClick={(e) => {
                e.stopPropagation(); // 👈 Förhindra att klicket går till kortet
                setEditingFolder(folder);
                setShowModal(true);
              }}
              title="Edit folder"
            />
          </div>
        ))}

        {/* ➕ Create Folder Card */}
        <div
          className="folder-card create-folder"
          onClick={() => {
            setEditingFolder(null); // null = create mode
            setShowModal(true);
          }}
        >
          <div className="folder-icon-wrapper">
            <FaFolderPlus size={24} color="#4f46e5" />
          </div>
          <span className="folder-name">Create Folder</span>
        </div>
      </div>

      {/* === Modal Component === */}
      <FolderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        folderToEdit={editingFolder}
      />
    </div>
  );
};

export default FolderManager;
