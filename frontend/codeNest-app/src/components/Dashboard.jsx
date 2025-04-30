import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import API from "../API/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User"; // Placeholder tills vi bygger auth-context

  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleCreateSnippet = () => {
    navigate("/create-snippet");
  };

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/snippets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSnippets(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load snippets.");
      } finally {
        setLoading(false);
      }
    };
    fetchSnippets();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="welcome-card">
        <h1>Welcome to CodeNest, {username}!</h1>
        <p>Manage your code snippets and learning journey easily</p>
      </div>

      <div className="recent-snippets">
        <h2>Your Snippets</h2>
        {loading ? (
          <p>Loading snippets...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : snippets.length === 0 ? (
          <p>No snippets found. Start by creating one!</p>
        ) : (
          <ul>
            {snippets.map((snippet) => (
              <li key={snippet._id}>
                <strong>{snippet.title}</strong>{" "}
                <span>({snippet.language})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="cta-snippet">
        <button onClick={handleCreateSnippet}>Create New Snippet</button>
      </div>
    </div>
  );
};

export default Dashboard;
