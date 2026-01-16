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
].map((t) => t.toLowerCase());

const TagInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [customTags, setCustomTags] = useState([]);

  const tags = value || [];
  const normalizedInput = inputValue.trim().toLowerCase();

  const allSuggestions = [...new Set([...defaultSuggestedTags, ...customTags])];

  const filteredSuggestions = allSuggestions.filter(
    (tag) =>
      !tags.includes(tag) &&
      normalizedInput.length > 0 &&
      tag.includes(normalizedInput)
  );

  const addTag = (rawTag) => {
    const newTag = (rawTag || "").trim().toLowerCase();
    if (!newTag) return;

    if (!tags.includes(newTag)) {
      onChange([...tags, newTag]);

      if (!defaultSuggestedTags.includes(newTag)) {
        setCustomTags((prev) =>
          prev.includes(newTag) ? prev : [...prev, newTag]
        );
      }
    }

    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
      return;
    }

    if (e.key === "Backspace" && !inputValue) {
      onChange(tags.slice(0, tags.length - 1));
    }
  };

  const handleBlur = () => {
    // Lägg till taggen när man klickar ut ur fältet (super robust)
    if (normalizedInput) addTag(inputValue);
  };

  const handleTagClick = (tag) => {
    addTag(tag);
  };

  const removeTag = (tagToRemove) => {
    const normalized = tagToRemove.trim().toLowerCase();
    onChange(tags.filter((t) => t !== normalized));
    setCustomTags((prev) => prev.filter((t) => t !== normalized));
  };

  return (
    <section className="form-section">
      <h3>Tags</h3>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          placeholder="Add tag and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
        <button type="button" onClick={() => addTag(inputValue)}>
          Add
        </button>
      </div>

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
