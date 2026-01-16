import { Link } from "react-router-dom";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../styles/snippetCard.css";

const SnippetCard = ({ snippet, showDescription = false, showTags = true }) => {
  return (
    <div className="snippet-card">
      <div className="snippet-header">
        <h3 className="snippet-title">{snippet.title}</h3>

        <div className="snippet-subtitle-rows">
          <div className="snippet-row">
            <span className="snippet-label">Language</span>
            <span className="snippet-value">{snippet.language}</span>
          </div>
          <div className="snippet-row">
            <span className="snippet-label">Category</span>
            <span className="snippet-value">{snippet.category}</span>
          </div>
        </div>
      </div>

      {showTags && snippet.tags?.length > 0 && (
        <div className="snippet-tags">
          {snippet.tags.map((tag) => {
            const label = tag.trim();
            const safeClass = label.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
            return (
              <span
                key={safeClass}
                className={`tag tag-${safeClass}`}
                title={label}
              >
                {label}
              </span>
            );
          })}
        </div>
      )}

      <div className="snippet-code-preview">
        <SyntaxHighlighter
          language={snippet.language?.toLowerCase()}
          style={vscDarkPlus}
          wrapLines={true}
          customStyle={{ background: "none", padding: 0 }}
          showLineNumbers={false}
        >
          {snippet.code
            ? snippet.code.split("\n").slice(0, 10).join("\n")
            : "// No code provided"}
        </SyntaxHighlighter>
      </div>

      {showDescription && snippet.description && (
        <p className="snippet-description">{snippet.description}</p>
      )}

      <div className="snippet-actions">
        <Link
          to={`/snippet/${snippet._id}`}
          className="snippet-button view-link"
          aria-label={`View snippet ${snippet.title}`}
        >
          View Snippet
        </Link>

        <div className="star-icon">
          {snippet.isFavorite ? (
            <AiFillStar color="gold" title="Favorite" />
          ) : (
            <AiOutlineStar color="#ccc" title="Not Favorite" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SnippetCard;
