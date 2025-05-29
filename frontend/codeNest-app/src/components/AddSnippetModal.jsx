import { useEffect, useState } from "react";
import API from "../API/api";
import "../styles/addSnippetModal.css";

const AddSnippetModal = ({
  folderId,
  existingSnippetIds,
  isOpen,
  onClose,
  onSnippetAdded,
}) => {
  const [snippets, setSnippets] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/snippets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.filter(
          (snippet) => !existingSnippetIds.includes(snippet._id)
        );

        setSnippets(filtered);
      } catch (err) {
        console.error("Failed to fetch snippets:", err);
      }
    };
    if (isOpen) fetchSnippets();
  }, [isOpen, existingSnippetIds]);

  const handleAdd = async (snippetId) => {
    try {
      const token = localStorage.getItem("token");
      await API.patch(
        `/folders/${folderId}/add-snippet`,
        { snippetId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSnippetAdded(snippetId);
    } catch (err) {
      console.error("Failed to add snippet:", err);
    }
  };

  if (!isOpen) return null;

  const filteredSnippets = snippets.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add Snippets to Folder</h3>
        <input
          type="text"
          placeholder="Search snippets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="snippet-list">
          {filteredSnippets.length === 0 ? (
            <p>No snippets available</p>
          ) : (
            filteredSnippets.map((s) => (
              <div key={s._id} className="snippet-preview">
                <strong>{s.title}</strong> - {s.language}
                <button onClick={() => handleAdd(s._id)}>Add</button>
              </div>
            ))
          )}
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AddSnippetModal;
