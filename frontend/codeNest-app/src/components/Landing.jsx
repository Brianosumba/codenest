import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import API from "../API/api";
import "../styles/landing.css";

import { languageToMonacoId } from "../config/snippetConfig";

const Landing = () => {
  const [snippets, setSnippets] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const res = await API.get("/snippets/starter");
        console.log("✅ Snippets fetched from API:", res.data);
        setSnippets(res.data);
      } catch (err) {
        console.error("Failed to fetch public snippets");
      }
    };
    fetchSnippets();
  }, []);

  const handleViewMore = (id) => {
    if (user) {
      navigate(`/snippets/${id}`);
    } else {
      navigate("/login");
    }
  };
  const getMonacoLanguage = (lang) => {
    if (!lang) return "javascript";
    return languageToMonacoId[lang] || "javascript";
  };

  const getMarkdownPreview = (markdown) => {
    const explanationIndex = markdown.indexOf("## Code Explanation");

    if (explanationIndex !== -1) {
      // Hämta hela "What You'll Learn" och allt före
      const before = markdown.slice(0, explanationIndex).trim();

      // Ta ut rubrik + 1–2 meningar efter "## Code Explanation"
      const afterStart = markdown.slice(explanationIndex);
      const sentences = afterStart.split(/(?<=[.!?])\s+/); // split per mening

      const codeExplanationPreview = sentences.slice(0, 3).join(" ").trim();

      return `${before}\n\n${codeExplanationPreview}\n\n...`;
    }

    // Fallback om ingen Code Explanation finns
    const fallback = markdown.replace(/[#*_`]/g, "");
    return fallback.length > 160 ? fallback.slice(0, 160) + "..." : fallback;
  };

  return (
    <div className="landing-page">
      {/* HERO */}
      <section className="hero-section">
        <h1 className="hero-title">Welcome to CodeNest 🪺</h1>
        <p className="hero-subtitle">
          Your personal snippet vault. Save, organize and learn code – smarter.
        </p>
        <div className="auth-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      </section>

      {/* SNIPPET CARDS */}
      <section className="snippet-preview-section">
        {snippets.length > 0 ? (
          snippets.slice(0, 8).map((snippet) => (
            <div key={snippet._id} className="snippet-card">
              <h3>{snippet.title}</h3>
              <p>
                <strong>Language:</strong> {snippet.language}
              </p>
              <p>
                <strong>Category:</strong> {snippet.category}
              </p>
              <div className="tags">
                {snippet.tags.map((tag, i) => (
                  <span key={i} className={`tag ${tag.toLowerCase()}`}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="snippet-code">
                <Editor
                  height="250px"
                  language={getMonacoLanguage(snippet.language)}
                  value={snippet.code}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    fontSize: 13,
                    wordWrap: "on",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    lineNumbers: "off",
                  }}
                />
              </div>

              <div className="snippet-description">
                <ReactMarkdown>
                  {getMarkdownPreview(snippet.description)}
                </ReactMarkdown>
              </div>

              <button onClick={() => handleViewMore(snippet._id)}>
                View More
              </button>
            </div>
          ))
        ) : (
          <div className="no-snippets">
            <h3>No public snippets yet</h3>
            <p>Be the first to share your knowledge on CodeNest!</p>
            <button onClick={() => navigate("/register")}>Get Started</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Landing;
