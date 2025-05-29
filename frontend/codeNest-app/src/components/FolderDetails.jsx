import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../API/api";
import "../styles/folderDetails.css";
import AddSnippetModal from "./AddSnippetModal";

const FolderDetails = () => {
  const { id } = useParams();
  const [folder, setFolder] = useState(null);
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/folders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFolder(res.data.folder);
        setSnippets(res.data.snippets); // backend returnerar folder + tillhörande snippets
      } catch (err) {
        console.error("Failed to fetch folder details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFolder();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!folder) return <p>Folder not found</p>;

  return (
    <div className="folder-details">
      <div
        className="folder-header"
        style={{ backgroundColor: folder.color || "#4f46e5" }}
      >
        <h2>📁 {folder.name}</h2>
        {/* TODO: Lägg till 3-dots meny för redigera/radera */}
      </div>

      <AddSnippetModal
        folderId={folder._id}
        existingSnippetIds={snippets.map((s) => s._id)}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSnippetAdded={(newId) => {
          const snippet = snippets.find((s) => s._id === newId);
          if (!snippet) window.location.reload();
        }}
      />

      <div className="folder-actions">
        <button
          className="add-snippets-btn"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Add Snippets
        </button>
      </div>

      <div className="folder-snippets">
        {snippets.length === 0 ? (
          <div className="empty-folder">
            📂 This folder is empty
            <br />
            Click “+ Add Snippets” to organize your code here
          </div>
        ) : (
          <div className="snippet-grid">
            {snippets.map((snippet) => (
              <div key={snippet._id} className="snippet-card">
                <h3>{snippet.title}</h3>
                <p>
                  {snippet.language} — {snippet.category}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderDetails;
