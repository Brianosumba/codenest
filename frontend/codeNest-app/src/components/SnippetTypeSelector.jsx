import React from "react";
import "../styles/SnippetTypeSelector.css";
import {
  frameworkLanguageMap,
  frontendLanguages,
  backendLanguages,
  frontendFrameworks,
  backendFrameworks,
} from "../config/snippetConfig";

const SnippetTypeSelector = ({
  type,
  language,
  onTypeChange,
  onLanguageChange,
}) => {
  const handleFrameworkSelect = (framework) => {
    const detectedLanguage = frameworkLanguageMap[framework] || "JavaScript";
    onLanguageChange(framework);
    onTypeChange("framework");
    console.log(`Framework selected: ${framework} => ${detectedLanguage}`);
  };

  return (
    <section className="form-section">
      <h3>Snippet Type</h3>
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        required
      >
        <option value="">-- Select Type --</option>{" "}
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
        <option value="framework">Frameworks</option>
      </select>

      <h4>Language / Framework</h4>
      {/* Frontend languages*/}
      {type === "frontend" && (
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          required
        >
          {" "}
          <option value="">-- Select Frontend Language --</option>
          {frontendLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      )}

      {/* Backend languages*/}
      {type == "backend" && (
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

      {/* Frameworks - visas oavsett typ (valbart)*/}
      {type === "framework" && (
        <>
          <h5>Frontend Frameworks</h5>
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

          <h5>Backend Frameworks</h5>
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
        </>
      )}
    </section>
  );
};

export default SnippetTypeSelector;
