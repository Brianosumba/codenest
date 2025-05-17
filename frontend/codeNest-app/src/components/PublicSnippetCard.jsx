import { useState } from "react";
import API from "../API/api";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../styles/sharedSnippets.css";
import "../styles/publicSnippetCard.css";

const PublicSnippetCard = ({ snippet }) => {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const toggleExpand = () => setExpanded(!expanded);

  const handleSaveSnippet = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: snippet.title,
        code: snippet.code,
        description: snippet.description,
        language: snippet.language,
        category: snippet.category,
        tags: snippet.tags,
        type: snippet.type,
        isFavorite: false,
        isShared: false,
      };

      await API.post("/snippets", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSaved(true);
    } catch (err) {
      console.error("Failed to save snippet", err);
      setError("Error saving snippet.");
    }
  };

  const previewDescription = snippet.description?.slice(0, 200);
  const previewCode = snippet.code?.split("\n").slice(0, 5).join("\n");

  return (
    <div className="public-snippet-card">
      <h3>{snippet.title}</h3>
      <p>
        <strong>Language:</strong>
        {snippet.language}
      </p>
      <p>
        <strong>Category:</strong>
        {snippet.category}
      </p>
      <p>
        <strong>Tags:</strong> {snippet.tags.join(", ")}
      </p>

      <h4>Code:</h4>
      <SyntaxHighlighter
        language={snippet.language.toLowerCase() || "javascript"}
        style={oneDark}
        wrapLongLines
      >
        {expanded ? snippet.code : previewCode}
      </SyntaxHighlighter>

      {snippet.description && (
        <>
          <h4>Description</h4>
          {expanded ? (
            <ReactMarkdown>{snippet.description}</ReactMarkdown>
          ) : (
            <p>{previewDescription}...</p>
          )}
        </>
      )}

      <div className="snippet-actions">
        <button className="toggle-btn" onClick={toggleExpand}>
          {expanded ? "View Less" : "View More"}
        </button>

        <button
          className="save-btn"
          onClick={handleSaveSnippet}
          disabled={saved}
        >
          {saved ? "✅ Saved" : "💾 Save to My Snippets"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default PublicSnippetCard;
