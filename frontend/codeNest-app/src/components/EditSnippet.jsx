import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../API/api";
import "../styles/createSnippet.css";

import Toast from "./Toast";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import SnippetTypeSelector from "./SnippetTypeSelector";

import {
  frameworkLanguageMap,
  languageToMonacoId,
} from "../config/snippetConfig";

const EditSnippet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const suggestedTags = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "API",
    "Authentication",
    "HTML",
    "CSS",
    "Routing",
    "Validation",
  ];

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/snippets/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const snippet = res.data;
        setFormData({
          ...snippet,
          tags: snippet.tags || [],
        });
      } catch (err) {
        setError("Failed to load snippet.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSnippet();
  }, [id]);

  const getMonacoLanguage = () => {
    if (formData.type === "framework") {
      const baseLang = frameworkLanguageMap[formData.language];
      return languageToMonacoId[baseLang] || "javascript";
    }
    return languageToMonacoId[formData.language] || "javascript";
  };

  const handleTagClick = (tag) => {
    const isSelected = formData.tags.includes(tag);
    const updatedTags = isSelected
      ? formData.tags.filter((t) => t !== tag)
      : [...formData.tags, tag];
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        tags: formData.tags.map((tag) => tag.toLowerCase()),
      };

      await API.put(`/snippets/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToastMessage("Snippet updated successfully!");
      setToastType("edit");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setToastMessage("Failed to update snippet");
      setToastType("info");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!formData) return <p>No data to edit.</p>;

  return (
    <div className="create-snippet-container">
      <h2>Edit Snippet</h2>
      <form onSubmit={handleSubmit}>
        {/* Titel */}
        <input
          name="title"
          placeholder="Snippet Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Typ + språk / ramverk */}
        <SnippetTypeSelector
          type={formData.type}
          language={formData.language}
          onTypeChange={(value) => setFormData({ ...formData, type: value })}
          onLanguageChange={(value) =>
            setFormData({ ...formData, language: value })
          }
        />

        {/* Monaco code editor */}
        <section className="form-section">
          <h3>💻 Code</h3>
          <Editor
            height="300px"
            language={getMonacoLanguage()}
            value={formData.code}
            onChange={(value) => setFormData({ ...formData, code: value })}
            theme="vs-dark"
            options={{
              fontSize: 14,
              wordWrap: "on",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </section>

        {/* Markdown description */}
        <section className="form-section">
          <h3>📝 Description (Markdown)</h3>
          <textarea
            name="description"
            placeholder="Write description in Markdown..."
            value={formData.description}
            onChange={handleChange}
            rows="6"
          />
          <div className="markdown-preview">
            <h4>📄 Preview:</h4>
            <ReactMarkdown>{formData.description}</ReactMarkdown>
          </div>
        </section>

        {/* Kategori */}
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        {/* Taggar */}
        <section className="form-section">
          <h3>🏷️ Tags</h3>
          <input
            type="text"
            placeholder="Add tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (tagInput.trim()) {
                  handleTagClick(tagInput.trim());
                  setTagInput("");
                }
              }
            }}
          />
          <div className="tag-badges">
            {suggestedTags.map((tag) => (
              <span
                key={tag}
                className={`tag-badge ${
                  formData.tags.includes(tag) ? "tag-selected" : ""
                }`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Favorit */}
        <div className="favorite-toggle">
          <label>
            <input
              type="checkbox"
              name="isFavorite"
              checked={formData.isFavorite}
              onChange={handleChange}
            />
            Mark as Favorite
          </label>
        </div>

        {/* Submit */}
        <button type="submit">Save Changes</button>
        {error && <p className="error">{error}</p>}
      </form>
      <Toast message={toastMessage} visible={showToast} type={toastType} />
    </div>
  );
};

export default EditSnippet;
