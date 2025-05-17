import React, { useEffect, useState } from "react";
import API from "../API/api";
import { useNavigate } from "react-router-dom";
import "../styles/sharedSnippets.css";

const SharedSnippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSharedSnippets = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/snippets/shared", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSnippets(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load shared snippets.");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedSnippets();
  }, []);

  if (loading) return <p>Loading shared snippets...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="shared-snippets-container">
      <h2>Public Snippets</h2>
      {snippets.length === 0 ? (
        <p>No shared snippets yet.</p>
      ) : (
        <div className="snippet-grid">
          {snippets.map((snippet) => (
            <div
              key={snippet._id}
              className="snippet-card"
              onClick={() => navigate(`/snippets/${snippet._id}`)}
            >
              <h3>{snippet.title}</h3>
              <p>
                <strong>Language:</strong>
                {snippet.language}
              </p>
              <p>
                <strong>Category:</strong>
                {snippet.category}
              </p>
              {snippet.description && (
                <p className="snippet-description">
                  {snippet.description.slice(0, 120)}...
                </p>
              )}
              <div className="tags">
                {snippet.tags &&
                  snippet.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedSnippets;
