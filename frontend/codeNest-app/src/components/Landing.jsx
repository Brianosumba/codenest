import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import API from "../API/api";
import "../styles/landing.css";

import { languageToMonacoId } from "../config/snippetConfig";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
    if (!markdown) return "";

    // Matcha rubrik: ## Code Explanation (case insensitive)
    const codeExpRegex = /##\s*Code Explanation/i;
    const match = markdown.match(codeExpRegex);

    if (match && match.index !== undefined) {
      const before = markdown.slice(0, match.index).trim();

      // Hämta all text från rubriken och framåt
      const after = markdown.slice(match.index).trim();

      // Sluta vid nästa sektion eller "analogy" etc.
      const endMatch = after.search(/(\n##\s+|\n---|\n###\s+Analogy)/i);
      const codeSection =
        endMatch !== -1 ? after.slice(0, endMatch).trim() : after;

      const sentences = codeSection
        .split(/(?<=[.!?])\s+/)
        .slice(0, 3)
        .join(" ")
        .trim();

      return `${before}\n\n${sentences}\n\n...`;
    }

    // Fallback
    const fallback = markdown
      .split(/(?<=[.!?])\s+/)
      .slice(0, 5)
      .join(" ")
      .trim();

    return `${fallback}\n\n...`;
  };

  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const langKey = match ? match[1] : "";

      const resolvedLanguage =
        Object.entries(languageToMonacoId).find(
          ([_, monacoLang]) =>
            monacoLang.toLowerCase() === langKey.toLowerCase()
        )?.[1] || "javascript";

      if (!inline) {
        return (
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={resolvedLanguage}
            PreTag="div"
            className="snippet-markdown-code"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        );
      }

      return (
        <code className="snippet-inline-code" {...props}>
          {children}
        </code>
      );
    },
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
              <h3 className="snippet-title">{snippet.title}</h3>

              <div className="snippet-meta">
                <div>
                  <span className="snippet-label">Language:</span>{" "}
                  <span className="snippet-value">{snippet.language}</span>
                </div>
                <div>
                  <span className="snippet-label">Category:</span>{" "}
                  <span className="snippet-value">{snippet.category}</span>
                </div>
              </div>

              <div className="tags">
                {snippet.tags?.map((tag, i) => {
                  const label = String(tag ?? "").trim();
                  const safeClass = label
                    .toLowerCase()
                    .replace(/[^a-z0-9_-]/g, "-");

                  return (
                    <span
                      key={`${safeClass}-${i}`}
                      className={`tag tag-${safeClass}`}
                      title={label}
                    >
                      {label}
                    </span>
                  );
                })}
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
                <ReactMarkdown
                  components={markdownComponents}
                  disallowedElements={["p"]}
                  unwrapDisallowed={true}
                >
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
