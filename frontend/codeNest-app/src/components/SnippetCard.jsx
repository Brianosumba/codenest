import { Link } from "react-router-dom";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

import "../styles/snippetCard.css";
import { languageToMonacoId } from "../config/snippetConfig";

const SnippetCard = ({ snippet, showDescription = false, showTags = true }) => {
  const markdownComponents = {
    code({ inline, className, children, ...props }) {
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
    <div className="snippet-card">
      <div className="snippet-header">
        <div className="snippet-title-row">
          <h3 className="snippet-title">{snippet.title}</h3>
          {snippet.starter && <span className="snippet-badge">EXAMPLE</span>}
        </div>

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
          {snippet.tags.map((tag, i) => {
            const label = String(tag ?? "").trim();
            const safeClass = label.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
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
        <div className="snippet-description">
          <ReactMarkdown
            components={markdownComponents}
            disallowedElements={["p"]}
            unwrapDisallowed={true}
          >
            {snippet.description}
          </ReactMarkdown>
        </div>
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
