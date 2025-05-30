import { Link } from "react-router-dom";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../styles/snippetCard.css";

const SnippetCard = ({
  snippet,
  showDescription = false,
  showTags = true,
  showRemoveButton = false,
  onRemove,
}) => {
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

      {showTags && (
        <div className="snippet-tags">
          {snippet.tags?.map((tag) => (
            <span key={tag} className={`tag ${tag.toLowerCase()}`}>
              {tag}
            </span>
          ))}
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
          {snippet.code?.split("\n").slice(0, 10).join("\n")}
        </SyntaxHighlighter>
      </div>

      {showDescription && snippet.description && (
        <p className="snippet-description">{snippet.description}</p>
      )}

      <div className="snippet-actions">
        <Link to={`/snippet/${snippet._id}`} className="view-link">
          View Snippet
        </Link>

        {showRemoveButton ? (
          <button
            className="remove-snippet-btn"
            onClick={onRemove}
            title="Remove from folder"
          >
            Remove
          </button>
        ) : snippet.isFavorite ? (
          <AiFillStar color="gold" title="Favorite" />
        ) : (
          <AiOutlineStar color="#ccc" title="Not Favorite" />
        )}
      </div>
    </div>
  );
};

export default SnippetCard;
