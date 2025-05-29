import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../API/api";
import "../styles/folderDetails.css";
import AddSnippetModal from "./AddSnippetModal";
import SnippetCard from "./SnippetCard";

const FolderDetails = () => {
  const { id } = useParams();
  const [folder, setFolder] = useState(null);
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleRemoveSnippet = async (snippetId) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this snippet?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/folders/${id}/remove-snippet`,
        { snippetId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Uppdatera UI utan att refetcha
      setSnippets((prev) => prev.filter((s) => s._id !== snippetId));
    } catch (err) {
      console.error("❌ Failed to remove snippet from folder:", err);
    }
  };

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
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                showRemoveButton={true}
                onRemove={() => handleRemoveSnippet(snippet._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderDetails;
