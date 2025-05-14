import React from "react";
import "../styles/SnippetExportSingle.css";

const SnippetExportSingle = ({ snippet }) => {
  const handleExport = () => {
    if (!snippet) return;

    //Förklraing + metadata i kommentar
    const header = `// 📄 Title: ${snippet.title}
    // 🧠 Language: ${snippet.language}
    // 📝 Description: 
    // ${snippet.description.replace(/\n/g, "\n// ")}
`;

    const finalCode = header + "\n" + snippet.code;

    //Bestäm filändelse baserat på språk
    const extensionMap = {
      JavaScript: "js",
      TypeScript: "ts",
      Python: "py",
      PHP: "php",
      Java: "java",
      CSharp: "cs",
      "C#": "cs",
      HTML: "html",
      CSS: "css",
    };

    const lang = snippet.language || "text";
    const ext = extensionMap[lang] || "txt";
    const filName = `${snippet.title.replace(/\s+/g, "_")}.${ext}`;

    const blob = new Blob([finalCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filName;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button className="export-btn" onClick={handleExport}>
      📤 Export Snippet
    </button>
  );
};

export default SnippetExportSingle;
