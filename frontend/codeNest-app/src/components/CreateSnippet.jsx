import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API/api";
import "../styles/createSnippet.css";

import Toast from "./Toast";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import SnippetTypeSelector from "./SnippetTypeSelector";
import TagInput from "./TagInput";

import { languageToMonacoId } from "../config/snippetConfig";

const CreateSnippet = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    code: "",
    description: "",
    language: "",
    framework: "",
    category: "",
    tags: [],
    isFavorite: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");

  const getMonacoLanguage = () => {
    if (!formData.language) return "javascript";
    return languageToMonacoId[formData.language] || "javascript";
  };

  const getMarkdownSuggestions = (text) => {
    const suggestions = [];
    if (!text || text.trim().length === 0) return suggestions;

    if (!text.includes("#")) {
      suggestions.push({ label: "Heading", example: "# Title" });
    }
    if (!text.includes("**")) {
      suggestions.push({ label: "Bold", example: "**bold**" });
    }
    if (!text.includes("*") || !text.includes("_")) {
      suggestions.push({ label: "Italic", example: "*italic*" });
    }
    if (!text.includes("```")) {
      suggestions.push({ label: "Code block", example: "```js" });
    }
    if (!text.includes("- ")) {
      suggestions.push({ label: "List", example: "- item" });
    }
    if (!text.includes("](")) {
      suggestions.push({ label: "Link", example: "[text](url)" });
    }

    return suggestions;
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
    setIsLoading(true);

    //Enkel validering för kod
    if (!formData.code.trim()) {
      setError("Code field cannot be empty.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      };

      const token = localStorage.getItem("token");

      await API.post("/snippets", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setToastMessage("Snippet created successfully!");
      setToastType("create");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating snippet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-snippet-container">
      <h2>Create New Snippet</h2>
      <form onSubmit={handleSubmit}>
        {/*Titel*/}
        <input
          type="text"
          name="title"
          placeholder="Snippet Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        {/*Typ + språk / ramverk*/}

        <SnippetTypeSelector
          type={formData.type}
          language={formData.language}
          onTypeChange={(value) =>
            setFormData((prev) => ({ ...prev, type: value }))
          }
          onLanguageChange={(value) =>
            setFormData((prev) => ({ ...prev, language: value }))
          }
          onFrameworkChange={(value) =>
            setFormData((prev) => ({ ...prev, framework: value }))
          }
        />
        {/* Kod */}
        <section className="form-section">
          <h3>Code</h3>
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
        {/* Beskrivning */}
        <section className="form-section">
          <h3> Description (Markdown)</h3>
          <textarea
            name="description"
            placeholder="Write description in Markdown..."
            value={formData.description}
            onChange={handleChange}
            rows="6"
          />

          <div className="markdown-preview">
            <h4> Live Preview:</h4>
            <ReactMarkdown>{formData.description}</ReactMarkdown>

            {getMarkdownSuggestions(formData.description).length > 0 && (
              <section className="markdown-guide">
                <h4> Markdown Tips to better your description</h4>
                <div className="guide row">
                  {getMarkdownSuggestions(formData.description).map(
                    (s, idx) => (
                      <div key={idx}>
                        <strong>{s.label}:</strong> <code>{s.example}</code>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}
          </div>
        </section>
        {/* Kategori */}
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        {/* Taggar */}
        <TagInput
          value={formData.tags}
          onChange={(updatedTags) => {
            console.log("UPDATED TAGS:", updatedTags);
            setFormData((prev) => ({ ...prev, tags: updatedTags }));
          }}
        />

        {/* Favorit*/}
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
        {/* Skicka */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Snippet"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>

      <Toast message={toastMessage} visible={showToast} type={toastType} />
    </div>
  );
};

export default CreateSnippet;
