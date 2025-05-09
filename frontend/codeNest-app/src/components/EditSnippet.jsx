import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../API/api";
import "../styles/createSnippet.css";
import Toast from "./Toast";

const EditSnippet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

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
          tags: snippet.tags.join(", "),
        });
      } catch (err) {
        setError("Failed to load snippet.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSnippet();
  }, [id]);

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
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      const token = localStorage.getItem("token");
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
        <input
          name="title"
          placeholder="title"
          value={formData.title}
          onChange={handleChange}
          required
        />{" "}
        <textarea
          name="code"
          placeholder="code"
          rows="8"
          value={formData.code}
          onChange={handleChange}
          required
        ></textarea>{" "}
        <textarea
          name="description"
          placeholder="description"
          rows="6"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        <input
          name="language"
          placeholder="language"
          value={formData.language}
          onChange={handleChange}
        />
        <input
          name="category"
          placeholder="category"
          value={formData.category}
          onChange={handleChange}
        />
        <input
          name="tags"
          placeholder="tags"
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
        <button type="submit">Save Changes</button>
        {error && <p className="error">{error}</p>}
      </form>
      <Toast message={toastMessage} visible={showToast} type={toastType} />
    </div>
  );
};

export default EditSnippet;
