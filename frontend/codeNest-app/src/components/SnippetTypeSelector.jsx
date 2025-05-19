import "../styles/SnippetTypeSelector.css";
import {
  frameworkLanguageMap,
  frontendLanguages,
  backendLanguages,
  frontendFrameworks,
  backendFrameworks,
} from "../config/snippetConfig";
import { useState } from "react";

const SnippetTypeSelector = ({
  type,
  language,
  onTypeChange,
  onLanguageChange,
  onFrameworkChange,
}) => {
  const [frameworkCategory, setFrameworkCategory] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("");

  console.log("RENDER - Props:", { type, language });

  const handleFrameworkSelect = (framework) => {
    setSelectedFramework(framework);
    onFrameworkChange(framework);
    onLanguageChange("");
  };

  const handleTypeChange = (e) => {
    console.log("Type selected:", e.target.value);
    const selectedType = e.target.value;
    onTypeChange(selectedType);
    onLanguageChange("");
    onFrameworkChange("");
    setFrameworkCategory("");
    setSelectedFramework("");
  };

  const handleFrameworkCategoryChange = (e) => {
    const category = e.target.value;
    setFrameworkCategory(category);
    onFrameworkChange("");
    onLanguageChange("");
    setSelectedFramework("");
  };

  return (
    <>
      <section className="form-section">
        <h3>Snippet Type</h3>
        <select value={type} onChange={handleTypeChange} required>
          <option value="">-- Select Type --</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="framework">Frameworks</option>
        </select>

        <h4>Language / Framework</h4>

        {type === "frontend" && (
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            required
          >
            <option value="">-- Select Frontend Language --</option>
            {frontendLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang === "JavaScript"
                  ? "JavaScript (JS/JSX)"
                  : lang === "TypeScript"
                  ? "TypeScript (TS/TSX)"
                  : lang}
              </option>
            ))}
          </select>
        )}

        {type === "backend" && (
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            required
          >
            <option value="">-- Select Backend Language --</option>
            {backendLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        )}

        {type === "framework" && (
          <>
            <h5>Framework Type</h5>
            <select
              value={frameworkCategory}
              onChange={handleFrameworkCategoryChange}
              required
            >
              <option value="">-- Select Framework Type --</option>
              <option value="frontend">Frontend Frameworks</option>
              <option value="backend">Backend Frameworks</option>
            </select>

            {frameworkCategory === "frontend" && (
              <select
                onChange={(e) => handleFrameworkSelect(e.target.value)}
                required
              >
                <option value="">-- Select Frontend Framework --</option>
                {frontendFrameworks.map((fw) => (
                  <option key={fw} value={fw}>
                    {fw} ({frameworkLanguageMap[fw]})
                  </option>
                ))}
              </select>
            )}

            {frameworkCategory === "backend" && (
              <select
                onChange={(e) => handleFrameworkSelect(e.target.value)}
                required
              >
                <option value="">-- Select Backend Framework --</option>
                {backendFrameworks.map((fw) => (
                  <option key={fw} value={fw}>
                    {fw} ({frameworkLanguageMap[fw]})
                  </option>
                ))}
              </select>
            )}

            {selectedFramework && frameworkCategory && (
              <>
                <label>Choose language for {selectedFramework}:</label>
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value)}
                  required
                >
                  <option value="">--Select Language--</option>
                  {["JavaScript", "TypeScript"].map((lang) => (
                    <option key={lang} value={lang}>
                      {lang === "JavaScript"
                        ? "JavaScript (JS/JSX)"
                        : "TypeScript (TS/TSX)"}
                    </option>
                  ))}
                </select>
              </>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default SnippetTypeSelector;
