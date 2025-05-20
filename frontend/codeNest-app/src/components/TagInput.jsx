import { useState } from "react";
import "../styles/tagInput.css";

const defaultSuggestedTags = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "API",
  "Authentication",
  "Hooks",
  "useState",
  "useEffect",
  "HTML",
  "CSS",
  "Routing",
  "Validation",
];

const TagInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [customTags, setCustomTags] = useState([]);

  const tags = value || [];

  const normalizedInput = inputValue.trim().toLowerCase();

  const allSuggestions = [
    ...new Set([
      ...defaultSuggestedTags.map((t) => t.toLowerCase()),
      ...customTags,
    ]),
  ];

  const filteredSuggestions = allSuggestions.filter(
    (tag) =>
      !tags.includes(tag) &&
      tag.includes(normalizedInput) &&
      normalizedInput.length > 0
  );

  const addTag = (tag) => {
    const newTag = tag.trim().toLowerCase();
    if (!newTag) return;

    if (!tags.includes(newTag)) {
      onChange([...tags, newTag]);
      if (!defaultSuggestedTags.map((t) => t.toLowerCase()).includes(newTag)) {
        setCustomTags((prev) =>
          prev.includes(newTag) ? prev : [...prev, newTag]
        );
      }
    }
    setInputValue(""); // Rensa fältet efter tillägg
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue) {
      onChange(tags.slice(0, tags.length - 1));
    }
  };

  const handleTagClick = (tag) => {
    if (!tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setInputValue(""); // Rensa efter klick
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((t) => t !== tagToRemove));
    if (!defaultSuggestedTags.includes(tagToRemove)) {
      setCustomTags((prev) => prev.filter((t) => t !== tagToRemove));
    }
  };

  return (
    <section className="form-section">
      <h3>Tags</h3>
      <input
        type="text"
        placeholder="Add tag and press Enter"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* Valda taggar */}
      <div className="selected-tags">
        {tags.map((tag) => (
          <span key={tag} className="tag-badge tag-selected">
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>
              ✕
            </button>
          </span>
        ))}
      </div>

      {/* Realtidsförslag */}
      {filteredSuggestions.length > 0 && (
        <div className="tag-badges">
          {filteredSuggestions.map((tag) => (
            <span
              key={tag}
              className="tag-badge"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </section>
  );
};

export default TagInput;
