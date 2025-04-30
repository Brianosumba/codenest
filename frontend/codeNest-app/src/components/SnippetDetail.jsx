import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../API/api";
import "../styles/snippetDetail.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

const SnippetDetail = () => {
  const { id } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/snippets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnippet(res.data);
      } catch (err) {
        setError("Failed to load snippet");
      } finally {
        setLoading(false);
      }
    };
    fetchSnippet();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!snippet) return <p>No snippet found.</p>;

  return (
    <div className="snippet-detail-container">
      <h2>{snippet.title}</h2>
      <p>
        <strong>Language:</strong>

        {snippet.language}
      </p>
      <p>
        <strong>Category:</strong>

        {snippet.category}
      </p>
      <p>
        <strong>Tags:</strong>

        {snippet.tags.join(", ")}
      </p>
      <SyntaxHighlighter
        language={snippet.language?.toLowerCase() || "javascript"}
        style={oneDark}
      >
        {snippet.code}
      </SyntaxHighlighter>
      {snippet.description && (
        <>
          <h3>Description</h3>
          <ReactMarkdown>{snippet.description}</ReactMarkdown>
        </>
      )}
    </div>
  );
};

export default SnippetDetail;
