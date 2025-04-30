import React, { useState } from "react";
import API from "../API/api";
import "../styles/createSnippet.css";
import { useNavigate } from "react-router-dom";

const CreateSnippet = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    language: "",
    category: "",
    tags: "",
    isFavorite: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()), // Convert string to array
      };

      const token = localStorage.getItem("token");

      await API.post("/snippets", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Snippet created successfully!");
      navigate("/dashboard");
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
        <input
          type="text"
          name="title"
          placeholder="Snippet Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="code"
          placeholder="Your Code Here"
          rows="8"
          value={formData.code}
          onChange={handleChange}
          required
        ></textarea>

        <textarea
          name="description"
          placeholder="Markdown Description (Optional)"
          rows="4"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <input
          type="text"
          name="language"
          placeholder="Language (e.g. JavaScript, Python)"
          value={formData.language}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="isFavorite"
            checked={formData.isFavorite}
            onChange={handleChange}
          />
          Mark as Favorite
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Snippet"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default CreateSnippet;
