import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../API/api";
import "../styles/snippetDetail.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Toast from "../components/Toast";

const SnippetDetail = () => {
  const { id } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [pulse, setPulse] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/snippets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnippet(res.data);
        setIsFavorite(res.data.isFavorite);
      } catch (err) {
        setError("Failed to load snippet");
      } finally {
        setLoading(false);
      }
    };
    fetchSnippet();
  }, [id]);

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.patch(`/snippets/${id}/favorite`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedFavorite = res.data.isFavorite;
      setIsFavorite(updatedFavorite);
      setToastMessage(
        updatedFavorite ? "Added to favorites" : "Removed from favorites"
      );
      setToastType(updatedFavorite ? "success" : "info");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Failed to toggle favorites", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!snippet) return <p>No snippet found.</p>;

  return (
    <div className="snippet-detail-container">
      <div className="snippet-header">
        <h2>{snippet.title}</h2>
        <button
          onClick={() => {
            handleToggleFavorite();
            setPulse(true);
            setTimeout(() => setPulse(false), 300); // tar bort animation efter 300ms
          }}
          className={`favorite-btn ${isFavorite ? "favorited" : ""} ${
            pulse ? "pulse" : ""
          }`}
        >
          {isFavorite ? (
            <AiFillStar size={24} color="gold" />
          ) : (
            <AiOutlineStar size={24} color="gray" />
          )}
        </button>
      </div>
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
      <Toast message={toastMessage} visible={showToast} type={toastType} />
    </div>
  );
};

export default SnippetDetail;
