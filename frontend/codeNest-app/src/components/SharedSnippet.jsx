import React, { useEffect, useState } from "react";
import API from "../API/api";
import "../styles/sharedSnippets.css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

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
          <div key={snippet._id} className="snippet-card">
            <h3>{snippet.title}</h3>
            <p>
              <strong>Language:</strong> {snippet.language}
            </p>
            <p>
              <strong>Category:</strong> {snippet.category}
            </p>
            <p>
              <strong>Tags:</strong>{" "}
              {Array.isArray(snippet.tags)
                ? snippet.tags.join(", ")
                : snippet.tags}
            </p>

            {/* Description */}
            {snippet.description && (
              <>
                <h4>Description</h4>
                <ReactMarkdown>{snippet.description}</ReactMarkdown>
              </>
            )}

            {/* Code */}
            <h4>Code</h4>
            <SyntaxHighlighter
              language={snippet.language?.toLowerCase() || "javascript"}
              style={oneDark}
              showLineNumbers
              wrapLongLines
            >
              {snippet.code}
            </SyntaxHighlighter>
          </div>
        ))
      )}
    </div>
  );
};

export default SharedSnippets;
