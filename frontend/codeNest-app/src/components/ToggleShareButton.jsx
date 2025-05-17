import React, { useState } from "react";
import API from "../API/api";
import "../styles/toggleShareButton.css";

const ToggleShareButton = ({ snippetId, isSharedInitial }) => {
  const [isShared, setIsShared] = useState(isSharedInitial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleShare = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await API.patch(
        `/snippets/${snippetId}/share`,
        { isShared: !isShared },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsShared(res.data.isShared);
    } catch (err) {
      console.error(err);
      setError("Could not update sharing status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="toggle-share-container">
      <button
        className={`share-toggle-btn ${isShared ? "shared" : ""}`}
        onClick={toggleShare}
        disabled={loading}
      >
        {" "}
        {loading
          ? "updating..."
          : isShared
          ? "🔒 Make Private"
          : "🌍 Share Publicly"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ToggleShareButton;
