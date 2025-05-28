import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { useNavigate, Link } from "react-router-dom";
import API from "../API/api";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import FolderManager from "./FolderManager";

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User"; // Placeholder tills vi bygger auth-context

  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

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
        console.log("✅ Snippets fetched from API:", res.data);
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

  useEffect(() => {
    console.log("Snippets fetched from API:", snippets);
  }, [snippets]);

  const filteredSnippets = snippets.filter((snippet) => {
    const query = searchQuery.toLowerCase();

    const matchTitle = snippet.title?.toLowerCase().includes(query);
    const matchLanguage = snippet.language?.toLowerCase().includes(query);
    const matchCategory = snippet.category?.toLowerCase().includes(query);
    const matchTags = Array.isArray(snippet.tags)
      ? snippet.tags.some((tag) => tag.toLowerCase().includes(query))
      : false;

    const categoryMatch =
      selectedCategory.toLowerCase() === "all" ||
      snippet.category?.toLowerCase() === selectedCategory.toLowerCase();

    const favoriteMatch = !showFavoritesOnly || snippet.isFavorite;

    return (
      (matchTitle || matchLanguage || matchTags || matchCategory) &&
      categoryMatch &&
      favoriteMatch
    );
  });

  const uniqueCategories = ["All", ...new Set(snippets.map((s) => s.category))];

  return (
    <div className="dashboard-container">
      <div className="welcome-card">
        <h1>Welcome to CodeNest, {username}!</h1>
        <p>Manage your code snippets and learning journey easily</p>

        <FolderManager />
      </div>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by title, language or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <label style={{ marginTop: "1rem", display: "block" }}>
        <input
          type="checkbox"
          checked={showFavoritesOnly}
          onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
        />
        Show only favorites
      </label>

      <div className="recent-snippets">
        <h2>Your Snippets</h2>
        {loading ? (
          <p>Loading snippets...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : filteredSnippets.length === 0 ? (
          <p>No snippets matched your search.</p>
        ) : (
          <div className="snippet-grid">
            {filteredSnippets.map((snippet) => (
              <div key={snippet._id} className="snippet-card">
                <div className="snippet-header">
                  <h3 className="snippet-title">{snippet.title}</h3>
                  <div className="snippet-subtitle">
                    <span>Language: {snippet.language}</span>
                    <span>Category: {snippet.category}</span>
                  </div>
                </div>

                <div className="snippet-tags">
                  {snippet.tags.map((tag) => (
                    <span key={tag} className={`tag ${tag.toLowerCase()}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="snippet-code-preview">
                  <SyntaxHighlighter
                    language={snippet.language.toLowerCase()}
                    style={vscDarkPlus}
                    customStyle={{ background: "none", padding: 0 }}
                    wrapLines={true}
                    showLineNumbers={false}
                  >
                    {snippet.code.split("\n").slice(0, 10).join("\n")}
                  </SyntaxHighlighter>
                </div>

                <div className="snippet-actions">
                  <Link to={`/snippet/${snippet._id}`} className="view-link">
                    View Snippet
                  </Link>
                  {snippet.isFavorite ? (
                    <AiFillStar color="gold" title="Favorite" />
                  ) : (
                    <AiOutlineStar color="#ccc" title="Not Favorite" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cta-snippet">
        <button onClick={handleCreateSnippet}>Create New Snippet</button>
      </div>

      <div className="dashboard-action">
        <button
          className="public-snippets-btn"
          onClick={() => navigate("/shared")}
        >
          View Public Snippets
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
