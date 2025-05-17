import { useEffect, useState } from "react";
import API from "../API/api";
import "../styles/sharedSnippets.css";
import PublicSnippetCard from "./PublicSnippetCard";

const SharedSnippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedSnippets = async () => {
      try {
        const res = await API.get("/snippets/shared");
        setSnippets(res.data);
      } catch (err) {
        console.error("Failed to fetch shared snippets", err);
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
      <h2>🌍 Public Snippets</h2>
      {snippets.length === 0 ? (
        <p>No public snippets found.</p>
      ) : (
        snippets.map((snippet) => (
          <PublicSnippetCard key={snippet._id} snippet={snippet} />
        ))
      )}
    </div>
  );
};

export default SharedSnippets;
