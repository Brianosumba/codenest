import { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import API from "../API/api";
import SnippetCard from "./SnippetCard";
import FolderManager from "./FolderManager";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const username = user?.name || "User";

  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [starterSnippets, setStarterSnippets] = useState([]);

  const handleCreateSnippet = () => {
    navigate("/create-snippet");
  };

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const token = localStorage.getItem("token");

        const [userRes, starterRes] = await Promise.all([
          API.get("/snippets", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/snippets/starter"),
        ]);

        setSnippets(userRes.data);
        setStarterSnippets(starterRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load snippets.");
      } finally {
        setLoading(false);
      }
    };
    fetchSnippets();
  }, []);

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

  const sortedSnippets = [...filteredSnippets].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

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
        <h2>My Snippets</h2>
        {loading ? (
          <p>Loading snippets...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : filteredSnippets.length === 0 ? (
          <p>No snippets matched your search.</p>
        ) : (
          <div className="snippet-grid">
            {sortedSnippets.map((snippet) => (
              <SnippetCard key={snippet._id} snippet={snippet} />
            ))}
          </div>
        )}
      </div>

      <div className="recent-snippets">
        <h2>Example Snippets</h2>

        {starterSnippets.length === 0 ? (
          <p>No example snippets available.</p>
        ) : (
          <div className="snippet-grid">
            {starterSnippets.map((snippet) => (
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                showDescription={true}
              />
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
